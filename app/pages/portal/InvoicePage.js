'use client'
const planConfig = require('@/app/plan.json')
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import SignaturePad from '@/app/components/other/SignaturePad'
import NavBar from '@/app/components/portal/navbar/NavBar'
import Sidebar from '@/app/components/portal/navbar/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db, storage } from '@/fauth/firebase'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Select from 'react-select'
import { ImageIcon, X, Signature } from "lucide-react";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import NewClient from '@/app/components/portal/client/NewClient'
import ProductNew from '@/app/components/portal/product/ProductNew'
import { Tooltip } from 'react-tooltip'
import Link from 'next/link'
// import html2pdf from 'html2pdf.js';
import GeneratePDF from './GeneratePDF'
// import { PDFDownloadLink } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import PDFTemplate01 from './PDFTemplate01'
import axios from 'axios'
import PDF_01 from '@/app/components/portal/pdf-preview/PDF_01'
import InvoiceGuide from '@/app/components/portal/invoice/InvoiceGuide'
import { getFunctions, httpsCallable } from 'firebase/functions'
import ActivityBar from '@/app/components/portal/ActivityBar'
import InvoiceActivityModal from '@/app/components/portal/invoice/InvoiceActivityModal'
import InvoiceActivityBar from '@/app/components/portal/invoice/InvoiceActivityBar'
import FeatureLimitModal from '@/app/components/modal/FeatureLimitModal'
import PlanLimit from '@/app/components/modal/PlanLimit'

const selectTheme = (theme) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary: 'var(--textPrimary)',
        primary25: 'var(--primaryPanel)',
        neutral0: 'var(--bgPanel)',
        neutral80: 'var(--textSecondary)'
    }
})

const selectStyles = {
    option: (provided, state) => ({
        ...provided,
        color: 'var(--textPrimary)',
        cursor: 'pointer',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--textPrimary)',
    })
};

const InvoicePage = (props) => {
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    function getDMY() {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
        return formattedDate;
    }
    function getTime() {
        const date = new Date();
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        return formattedTime;
    }
    const router = useRouter();
    const [invoiceURL, setInvoiceURL] = useState('-');
    const [currentCurrency, setCurrentCurrency] = useState(null);
    const [userCurrency, setUserCurrency] = useState("INR");
    const [iFooter, setIFooter] = useState("");
    const [clientList, setClientList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [featureLimit, setFeatureLimit] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { currentUser, userData, setUserData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isPDFPreview, setIsPDFPreview, isSignature, setIsSignature, isSignatureLink, isMenu, setIsMenu, isNewClient, setIsNewClient, isNewProduct, setIsNewProduct, productData, productDataReady, setIsUpdateProduct, isProductEdit, productEditArray, isNewProductTag, setIsNewProductTag, newProductTagID, setNewProductTagID } = useContext(FnContext);
    const [isPageReady, setIsPageReady] = useState(false);
    const [invoiceStatus, setInvoiceStatus] = useState('Draft')
    const [recentActivity, setRecentActivity] = useState(null);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [showRecordModal, setShowRecordModal] = useState(false)
    const [showNewRecordModal, setShowNewRecordModal] = useState(false)
    const [paymentHistory, setPaymentHistory] = useState(null);
    const [formPayment, setFormPayment] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        method: 'Cash',
        note: ''
    })
    const methods = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card', 'Net Banking', 'Paypal', 'Stripe', 'Credit']
    const updateInvoiceStatus = (e) => {
        setInvoiceStatus(e);
        updateRecentActivity(`Invoice marked as ${e}`);
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        try {
            updateDoc(docRef, { status: e });
        } catch (error) {
            toast.error('Server error occured! try again');
        }
    }
    const [invoiceMode, setInvoiceMode] = useState('Cash')
    const updateInvoiceMode = (e) => {
        setInvoiceMode(e);
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        try {
            updateDoc(docRef, { mode: e });
        } catch (error) {
            toast.error('Server error occured! try again');
        }
    }
    const [partialPayment, setPartialPayment] = useState({
        isPartial: 'No',
        amount: 0
    })
    const [isDirtyPartial, setIsDirtyPartial] = useState(false);
    const debounceTimerPartial = useRef(null);
    const partialHandler = (field, value) => {
        if (value == 'No') {
            setPartialPayment(prev => ({
                ...prev,
                [field]: value,
                amount: 0
            }))
        } else {
            setPartialPayment(prev => ({
                ...prev,
                [field]: value
            }))
        }
        setIsDirtyPartial(true);
    }
    useEffect(() => {
        updatePricing();
        if (!isDirtyPartial) return;
        clearTimeout(debounceTimerPartial.current);
        debounceTimerPartial.current = setTimeout(() => {
            savePartialData();
        }, 2000);
    }, [partialPayment])
    const savePartialData = async () => {
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        try {
            await updateDoc(docRef, { partialPayment: partialPayment });
        } catch (error) {
            toast.error('Server error occured! try again');
        }
    }
    useEffect(() => {
        setSignPreview(isSignatureLink);
    }, [isSignatureLink])
    const [legalInvoice, setLegalInvoice] = useState("");
    const [formData, setFormData] = useState({
        invoiceNo: "",
        invoiceDate: "",
        dueDate: "",
    });
    const [businessData, setBusinessData] = useState({
        name: "",
        mail: "",
        phone: "",
        address: "",
    })
    const [isDirty, setIsDirty] = useState(false);
    const [isDirtyBusiness, setIsDirtyBusiness] = useState(false);
    const debounceTimer = useRef(null);
    const debounceTimerBusiness = useRef(null);
    const handleChange = (field, value) => {
        setFormData((data) => ({
            ...data,
            [field]: value
        }))
        setIsDirty(true);
    }
    const businessChange = (field, value) => {
        setBusinessData((data) => ({
            ...data,
            [field]: value
        }))
        setIsDirtyBusiness(true);
    }
    useEffect(() => {
        if (!isDirtyBusiness) return;
        clearTimeout(debounceTimerBusiness.current);
        debounceTimerBusiness.current = setTimeout(() => {
            if (businessData.name != '') {
                saveBusinessData();
            } else {
                return;
            }
        }, 3000);
    }, [businessData])
    const saveBusinessData = async () => {
        const savingValue = {
            businessname: businessData.name,
            businessmail: businessData.mail,
            businessphone: businessData.phone,
            businessaddress: businessData.address
        }
        const docRef = doc(db, 'happyuser', currentUser.uid);
        try {
            await updateDoc(docRef, savingValue);
            const updatedUserData = {
                ...userData,
                businessname: businessData.name,
                businessmail: businessData.mail,
                businessphone: businessData.phone,
                businessaddress: businessData.address
            }
            setUserData(updatedUserData);
        } catch (error) {
            toast.error('Server error occured! try again');
        }
    }
    useEffect(() => {
        if (!isDirty) return;
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            saveToFirestore();
        }, 3000);
    }, [formData])
    const saveToFirestore = async () => {
        // firebasefn
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        updateDoc(docRef, formData);
        // try {
        //     if (legalInvoice != formData.invoiceNo) {
        //         setLoading(true);
        //         const docQuery = query(collection(db, 'happyuser', currentUser.uid, 'happyinvoice'), where('invoiceNo', '==', formData.invoiceNo));
        //         const snap = await getDocs(docQuery);
        //         if (!snap.empty) {
        //             if (snap.id != props.invoiceid) {
        //                 toast.error(`Invoice is already generated by ${formData.invoiceNo}`);
        //                 formData.invoiceNo = legalInvoice;
        //                 setLoading(false);
        //             } else {
        //                 await updateDoc(docRef, formData);
        //                 setLoading(false);
        //             }
        //         } else {
        //             await updateDoc(docRef, formData);
        //             setLoading(false);
        //         }
        //     } else {
        //         updateDoc(docRef, formData);
        //     }
        // } catch (error) {
        //     toast.error('Server error occured! try again : ' + error)
        // }
    }
    const [isClientSelected, setIsClientSelected] = useState(false);
    const [clientDataArray, setClientDataArray] = useState({
        id: "",
        name: "",
        mail: "",
        phone: "",
        address: ""
    })
    const clientHandler = async (uid) => {
        setLoading(true);
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyclient', uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            const value = {
                id: snap.id,
                name: snap.data().name,
                mail: snap.data().mail,
                phone: snap.data().phone,
                address: snap.data().address
            }
            setClientDataArray(value)
            const docInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
            await updateDoc(docInvoice, { client: value });
            setIsClientSelected(true);
            setLoading(false);
        } else {
            setIsClientSelected(false);
            setLoading(false);
            toast.error('Client not found!');
        }
    }
    const [productSelection, setProductSelection] = useState(null);
    const [productSubtotal, setProductSubtotal] = useState(0);
    const [productTax, setProductTax] = useState(0);
    const [productTotal, setProductTotal] = useState(0);
    const [productBalanceDue, setProductBalanceDue] = useState(0);
    const [isProductSelected, setIsProductSelected] = useState(false);
    const [productDataArray, setProductDataArray] = useState([]);
    const productHandler = async (pid) => {
        setLoading(true);
        var isThere = false;
        productDataArray.forEach(childData => {
            if (childData.id == pid) isThere = true;
        })
        if (!isThere) {
            const docRef = doc(db, 'happyuser', currentUser.uid, 'happyproduct', pid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                if (!currentCurrency || currentCurrency == snap.data().currency) {
                    setCurrentCurrency(snap.data().currency);
                    const value = {
                        id: snap.id,
                        name: snap.data().name,
                        price: snap.data().price,
                        currency: snap.data().currency,
                        description: snap.data().description,
                        tax: snap.data().tax,
                        type: snap.data().type,
                        qty: 1
                    }
                    const newProductArray = [...productDataArray];
                    newProductArray.push(value);
                    setProductDataArray(newProductArray);
                    const docInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
                    await updateDoc(docInvoice, { product: newProductArray });
                    setIsProductSelected(true);
                    setProductSelection(null);
                    setLoading(false);
                } else {
                    setLoading(false);
                    toast.error('Invoice should be in single Currency Format!');
                }
            } else {
                setIsProductSelected(false);
                setLoading(false);
                toast.error('Product not found!');
            }
        } else {
            setLoading(false);
        }
    }
    const [isDirtyProduct, setIsDirtyProduct] = useState(false);
    useEffect(() => {
        if (isReady && currentUser && userData) {
            if (!isDirtyProduct) return;
            const docInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
            updateDoc(docInvoice, { product: productDataArray });
        }
    }, [productDataArray])
    useEffect(() => {
        if (isReady && currentUser && userData) {
            updatePricing();
        }
    }, [productDataArray])
    const removeHandler = async (data, pid) => {
        setLoading(true);
        const newProductArray = [...productDataArray];
        const updatedProductArray = newProductArray.filter(product => product.id != pid)
        const docInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        await updateDoc(docInvoice, { product: updatedProductArray });
        if (updatedProductArray.length == 0) setCurrentCurrency(null);
        setProductDataArray(updatedProductArray);
        if (updatedProductArray.length == 0) {
            setProductSubtotal(0);
            setProductTax(0);
            setProductTotal(0);
            setProductBalanceDue(0);
            savePricingToFirestore(0, 0, 0, 0, 0);
        }
        setLoading(false);
    }
    const [taxData, setTaxData] = useState({
        taxType: 'Per Item',
        taxLabel: 'Tax',
        taxValue: 0,
        taxInclusive: false
    })
    const [isDirtyTax, setIsDirtyTax] = useState(false);
    const debounceTimerTax = useRef(null);
    const taxHandler = (field, value) => {
        setTaxData((data) => ({
            ...data,
            [field]: value
        }))
        setIsDirtyTax(true);
    }
    useEffect(() => {
        updatePricing();
        if (!isDirtyTax) return;
        clearTimeout(debounceTimerTax.current);
        debounceTimerTax.current = setTimeout(() => {
            if (taxData.taxLabel != '') {
                saveTaxToFirestore();
            } else {
                return;
            }
        }, 2000);
    }, [taxData])
    const saveTaxToFirestore = async () => {
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        await updateDoc(docRef, { tax: taxData });
    }
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountData, setDiscountData] = useState({
        discountType: 'None',
        discountValue: Number(0).toFixed(2),
    })
    const [isDirtyDiscount, setIsDirtyDiscount] = useState(false);
    const debounceTimerDiscount = useRef(null);
    const discountHandler = (field, value) => {
        if (field == 'discountType' && value == 'None') {
            setDiscountData({ discountType: 'None', discountValue: Number(0).toFixed(2) })
        } else {
            setDiscountData((data) => ({
                ...data,
                [field]: value
            }))
        }
        setIsDirtyDiscount(true);
    }
    useEffect(() => {
        updatePricing();
        if (!isDirtyDiscount) return;
        clearTimeout(debounceTimerDiscount.current);
        debounceTimerDiscount.current = setTimeout(() => {
            saveDiscountToFirestore();
        }, 2000);
    }, [discountData])
    const saveDiscountToFirestore = async () => {
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        await updateDoc(docRef, { discount: discountData });
    }
    const updatePricing = () => {
        var currentDiscount = 0;
        if (discountData.discountType != 'None') {
            currentDiscount = Number(discountData.discountValue) || 0;
        } else {
            currentDiscount = 0;
        }
        if (productDataArray.length > 0) {
            if (taxData.taxType == 'Per Item') {
                var subtotal = 0, tax = 0;
                productDataArray.forEach(child => {
                    subtotal += Number(child.price * child.qty);
                    tax += Number((child.price * child.qty * child.tax) / 100);
                })
                var total = subtotal + tax;
                var balance = total - partialPayment.amount - (discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100) : currentDiscount);
                setDiscountAmount(discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2))
                setProductSubtotal(subtotal.toFixed(2));
                setProductTax(tax.toFixed(2));
                setProductTotal(total.toFixed(2));
                setProductBalanceDue(balance.toFixed(2));
                savePricingToFirestore(subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2), balance.toFixed(2));
            } else if (taxData.taxType == 'On Total') {
                var subtotal = 0, tax = 0;
                productDataArray.forEach(child => {
                    subtotal += Number(child.price * child.qty);
                })
                tax = Number((subtotal * taxData.taxValue) / 100);
                var total = 0
                if (!taxData.taxInclusive) total = subtotal + tax;
                else total = subtotal;
                var balance = total - partialPayment.amount - (discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100) : currentDiscount);
                setDiscountAmount(discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2))
                setProductSubtotal(subtotal.toFixed(2));
                setProductTax(tax.toFixed(2));
                setProductTotal(total.toFixed(2));
                setProductBalanceDue(balance.toFixed(2));
                savePricingToFirestore(subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2), balance.toFixed(2));
            } else if (taxData.taxType == 'Deducted') {
                var subtotal = 0, tax = 0;
                productDataArray.forEach(child => {
                    subtotal += Number(child.price * child.qty);
                })
                tax = Number((subtotal * taxData.taxValue) / 100);
                var total = 0
                if (!taxData.taxInclusive) total = subtotal - tax;
                else total = subtotal;
                var balance = total - partialPayment.amount - (discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100) : currentDiscount);
                setDiscountAmount(discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2))
                setProductSubtotal(subtotal.toFixed(2));
                setProductTax(tax.toFixed(2));
                setProductTotal(total.toFixed(2));
                setProductBalanceDue(balance.toFixed(2));
                savePricingToFirestore(subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2), balance.toFixed(2));
            } else if (taxData.taxType == 'None') {
                var subtotal = 0, tax = 0;
                productDataArray.forEach(child => {
                    subtotal += Number(child.price * child.qty);
                })
                var total = subtotal - tax;
                var balance = total - partialPayment.amount - (discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100) : currentDiscount);
                setDiscountAmount(discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2))
                setProductSubtotal(subtotal.toFixed(2));
                setProductTax(tax.toFixed(2));
                setProductTotal(total.toFixed(2));
                setProductBalanceDue(balance.toFixed(2));
                savePricingToFirestore(subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2), balance.toFixed(2));
            }
        }
    }
    const savePricingToFirestore = (subtotalSave, taxSave, totalSave, discountSave, balanceSave) => {
        const summary = {
            subtotal: subtotalSave,
            tax: taxSave,
            total: totalSave,
            discount: discountSave,
            balance: balanceSave
        }
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        updateDoc(docRef, { summary: summary });
    }
    const loadInvoicePage = async () => {
        setLoading(true);
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            setInvoiceURL(`www.happyinvoice.com/${userData.username}/${props.invoiceid}`);
            setUserCurrency(userData.currency ? userData.currency : 'INR');
            setLogoPreview(userData.business.businesslogo);
            setBusinessData({
                name: userData.business.businessname,
                mail: userData.business.businessmail,
                phone: userData.business.businessphone,
                address: userData.business.businessaddress
            })
            setInvoiceStatus(snap.data().status);
            setRecentActivity(snap.data().recentActivity);
            if (snap.data().paymentHistory) setPaymentHistory(snap.data().paymentHistory)
            if (snap.data().mode) {
                setInvoiceMode(snap.data().mode);
            } else {
                updateInvoiceMode('Cash');
            }
            if (snap.data().partialPayment) {
                setPartialPayment({
                    isPartial: snap.data().partialPayment.isPartial,
                    amount: snap.data().partialPayment.amount
                })
            } else {
                savePartialData();
            }
            if (snap.data().tax) {
                setTaxData({
                    taxType: snap.data().tax.taxType,
                    taxLabel: snap.data().tax.taxLabel,
                    taxValue: snap.data().tax.taxValue,
                    taxInclusive: snap.data().tax.taxInclusive
                })
            } else {
                saveTaxToFirestore();
            }
            if (snap.data().discount) {
                if (snap.data().discount.discountType == 'None') {
                    setDiscountData({ discountType: 'None', discountValue: Number(0).toFixed(2) })
                } else {
                    setDiscountData({
                        discountType: snap.data().discount.discountType,
                        discountValue: snap.data().discount.discountValue
                    })
                }
            } else {
                saveDiscountToFirestore();
            }
            if (snap.data().onlinepay) {
                setOnlinePayment(snap.data().onlinepay);
            } else {
                setOnlinePayment('Yes');
                updateOnlinePayment('Yes');
            }
            if (snap.data().bankdetails) {
                setBankDetails(snap.data().bankdetails);
            } else {
                setBankDetails('Yes');
                updateBankDetails('Yes');
            }
            setSignPreview(snap.data().signature != '' ? snap.data().signature : null)
            setIFooter(snap.data().ifooter ? snap.data().ifooter : userData.business.iFooter);
            saveFooterNote(snap.data().ifooter ? snap.data().ifooter : userData.business.iFooter);
            if (snap.data().client) {
                setClientDataArray(snap.data().client)
                setIsClientSelected(true);
            }
            if (snap.data().product) {
                setProductDataArray(snap.data().product)
                setCurrentCurrency(snap.data().product[0].currency);
                setIsProductSelected(true);
            }
            setLegalInvoice(snap.data().invoiceNo);
            setFormData({
                invoiceNo: snap.data().invoiceNo,
                invoiceDate: snap.data().invoiceDate,
                dueDate: snap.data().dueDate
            })
            const theme = userData.theme ? userData.theme : 'green';
            if (theme == 'green') {
                setIsGreen(true);
            } else if (theme == 'blue') {
                setIsBlue(true);
            } else if (theme == 'red') {
                setIsRed(true);
            } else if (theme == 'purple') {
                setIsPurple(true);
            } else if (theme == 'orange') {
                setIsOrange(true);
            }
            if (isMenu) setIsMenu(false);
            setLoading(false);
        } else {
            router.replace('/portal');
        }
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            if (!isPageReady) {
                setIsPageReady(true);
                loadInvoicePage();
            }
        }
    }, [isReady, currentUser, userData])
    useEffect(() => {
        if (isReady && currentUser && userData) {
            const userClientArray = userData.clients ? userData.clients : [];
            const newClientList = [];
            userClientArray.forEach(child => {
                newClientList.push({ label: child.name, value: child.uid });
            })
            setClientList(newClientList);
            const userProductArray = userData.products ? userData.products : [];
            const newProductList = [];
            userProductArray.forEach(child => {
                newProductList.push({ label: child.product + ' - ' + child.price, value: child.pid });
            })
            setProductList(newProductList);
        }
    }, [isReady, currentUser, userData])
    const [isGreen, setIsGreen] = useState(false);
    const [isBlue, setIsBlue] = useState(false);
    const [isRed, setIsRed] = useState(false);
    const [isPurple, setIsPurple] = useState(false);
    const [isOrange, setIsOrange] = useState(false);
    const setTheme = async (color) => {
        if (color == 'green') {
            setLoading(true);
            const docTheme = doc(db, 'happyuser', currentUser.uid);
            await updateDoc(docTheme, { theme: 'green' });
            const docThemeInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
            await updateDoc(docThemeInvoice, { theme: 'green' });
            const updatedUserData = {
                ...userData,
                theme: 'green'
            }
            setUserData(updatedUserData);
            setIsGreen(true);
            setIsBlue(false);
            setIsRed(false);
            setIsPurple(false);
            setIsOrange(false);
            document.documentElement.style.setProperty('--primaryPanel', 'var(--primaryPanelSet)');
            document.documentElement.style.setProperty('--greenLightPanel', 'var(--greenLightPanelSet)');
            document.documentElement.style.setProperty('--greenLightestPanel', 'var(--greenLightestPanelSet)');
            document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--greenLightest2PanelSet)');
            document.documentElement.style.setProperty('--greenDarkPanel', 'var(--greenDarkPanelSet)');
            document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--greenDarkestPanelSet)');
            setLoading(false);
        } else if (color == 'blue') {
            setLoading(true);
            const docTheme = doc(db, 'happyuser', currentUser.uid);
            await updateDoc(docTheme, { theme: 'blue' });
            const docThemeInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
            await updateDoc(docThemeInvoice, { theme: 'blue' });
            const updatedUserData = {
                ...userData,
                theme: 'blue'
            }
            setUserData(updatedUserData);
            setIsBlue(true);
            setIsGreen(false);
            setIsRed(false);
            setIsPurple(false);
            setIsOrange(false);
            document.documentElement.style.setProperty('--primaryPanel', 'var(--bluePanel)');
            document.documentElement.style.setProperty('--greenLightPanel', 'var(--blueLightPanel)');
            document.documentElement.style.setProperty('--greenLightestPanel', 'var(--blueLightestPanel)');
            document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--blueLightest2Panel)');
            document.documentElement.style.setProperty('--greenDarkPanel', 'var(--blueDarkPanel)');
            document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--blueDarkestPanel)');
            setLoading(false);
        } else if (color == 'red') {
            setLoading(true);
            const docTheme = doc(db, 'happyuser', currentUser.uid);
            await updateDoc(docTheme, { theme: 'red' });
            const docThemeInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
            await updateDoc(docThemeInvoice, { theme: 'red' });
            const updatedUserData = {
                ...userData,
                theme: 'red'
            }
            setUserData(updatedUserData);
            setIsRed(true);
            setIsBlue(false);
            setIsGreen(false);
            setIsPurple(false);
            setIsOrange(false);
            document.documentElement.style.setProperty('--primaryPanel', 'var(--redPanel)');
            document.documentElement.style.setProperty('--greenLightPanel', 'var(--redLightPanel)');
            document.documentElement.style.setProperty('--greenLightestPanel', 'var(--redLightestPanel)');
            document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--redLightest2Panel)');
            document.documentElement.style.setProperty('--greenDarkPanel', 'var(--redDarkPanel)');
            document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--redDarkestPanel)');
            setLoading(false);
        } else if (color == 'purple') {
            setLoading(true);
            const docTheme = doc(db, 'happyuser', currentUser.uid);
            await updateDoc(docTheme, { theme: 'purple' });
            const docThemeInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
            await updateDoc(docThemeInvoice, { theme: 'purple' });
            const updatedUserData = {
                ...userData,
                theme: 'purple'
            }
            setUserData(updatedUserData);
            setIsPurple(true);
            setIsBlue(false);
            setIsGreen(false);
            setIsRed(false);
            setIsOrange(false);
            document.documentElement.style.setProperty('--primaryPanel', 'var(--purplePanel)');
            document.documentElement.style.setProperty('--greenLightPanel', 'var(--purpleLightPanel)');
            document.documentElement.style.setProperty('--greenLightestPanel', 'var(--purpleLightestPanel)');
            document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--purpleLightest2Panel)');
            document.documentElement.style.setProperty('--greenDarkPanel', 'var(--purpleDarkPanel)');
            document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--purpleDarkestPanel)');
            setLoading(false);
        } else if (color == 'orange') {
            setLoading(true);
            const docTheme = doc(db, 'happyuser', currentUser.uid);
            await updateDoc(docTheme, { theme: 'orange' });
            const docThemeInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
            await updateDoc(docThemeInvoice, { theme: 'orange' });
            const updatedUserData = {
                ...userData,
                theme: 'orange'
            }
            setUserData(updatedUserData);
            setIsOrange(true);
            setIsBlue(false);
            setIsGreen(false);
            setIsRed(false);
            setIsPurple(false);
            document.documentElement.style.setProperty('--primaryPanel', 'var(--orangePanel)');
            document.documentElement.style.setProperty('--greenLightPanel', 'var(--orangeLightPanel)');
            document.documentElement.style.setProperty('--greenLightestPanel', 'var(--orangeLightestPanel)');
            document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--orangeLightest2Panel)');
            document.documentElement.style.setProperty('--greenDarkPanel', 'var(--orangeDarkPanel)');
            document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--orangeDarkestPanel)');
            setLoading(false);
        }
    }
    const inputRef = useRef();
    const inputRefSign = useRef();
    const [logoPreview, setLogoPreview] = useState(null);
    const [signPreview, setSignPreview] = useState(null);
    const resetInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };
    const resetInputSign = () => {
        if (inputRefSign.current) {
            inputRefSign.current.value = '';
        }
    };
    const handleSignUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG files are allowed.', {
                    position: 'top-center',
                    theme: 'colored'
                });
                resetInputSign();
                return;
            }
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toast.error('File size must be less than 2MB.', {
                    position: 'top-center',
                    theme: 'colored'
                });
                resetInputSign();
                return;
            }
            setSignPreview(null);
            setLoading(true);
            try {
                const fileRef = ref(storage, `happysign/signature_${Date.now()}.png`);
                await uploadBytes(fileRef, file);
                const downloadUrl = await getDownloadURL(fileRef);
                // const dbRef = doc(db, 'happyuser', currentUser.uid);
                // await updateDoc(dbRef, { signature: downloadUrl });
                const dbInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
                await updateDoc(dbInvoice, { 'business.signature': downloadUrl });
                setSignPreview(URL.createObjectURL(file));
                setLoading(false);
                toast.success('Signature uploaded successfully!', {
                    position: 'top-center',
                    theme: 'colored'
                });
                resetInputSign();
            } catch (error) {
                setLoading(false);
                toast.error('Error: ' + error, {
                    position: 'top-center',
                    theme: 'colored'
                });
            }
        }
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG files are allowed.', {
                    position: 'top-center',
                    theme: 'colored'
                });
                resetInput();
                return;
            }
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toast.error('File size must be less than 2MB.', {
                    position: 'top-center',
                    theme: 'colored'
                });
                resetInput();
                return;
            }
            setLogoPreview(null);
            setLoading(true);
            try {
                const storageRef = ref(storage, `happylogo/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const downloadUrl = await getDownloadURL(storageRef);
                const docRef = doc(db, 'happyuser', currentUser.uid);
                await updateDoc(docRef, { 'business.businesslogo': downloadUrl });
                const updatedUserData = {
                    ...userData,
                    'business.businesslogo': downloadUrl
                }
                setUserData(updatedUserData);
                setLogoPreview(URL.createObjectURL(file));
                setLoading(false);
                toast.success('Logo uploaded successfully!', {
                    position: 'top-center',
                    theme: 'colored'
                });
                resetInput();
            } catch (error) {
                setLoading(false);
                toast.error('Error: ' + error, {
                    position: 'top-center',
                    theme: 'colored'
                });
            }
        }
    };
    const removeLogo = async (e) => {
        e.stopPropagation();
        setLogoPreview(null);
        setLoading(true);
        const docRef = doc(db, 'happyuser', currentUser.uid);
        try {
            await updateDoc(docRef, { 'business.businesslogo': '' });
            const updatedUserData = {
                ...userData,
                'business.businesslogo': ''
            }
            setUserData(updatedUserData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error: ' + error, {
                position: 'top-center',
                theme: 'colored'
            });
        }
    };
    const removeSign = async (e) => {
        e.stopPropagation();
        setSignPreview(null);
        setLoading(true);
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        try {
            await updateDoc(docRef, { 'business.signature': '' });
            setLoading(false);
            // toast.success('Signature removed successfully!');
        } catch (error) {
            setLoading(false);
            toast.error('Error: ' + error, {
                position: 'top-center',
                theme: 'colored'
            });
        }
    };
    const saveFooterNote = (value) => {
        const docInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        updateDoc(docInvoice, { ifooter: value });
    }
    const copyURL = async () => {
        try {
            setLoading(true);
            await navigator.clipboard.writeText(invoiceURL);
            setLoading(false);
            toast.success('Invoice Url copied to clipboard!');
        } catch (error) {
            setLoading(false);
            toast.error('Failed to copy: ' + error);
        }
    }
    const [onlinePayment, setOnlinePayment] = useState('Yes');
    const updateOnlinePayment = (value) => {
        setOnlinePayment(value);
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        updateDoc(docRef, { onlinepay: value });
    }
    const [bankDetails, setBankDetails] = useState('Yes');
    const updateBankDetails = (value) => {
        setBankDetails(value);
        const docRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
        updateDoc(docRef, { bankdetails: value });
    }
    const [base64LogoPreview, setBase64LogoPreview] = useState('');
    const [base64SignPreview, setBase64SignPreview] = useState('');
    const [pdfDataPreview, setPdfDataPreview] = useState({});
    const showPreview = async () => {
        setLoading(true);
        setBase64LogoPreview(userData.businesslogo != '' ? await convertLoadedLogoToBase64() : '');
        setBase64SignPreview(signPreview ? await convertLoadedSignToBase64() : '');
        setPdfDataPreview({
            invoice: formData,
            business: businessData,
            client: clientDataArray,
            product: productDataArray,
            currency: currentCurrency,
            tax: taxData,
            discount: discountData,
            partialPayment: partialPayment,
            summary: {
                subtotal: productSubtotal,
                tax: productTax,
                total: productTotal,
                discount: discountAmount,
                balance: productBalanceDue
            },
            footerNote: iFooter,
            isBank: bankDetails,
            theme: {
                main: userData.theme == 'green' ? '#2BB673' : userData.theme == 'blue' ? '#2B6CB0' : userData.theme == 'red' ? '#E53E3E' : userData.theme == 'purple' ? '#805AD5' : userData.theme == 'orange' ? '#F97316' : '#2BB673',
                light: userData.theme == 'green' ? '#A7EBC6' : userData.theme == 'blue' ? '#A3C9F5' : userData.theme == 'red' ? '#FEB2B2' : userData.theme == 'purple' ? '#D6BCFA' : userData.theme == 'orange' ? '#FECBA4' : '#2BB673'
            },
        });
        setIsPDFPreview(true);
        setLoading(false);
    }
    const openPDFInNewTab = async () => {
        setLoading(true);
        try {
            const base64Logo = userData.businesslogo != '' ? await convertLoadedLogoToBase64() : '';
            const base64Sign = signPreview ? await convertLoadedSignToBase64() : '';
            const pdfData = {
                invoice: formData,
                business: businessData,
                client: clientDataArray,
                product: productDataArray,
                currency: currentCurrency,
                tax: taxData,
                discount: discountData,
                partialPayment: partialPayment,
                summary: {
                    subtotal: productSubtotal,
                    tax: productTax,
                    total: productTotal,
                    discount: discountAmount,
                    balance: productBalanceDue
                },
                footerNote: iFooter,
                isBank: bankDetails,
                theme: {
                    main: userData.theme == 'green' ? '#2BB673' : userData.theme == 'blue' ? '#2B6CB0' : userData.theme == 'red' ? '#E53E3E' : userData.theme == 'purple' ? '#805AD5' : userData.theme == 'orange' ? '#F97316' : '#2BB673',
                    light: userData.theme == 'green' ? '#A7EBC6' : userData.theme == 'blue' ? '#A3C9F5' : userData.theme == 'red' ? '#FEB2B2' : userData.theme == 'purple' ? '#D6BCFA' : userData.theme == 'orange' ? '#FECBA4' : '#2BB673'
                },
            }
            const blob = await pdf(<PDFTemplate01 logoBase64={base64Logo} signBase64={base64Sign} pdfData={pdfData} />).toBlob();
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
            updateRecentActivity(`PDF generated.`);
            setLoading(false);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error('Failed to generate PDF. check console for details.');
            setLoading(false);
        }
    };
    const logoRef = useRef();
    const signRef = useRef();
    const convertLoadedLogoToBase64 = () => {
        return new Promise((resolve, reject) => {
            try {
                const img = logoRef.current;
                if (!img) {
                    resolve('');
                    return;
                }
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (error) {
                console.error("Logo conversion error (CORS?):", error);
                // Return empty string if conversion fails (e.g. CORS) so PDF can still generate without logo
                resolve('');
            }
        });
    };
    const convertLoadedSignToBase64 = () => {
        return new Promise((resolve, reject) => {
            try {
                const img = signRef.current;
                if (!img) {
                    resolve('');
                    return;
                }
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (error) {
                console.error("Signature conversion error (CORS?):", error);
                resolve('');
            }
        });
    };
    const sendMailToClient = async () => {
        if (planConfig[userData.planAnalysis.plan].features.emailInvoice) {
            setLoading(true);
            try {
                const functions = getFunctions();
                const callMailInvoice = httpsCallable(functions, 'mailInvoiceToClient');
                const response = await callMailInvoice({
                    invoiceId: props.invoiceid
                });
                if (response.data.success) {
                    toast.success('Invoice emailed successfully!');
                    updateInvoiceStatus('Sent')
                    updateRecentActivity(`Invoice mailed to ${clientDataArray.name}.`);
                    setLoading(false);
                } else {
                    if (response.data.type == 'UpgradePlan') {
                        setFeatureLimit('Email')
                        setShowFeatureModal(true);
                    } else {
                        toast.error(response.data.message);
                        setLoading(false);
                    }
                }
            } catch (error) {
                toast.error('Error: ' + error.message);
                setLoading(false);
            }
        } else {
            setFeatureLimit('Email')
            setShowFeatureModal(true);
        }
    }
    const updateRecentActivity = async (activity) => {
        try {
            const docRef = doc(db, 'happyuser', currentUser.uid);
            const invRef = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid);
            const newActivity = recentActivity ? recentActivity : [];
            // if (newActivity.length == 3 || newActivity[0] == '') newActivity.pop();
            newActivity.unshift({
                date: getDMY(),
                time: getTime(),
                message: activity
            });
            setRecentActivity(newActivity);
            const newActivityMain = userData.activity ? userData.activity : [];
            if (newActivityMain.length == 3 || newActivityMain[0] == '') newActivityMain.pop();
            newActivityMain.unshift(`#${formData.invoiceNo} : ${activity}`);
            const updatedUserData = {
                ...userData,
                activity: newActivityMain
            }
            setUserData(updatedUserData);
            await updateDoc(docRef, { activity: newActivityMain })
            await updateDoc(invRef, { recentActivity: newActivity })
        } catch (error) {
            toast.error('Error: ' + error.message);
        }
    }
    // record payment modal
    const partialHandlerWithHistory = (isPartialValue, amountValue) => {
        setPartialPayment({
            isPartial: isPartialValue,
            amount: amountValue
        })
        setIsDirtyPartial(true);
    }
    const savePayment = async () => {
        if (!formPayment.amount || !formPayment.date) return alert('Please fill required fields')
        try {
            const newHistory = paymentHistory ? paymentHistory : [];
            newHistory.unshift(formPayment);
            setLoading(true)
            await updateDoc(doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid), {
                paymentHistory: newHistory
            })
            partialHandlerWithHistory("Yes", Number(partialPayment.amount) + Number(formPayment.amount))
            updateRecentActivity(`${productDataArray ? currencyShow[productDataArray[0].currency] : ''} ${formPayment.amount} received via ${formPayment.method}.`);
            setPaymentHistory(newHistory);
            setShowNewRecordModal(false);
            setFormPayment({
                amount: '',
                date: new Date().toISOString().split('T')[0],
                method: 'Cash',
                note: ''
            })
        } catch (err) {
            toast.error('Error: ' + err.message);
        } finally {
            setLoading(false)
        }
    }
    const removePayment = async (entry, index) => {
        try {
            setLoading(true)
            const newHistory = paymentHistory.filter((value, indexHistory) => {
                if (indexHistory == index) return false;
                return true;
            });
            await updateDoc(doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.invoiceid), {
                paymentHistory: newHistory
            })
            if ((partialPayment.amount - Number(entry.amount)) == 0) partialHandlerWithHistory("No", 0)
            else partialHandlerWithHistory("Yes", Number(partialPayment.amount) - Number(entry.amount))
            updateRecentActivity(`${productDataArray ? currencyShow[productDataArray[0].currency] : ''} ${formPayment.amount} payment removed.`);
            setPaymentHistory(newHistory);
        } catch (err) {
            toast.error('Error: ' + err.message);
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {isMenu && (
                <Sidebar page="no-menu" />
            )}
            {loading && (
                <Loading />
            )}
            {isPDFPreview && (
                <PDF_01 logoBase64={base64LogoPreview} signBase64={base64SignPreview} pdfData={pdfDataPreview} />
            )}
            {isNewClient && (
                <NewClient />
            )}
            {isNewProduct && (
                <ProductNew currency={userCurrency} />
            )}
            {isSignature && (
                <SignaturePad id={props.invoiceid} />
            )}
            {showFeatureModal && (
                <FeatureLimitModal
                    feature={featureLimit}
                    onUpgrade={() => router.push("/upgrade")}
                    onClose={() => setShowFeatureModal(false)}
                />
            )}
            {showSettings && (
                <div className="fixed inset-0 z-40 px-5 flex items-center justify-center bg-black/50">
                    <div className="bg-[var(--bgPanel)] rounded-xl shadow-lg w-full max-w-sm overflow-hidden max-h-[80vh]">
                        {/* Header */}
                        <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                <i className="fa-solid fa-gear text-[var(--primaryPanel)] text-sm"></i>
                                Settings
                            </h3>
                            <button onClick={() => { setShowSettings(false) }} className="text-gray-900 cursor-pointer hover:text-[var(--textPrimary)] text-2xl">&times;</button>
                        </div>
                        {/* Body */}
                        <div className="py-5 px-7 text-sm space-y-3 overflow-y-auto max-h-[calc(80vh-133px)]">
                            {/* Online Payment */}
                            <div>
                                <label className="block font-medium mb-1 text-[var(--textSecondary)]">
                                    Accept Online Payment <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={onlinePayment}
                                    onChange={(e) => updateOnlinePayment(e.target.value)}
                                    className="happyinput"
                                >
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                            {/* Bank Details */}
                            <div>
                                <label
                                    className="block font-medium mb-1 text-[var(--textSecondary)]"
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Show bank details on invoice"
                                    data-tooltip-place="top"
                                >
                                    Show Bank Details <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={bankDetails}
                                    onChange={(e) => updateBankDetails(e.target.value)}
                                    className="happyinput"
                                >
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                                <Link href="/portal/settings" className="block w-fit mt-3">
                                    <button className="text-xs px-4 py-[8px] rounded-md font-semibold bg-[var(--primaryPanel)] text-white cursor-pointer hover:bg-[var(--greenDarkPanel)] hover:text-white transition">
                                        Edit Bank Details <i className="fa-solid fa-angle-right ml-1"></i>
                                    </button>
                                </Link>
                                <p className="text-xs italic text-[var(--textSecondary)] mt-1 flex items-center">
                                    <i className="fa-solid fa-angle-right mr-1 text-[10px]"></i>
                                    edit bank details from settings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showRecordModal && (
                <div className="fixed inset-0 z-40 px-5 flex items-center justify-center bg-black/50">
                    <div className="bg-[var(--bgPanel)] rounded-xl shadow-lg w-full max-w-md overflow-hidden max-h-[80vh]">
                        {/* Header */}
                        <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                <i className="fa-solid fa-money-check-dollar text-[var(--primaryPanel)] text-sm"></i>
                                Payment History
                            </h3>
                            <button onClick={() => { setShowRecordModal(false) }} className="text-gray-900 cursor-pointer hover:text-[var(--textPrimary)] text-2xl">&times;</button>
                        </div>
                        {/* Body */}
                        <div className="p-5 space-y-3 overflow-y-auto max-h-[calc(80vh-133px)]">
                            {paymentHistory && paymentHistory?.length > 0 ? (
                                paymentHistory.map((entry, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg px-4 py-3 bg-[var(--cardPanel)] hover:bg-[var(--cardPanel)] transition-all flex justify-between items-start group"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-[var(--textPrimary)]">
                                                {productDataArray ? currencyShow[productDataArray[0].currency] : ''} {Number(entry.amount).toFixed(2)}
                                                <span className="text-xs text-[var(--textSecondary)] ml-2">({entry.method})</span>
                                            </p>
                                            <p className="text-xs text-[var(--textSecondary)] mt-1">Date: {entry.date}</p>
                                            {entry.note && (
                                                <p className="text-xs italic text-gray-400 mt-1">"{entry.note}"</p>
                                            )}
                                        </div>
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => removePayment(entry, index)}
                                            className="text-gray-400 cursor-pointer hover:text-red-500 text-sm transition"
                                            title="Delete payment"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-[var(--textSecondary)]">No payments recorded yet.</p>
                            )}
                        </div>
                        {/* Footer */}
                        <div className="p-5 border-t">
                            <button
                                onClick={() => setShowNewRecordModal(true)}
                                className="w-full text-sm px-4 py-2 cursor-pointer rounded-md bg-[var(--primaryPanel)] hover:bg-[var(--greenDarkPanel)] text-white font-semibold"
                            >
                                + Record New Payment
                            </button>
                        </div>
                    </div>
                    {/* Record Modal */}
                    {showNewRecordModal && (
                        <div className="fixed inset-0 z-45 px-5 flex items-center justify-center bg-black/50">
                            <div className="bg-[var(--bgPanel)] rounded-xl shadow-lg w-full max-w-sm overflow-hidden max-h-[80vh]">
                                {/* Header */}
                                <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                        <i className="fa-solid fa-pen-to-square text-[var(--primaryPanel)] text-sm"></i>
                                        Record Payment
                                    </h3>
                                    <button onClick={(onClose) => { setShowNewRecordModal(false) }} className="text-gray-900 cursor-pointer hover:text-[var(--textPrimary)] text-2xl">&times;</button>
                                </div>
                                {/* Form */}
                                <div className="px-6 pt-5 pb-4 space-y-4 text-sm text-[var(--textSecondary)] max-h-[calc(80vh-56px)] overflow-y-auto">
                                    <div>
                                        <label className="block mb-1 font-medium">Amount ({productDataArray ? currencyShow[productDataArray[0].currency] : ''})<span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={formPayment.amount}
                                            onChange={(e) => setFormPayment({ ...formPayment, amount: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border-2 border-gray-400 focus:border-[var(--primaryPanel)] outline-none"
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Date <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={formPayment.date}
                                            onChange={(e) => setFormPayment({ ...formPayment, date: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border-2 border-gray-400 focus:border-[var(--primaryPanel)] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Method</label>
                                        <select
                                            value={formPayment.method}
                                            onChange={(e) => setFormPayment({ ...formPayment, method: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border-2 border-gray-400 focus:border-[var(--primaryPanel)] outline-none"
                                        >
                                            {methods.map((m, i) => (
                                                <option key={i}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Note</label>
                                        <textarea
                                            value={formPayment.note}
                                            onChange={(e) => setFormPayment({ ...formPayment, note: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-md border-2 border-gray-400 focus:border-[var(--primaryPanel)] outline-none"
                                            placeholder="Optional note"
                                        ></textarea>
                                    </div>
                                </div>
                                {/* Footer */}
                                <div className="py-3 px-5 border-t flex justify-end">
                                    <button
                                        onClick={() => { savePayment() }}
                                        disabled={loading}
                                        className="px-4 py-2 cursor-pointer text-sm font-semibold rounded-md bg-[var(--primaryPanel)] hover:bg-[var(--greenDarkPanel)] text-white"
                                    >
                                        {loading ? 'Saving...' : 'Save Payment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <InvoiceActivityModal
                show={showActivityModal}
                onClose={() => setShowActivityModal(false)}
                recentActivity={recentActivity} />
            <ToastContainer />
            <Tooltip id="my-tooltip" />
            <div className='flex h-screen max-w-screen bg-[var(--bgPanel)]'>
                <div className='min-h-full hidden xl:block'>
                    <NavBar page="no-menu" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen overflow-y-auto'>
                    <UpgradeBar />
                    <div className='border-b-2 px-6 border-[var(--greenLightPanel)] py-4 flex xl:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1'><span className='text-[var(--primaryPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex xl:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-4 md:px-8'>
                        <div className='flex flex-col sm:flex-row gap-6 sm:gap-4'>
                            <div className='flex-1 mx-1 md:mx-0'>
                                <div className='flex justify-start items-center'>
                                    <div className='flex gap-2 justify-start items-center'>
                                        <h1 className='text-xl font-semibold text-[var(--textPrimary)]'>#{formData.invoiceNo} Invoice</h1>
                                        {invoiceStatus == 'Draft' && (
                                            <div className='inline-block px-3 py-1 rounded-md bg-yellow-200 hover:bg-yellow-300 cursor-pointer text-yellow-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is saved as a draft. Not yet sent to the client." data-tooltip-place="top">
                                                DRAFT
                                            </div>
                                        )}
                                        {invoiceStatus == 'Sent' && (
                                            <div className='inline-block px-3 py-1 rounded-md bg-blue-200 hover:bg-blue-300 cursor-pointer text-blue-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice has been sent to the client but not yet viewed." data-tooltip-place="top">
                                                SENT
                                            </div>
                                        )}
                                        {invoiceStatus == 'Viewed' && (
                                            <div className='inline-block px-3 py-1 rounded-md bg-purple-200 hover:bg-purple-300 cursor-pointer text-purple-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Client has viewed the invoice. Awaiting payment." data-tooltip-place="top">
                                                VIEWED
                                            </div>
                                        )}
                                        {invoiceStatus == 'Payment Due' && (
                                            <div className='inline-block px-3 py-1 rounded-md bg-red-200 hover:bg-red-300 cursor-pointer text-red-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is unpaid and past its due date. Payment reminder may be needed" data-tooltip-place="top">
                                                PAYMENT DUE
                                            </div>
                                        )}
                                        {invoiceStatus == 'Paid' && (
                                            <div className='inline-block px-3 py-1 rounded-md bg-green-200 hover:bg-green-300 cursor-pointer text-green-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is fully paid. No further action needed." data-tooltip-place="top">
                                                PAID
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-[var(--textSecondary)]'>create and edit invoices within seconds!</h3>
                            </div>
                            <div className='flex gap-3 justify-between md:justify-end'>
                                <div>
                                    <button onClick={() => { showPreview() }} className='text-xs bg-[var(--cardPanel)] cursor-pointer font-medium px-4 py-2 border border-gray-500/30 rounded-md text-[var(--textSecondary)] hover:border-blue-500 hover:text-blue-500 transition'>PREVIEW</button>
                                </div>
                                <div>
                                    <button onClick={() => { openPDFInNewTab() }} className='text-xs bg-[var(--cardPanel)] cursor-pointer font-medium px-4 py-2 border border-gray-500/30 rounded-md text-[var(--textSecondary)] hover:border-red-500 hover:text-red-500 transition'>PDF</button>
                                    <button onClick={() => { sendMailToClient() }} className='text-xs ml-2 py-2 px-4 bg-[var(--primaryPanel)] text-[var(--textTrans)] font-semibold rounded-md cursor-pointer hover:opacity-80 active:opacity-80'>EMAIL <i className='fa-solid fa-angle-right ml-2'></i></button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-2 sm:mt-5 mb-5 max-w-full flex flex-col lg:flex-row gap-4'>
                            <div className='flex-1 flex flex-col gap-4'>
                                {/* invoice details */}
                                {/* bg-[#F6F7F9] */}
                                <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    {/* Header */}
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                                            <i className="fa-solid fa-receipt text-[var(--primaryPanel)] text-sm"></i>
                                            <span>Invoice Details</span>
                                        </h3>
                                    </div>
                                    {/* Content */}
                                    <div className="px-5 md:px-6 pt-5 pb-6">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* Invoice Number */}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[var(--textSecondary)] mb-1">
                                                    Invoice Number <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    type="text"
                                                    name="invoiceNo"
                                                    value={formData.invoiceNo}
                                                    onChange={(e) => handleChange('invoiceNo', e.target.value)}
                                                    placeholder="e.g. INV-1001"
                                                    className="happyinput"
                                                />
                                            </div>
                                            {/* Invoice Date */}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[var(--textSecondary)] mb-1">
                                                    Invoice Date <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    type="date"
                                                    name="invoiceDate"
                                                    value={formData.invoiceDate}
                                                    onChange={(e) => handleChange('invoiceDate', e.target.value)}
                                                    className="happyinput"
                                                />
                                            </div>
                                            {/* Due Date */}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[var(--textSecondary)] mb-1">
                                                    Due Date <span className="text-xs text-gray-400">(optional)</span>
                                                </p>
                                                <input
                                                    type="date"
                                                    name="dueDate"
                                                    value={formData.dueDate}
                                                    onChange={(e) => handleChange('dueDate', e.target.value)}
                                                    className="happyinput"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col md:flex-row gap-4'>
                                    {/* business details */}
                                    <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                        {/* Header */}
                                        <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                                                <i className="fa-solid fa-briefcase text-[var(--primaryPanel)] text-sm"></i>
                                                <span>Invoice From</span>
                                            </h3>
                                            <Link href='/portal/settings'><button
                                                className="text-xs font-semibold cursor-pointer text-[var(--textPrimary)] hover:underline transition duration-200 flex items-center gap-1"
                                            >
                                                <i className="fa-solid fa-pen text-[10px]"></i> Edit <span className='hidden md:inline-block'>in Settings</span>
                                            </button></Link>
                                        </div>
                                        {/* Content */}
                                        <div className="px-6 pt-5 pb-6 flex flex-col items-start gap-4">
                                            {/* Logo Upload */}
                                            <div>
                                                <div
                                                    className="w-60 h-15 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-[var(--bgPanel)] hover:border-[var(--primaryPanel)] cursor-pointer transition"
                                                    onClick={() => inputRef.current.click()}
                                                >
                                                    {logoPreview ? (
                                                        <div className="w-full h-full relative group">
                                                            <img
                                                                src={logoPreview}
                                                                ref={logoRef}
                                                                alt="Logo Preview"
                                                                crossOrigin="anonymous"
                                                                className="object-contain w-full h-full rounded"
                                                            />
                                                            <button
                                                                onClick={removeLogo}
                                                                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 group-hover:opacity-100 opacity-100 transition"
                                                                title="Remove Logo"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-gray-400">
                                                            <ImageIcon className="w-6 h-6" />
                                                            <span className="mt-1 text-xs font-medium">+ Logo</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    ref={inputRef}
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            <div className="bg-[var(--cardPanel)] rounded-md px-4 py-3 w-full flex flex-col gap-1 text-sm text-[var(--textSecondary)]">
                                                <p className="text-base font-semibold text-[var(--textPrimary)]">{businessData.name || '-'}</p>
                                                <div className="flex gap-3 items-start">
                                                    <i className="fa-solid fa-envelope text-[var(--primaryPanel)] mt-[3px] text-xs"></i>
                                                    <span className="text-sm text-[var(--textSecondary)]">{businessData.mail || '—'}</span>
                                                </div>
                                                <div className="flex gap-3 items-start">
                                                    <i className="fa-solid fa-phone text-[var(--primaryPanel)] mt-[3px] text-xs"></i>
                                                    <span className="text-sm text-[var(--textSecondary)]">{businessData.phone || '—'}</span>
                                                </div>
                                                <div className="flex gap-3 items-start">
                                                    <i className="fa-solid fa-location-dot text-[var(--primaryPanel)] mt-[3px] text-xs"></i>
                                                    <span className="text-sm text-[var(--textSecondary)] whitespace-pre-line">
                                                        {businessData.address || '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* client details */}
                                    <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                        <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                                                <i className="fa-solid fa-user text-[var(--primaryPanel)] text-sm"></i>
                                                <span>Invoice To</span>
                                            </h3>
                                            <button
                                                onClick={() => setIsNewClient(true)}
                                                className="text-xs font-semibold cursor-pointer text-[var(--textPrimary)] hover:underline transition duration-200 flex items-center gap-1">
                                                <i className="fa-solid fa-plus text-[10px]"></i> Add Client
                                            </button>
                                        </div>
                                        <div className="px-4 md:px-6 pt-5 pb-6">
                                            <div className="mb-4 w-full max-w-sm">
                                                <p className="text-sm font-semibold text-[var(--textSecondary)] mb-[1px]">
                                                    Select Client <span className="text-red-500">*</span>
                                                </p>
                                                <Select
                                                    options={clientList}
                                                    theme={selectTheme}
                                                    styles={selectStyles}
                                                    onChange={(e) => clientHandler(e.value)}
                                                    className="text-sm w-full border border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)]"
                                                />
                                            </div>
                                            {isClientSelected && (
                                                <div className="bg-[var(--cardPanel)] rounded-md px-4 py-3 shadow-sm text-sm text-[var(--textSecondary)] space-y-1">
                                                    <div className="font-semibold text-[15px] text-[var(--textPrimary)] leading-tight">
                                                        {clientDataArray.name}
                                                    </div>
                                                    {clientDataArray.mail && (
                                                        <div className="flex items-center text-[var(--textSecondary)] mt-2">
                                                            <i className="fa-solid fa-envelope text-[var(--primaryPanel)] text-xs mr-2"></i>
                                                            <span className="truncate">{clientDataArray.mail}</span>
                                                        </div>
                                                    )}
                                                    {clientDataArray.phone && (
                                                        <div className="flex items-center text-[var(--textSecondary)]">
                                                            <i className="fa-solid fa-phone text-[var(--primaryPanel)] text-xs mr-2"></i>
                                                            <span className="truncate">{clientDataArray.phone}</span>
                                                        </div>
                                                    )}
                                                    {clientDataArray.address && (
                                                        <div className="flex items-start text-[var(--textSecondary)]">
                                                            <i className="fa-solid fa-location-dot text-[var(--primaryPanel)] text-xs mr-2 mt-[2px]"></i>
                                                            <span className="truncate">{clientDataArray.address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                                            <i className="fa-solid fa-box-open text-[var(--primaryPanel)] text-sm"></i>
                                            <span>Products</span>
                                        </h3>
                                        <button
                                            onClick={() => setIsNewProduct(true)}
                                            className="text-xs font-semibold cursor-pointer text-[var(--textPrimary)] hover:underline transition duration-200 flex items-center gap-1">
                                            <i className="fa-solid fa-plus text-[10px]"></i> Add Product
                                        </button>
                                    </div>
                                    <div className="px-4 md:px-6 pt-5 pb-6">
                                        <div className="mb-4 w-full max-w-sm">
                                            <p className="text-sm font-medium text-[var(--textSecondary)] mb-1">
                                                Select Product <span className="text-red-500">*</span>
                                            </p>
                                            <Select
                                                options={productList}
                                                theme={selectTheme}
                                                styles={selectStyles}
                                                value={productSelection}
                                                onChange={(e) => productHandler(e.value)}
                                                className="text-sm w-full border border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)]"
                                            />
                                        </div>
                                        {isProductSelected && (
                                            <div className="relative overflow-x-auto overflow-y-hidden rounded-md shadow-sm -mx-2 sm:mx-0">
                                                <table className="min-w-[95vw] sm:min-w-full text-sm text-left text-[var(--textSecondary)]">
                                                    <thead className="bg-gray-100 text-[var(--textSecondary)] text-[13px] font-semibold">
                                                        <tr>
                                                            <th className="py-3 px-3">Product</th>
                                                            <th className="py-3 px-3 text-right">Price</th>
                                                            <th className="py-3 px-3 text-right">Tax</th>
                                                            <th className="py-3 px-3 text-right whitespace-nowrap">
                                                                Qty <i className="fa-solid fa-pen text-[10px] ml-2"></i>
                                                            </th>
                                                            <th className="py-3 px-3 text-right">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {productDataArray.map((product) => (
                                                            <tr
                                                                key={product.id}
                                                                className="hover:bg-[var(--cardPanel)] even:bg-[var(--cardPanel)] transition"
                                                            >
                                                                <td className="py-3 px-3 w-full">
                                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                                                                        <div className="flex flex-col sm:max-w-[250px]">
                                                                            <span className="font-semibold text-[12px] sm:text-[13.5px] text-[var(--textPrimary)] leading-snug">
                                                                                {product.name}
                                                                            </span>
                                                                            {product.description && (
                                                                                <span className="text-xs text-[var(--textSecondary)] leading-tight mt-[1px]">
                                                                                    {product.description}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div
                                                                            onClick={() => removeHandler(product, product.id)}
                                                                            className="filter-tab-small"
                                                                            style={{
                                                                                '--tab-color': '#EF4444',
                                                                            }}
                                                                        >
                                                                            REMOVE
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                                                    {currencyShow[product.currency]}{" "}
                                                                    {product.price !== ""
                                                                        ? Number(product.price).toFixed(2)
                                                                        : "-"}
                                                                </td>
                                                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                                                    {taxData.taxType === "Per Item"
                                                                        ? product.tax
                                                                            ? Number(product.tax).toFixed(2) + " %"
                                                                            : "-"
                                                                        : "-"}
                                                                </td>
                                                                <td className="py-3 px-3 text-right">
                                                                    <input
                                                                        type="number"
                                                                        value={product.qty}
                                                                        onChange={(e) => {
                                                                            setProductDataArray((prev) =>
                                                                                prev.map((p) =>
                                                                                    p.id === product.id
                                                                                        ? { ...p, qty: Number(e.target.value) || 0 }
                                                                                        : p
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="w-11 text-center py-[4px] border border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)] text-sm text-[var(--textPrimary)]"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-3 text-right font-semibold whitespace-nowrap">
                                                                    {currencyShow[product.currency]}{" "}
                                                                    {(
                                                                        taxData.taxType === "Per Item" && product.tax
                                                                            ? Number(
                                                                                product.qty * product.price +
                                                                                (product.qty * product.price * product.tax) / 100
                                                                            )
                                                                            : Number(product.qty * product.price)
                                                                    ).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {/* Swipe hint */}
                                                <p className="sm:hidden text-right text-xs font-semibold text-gray-400 mt-2 px-3">
                                                    Swipe right to more details <i className='fa-solid fa-angle-right'></i>
                                                </p>
                                            </div>
                                        )}
                                        {/* Summary */}
                                        {currentCurrency && (
                                            <div className="pt-4 md:px-3 space-y-2 text-sm text-[var(--textSecondary)]">
                                                <div className="flex justify-between font-semibold">
                                                    <span className="text-[var(--textSecondary)]">Pricing Total</span>
                                                    <span className="font-semibold text-[var(--textPrimary)]">
                                                        {currencyShow[currentCurrency]} {Number(productSubtotal).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <span className="text-[var(--textSecondary)]">{(taxData.taxType == 'On Total' || taxData.taxType == 'Deducted')
                                                        ? taxData.taxLabel + ` (${taxData.taxValue}%${taxData.taxInclusive ? ' included' : ''})`
                                                        : 'Tax'}</span>
                                                    <span className="font-semibold text-[var(--textPrimary)]">
                                                        {currencyShow[currentCurrency]} {Number(productTax).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <span className="text-[var(--textSecondary)]">Total (Incl. Tax)</span>
                                                    <span className="font-semibold text-[var(--textPrimary)]">
                                                        {currencyShow[currentCurrency]} {Number(productTotal).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <span className="text-[var(--textSecondary)]">
                                                        Discount{" "}
                                                        {discountData.discountType === "Percent" &&
                                                            `(${discountData.discountValue}%)`}
                                                    </span>
                                                    <span className="font-semibold text-[var(--textPrimary)]">
                                                        {currencyShow[currentCurrency]}{" "}
                                                        {discountData.discountType === "Percent"
                                                            ? Number(discountAmount).toFixed(2)
                                                            : Number(discountData.discountValue).toFixed(2)}
                                                    </span>
                                                </div>
                                                {partialPayment.isPartial === "Yes" && (
                                                    <div className="flex justify-between font-semibold">
                                                        <span className="text-[var(--textSecondary)]">Amount Paid</span>
                                                        <span className="font-semibold text-[var(--textPrimary)]">
                                                            {currencyShow[currentCurrency]} {Number(partialPayment.amount).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="h-[1px] bg-gray-200 my-2"></div>
                                                <div className="flex justify-between items-end text-base md:text-lg font-semibold text-[var(--textPrimary)]">
                                                    <span>Amount Due</span>
                                                    <span className='text-base md:text-lg  text-[var(--textPrimary)]'>
                                                        {currencyShow[currentCurrency]} {Number(productBalanceDue).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    {/* Header */}
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                                            <i className="fa-solid fa-comment text-[var(--primaryPanel)] text-sm"></i>
                                            <span>Footer Settings</span>
                                        </h3>
                                    </div>
                                    {/* Content */}
                                    <div className="px-4 md:px-8 pt-5 pb-6 flex flex-col gap-6">
                                        {/* Footer Note */}
                                        <div className="w-full">
                                            <p className="text-sm font-medium text-[var(--textSecondary)] mb-1">Invoice Footer Note</p>
                                            <textarea
                                                name="invoiceFooter"
                                                value={iFooter}
                                                onChange={(e) => setIFooter(e.target.value)}
                                                onBlur={(e) => saveFooterNote(e.target.value)}
                                                className="happyinput resize-none min-h-[90px]"
                                                placeholder="Write a thank you message, bank details, or any custom note..."
                                            />
                                        </div>
                                        {/* Signature */}
                                        <div className="w-full max-w-sm">
                                            <p className="text-sm font-medium text-[var(--textSecondary)] mb-2">Authorized Signature</p>
                                            <div
                                                className="w-full max-w-sm aspect-[5/2] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer bg-[var(--bgPanel)] hover:border-[var(--primaryPanel)] transition"
                                                onClick={() => setIsSignature(true)}
                                            >
                                                {signPreview ? (
                                                    <div className="w-full h-full relative group">
                                                        <img
                                                            src={signPreview}
                                                            ref={signRef}
                                                            crossOrigin="anonymous"
                                                            alt="Signature Preview"
                                                            className="object-contain h-full max-w-full mx-auto rounded"
                                                        />
                                                        <button
                                                            onClick={removeSign}
                                                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-100 group-hover:opacity-100 transition"
                                                            title="Remove Signature"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400">
                                                        <Signature className="w-6 h-6" />
                                                        <span className="mt-1 text-xs font-medium">+ Signature</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* OR Upload Signature */}
                                            <div className="mt-3">
                                                <label className="text-xs font-medium text-[var(--textSecondary)] block mb-1">or Upload Signature Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="block cursor-pointer w-full text-sm text-[var(--textSecondary)] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[var(--primaryPanel)] file:text-white hover:file:bg-[var(--primaryPanel)]"
                                                    ref={inputRefSign}
                                                    onChange={handleSignUpload}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full py-3 bg-[var(--greenLightestPanel)] text-[var(--textPrimary)] text-center rounded-md block lg:hidden text-sm font-semibold'>
                                Invoice Settings
                            </div>
                            <div className='w-full max-w-full lg:max-w-[300px] flex flex-col gap-4'>
                                <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    {/* Header */}
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                                            <i className="fa-solid fa-bullhorn text-[var(--primaryPanel)] text-sm"></i>
                                            <span>Share Your Invoice</span>
                                        </h3>
                                    </div>
                                    {/* Content */}
                                    <div className="px-5 sm:px-7 py-5 flex flex-col gap-1">
                                        {/* Live URL Tag */}
                                        <div className="inline-block bg-[var(--primaryPanel)] text-[var(--textTrans)] text-xs font-semibold px-2 py-[4px] rounded w-max">
                                            LIVE URL
                                        </div>
                                        {/* Invoice URL */}
                                        <a
                                            href={`https://${invoiceURL}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Open invoice in new tab"
                                            data-tooltip-place="top"
                                            className="block font-medium text-md md:text-sm text-[var(--primaryPanel)] hover:text-[var(--greenDarkPanel)] underline break-words cursor-pointer"
                                        >
                                            {invoiceURL}
                                        </a>
                                        <div className="flex gap-3 flex-wrap mt-2">
                                            <button
                                                onClick={copyURL}
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content="Copy invoice URL to share"
                                                data-tooltip-place="top"
                                                className="text-xs bg-[var(--cardPanel)] cursor-pointer font-medium px-3 py-1 border border-gray-500/30 rounded-md text-[var(--textSecondary)] hover:border-[var(--primaryPanel)] hover:text-[var(--primaryPanel)] transition"
                                            >
                                                <i className="fa-solid fa-copy text-[11px] mr-1.5"></i> Copy
                                            </button>
                                            <a
                                                href={`https://${invoiceURL}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content="Open invoice in new tab"
                                                data-tooltip-place="top"
                                            >
                                                <button className="text-xs bg-[var(--cardPanel)] cursor-pointer font-medium px-3 py-1 border border-gray-500/30 rounded-md text-[var(--textSecondary)] hover:border-blue-500 hover:text-blue-500 transition">
                                                    <i className="fa-solid fa-up-right-from-square text-[11px] mr-1.5"></i> Open
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={() => setShowRecordModal(true)} className='w-full px-4 py-3 text-center text-[var(--textTrans)] cursor-pointer rounded-md bg-[var(--primaryPanel)] hover:bg-[var(--greenDarkPanel)] hover:text-white text-sm font-semibold transition'>
                                    Record Payment <i className="fa-solid fa-angle-right ml-2 text-xs"></i>
                                </div>
                                <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    {/* Header */}
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                            <i className="fa-solid fa-clock-rotate-left text-[var(--primaryPanel)] text-sm"></i>
                                            Recent Activity
                                        </h3>
                                    </div>
                                    {/* Content */}
                                    <div className="px-6 py-5 flex flex-col gap-3 text-[var(--textPrimary)] text-sm">
                                        {recentActivity ? (
                                            recentActivity.map((value, index) => (
                                                index < 3 && (<InvoiceActivityBar heading={value.message} date={value.date} time={value.time} key={index} />)
                                            ))
                                        ) : (
                                            <p className='text-sm text-[var(--textSecondary)] fot-semibold'>Loading Recent Activities...</p>
                                        )}
                                        {recentActivity && recentActivity?.length > 3 && (
                                            <button onClick={() => { setShowActivityModal(true) }} className="text-xs mt-1 bg-[var(--cardPanel)] cursor-pointer font-medium px-3 py-1 border border-gray-500/30 rounded-md text-[var(--textSecondary)] hover:border-blue-500 hover:text-blue-500 transition">
                                                <i className="fa-solid fa-arrow-right text-[11px] mr-1.5"></i> View History
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {/* <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                            <i className="fa-solid fa-gear text-[var(--primaryPanel)] text-sm"></i>
                                            Settings
                                        </h3>
                                    </div>
                                    <div className="px-5 sm:px-7 pt-5 pb-7 flex flex-col gap-4 text-[var(--textPrimary)] text-sm">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-[var(--textSecondary)]">
                                                Invoice Status <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={invoiceStatus}
                                                onChange={(e) => updateInvoiceStatus(e.target.value)}
                                                className="happyinput"
                                            >
                                                <option>Draft</option>
                                                <option>Sent</option>
                                                <option>Viewed</option>
                                                <option>Payment Due</option>
                                                <option>Paid</option>
                                            </select>
                                        </div>
                                        {invoiceStatus !== "Paid" && (
                                            <button
                                                className="w-full px-4 py-2 text-white cursor-pointer rounded-md bg-[var(--primaryPanel)] hover:bg-[var(--greenDarkPanel)] hover:text-white text-sm font-semibold transition"
                                                onClick={() => updateInvoiceStatus("Paid")}
                                            >
                                                Mark as Paid <i className="fa-solid fa-angle-right ml-2 text-xs"></i>
                                            </button>
                                        )}
                                        {invoiceStatus === "Paid" && (
                                            <div className="flex flex-col gap-1">
                                                <label className="font-medium text-[var(--textSecondary)]">
                                                    Payment Mode <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={invoiceMode}
                                                    onChange={(e) => updateInvoiceMode(e.target.value)}
                                                    className="happyinput"
                                                >
                                                    {methods.map((m, i) => (
                                                        <option key={i}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <button
                                            className="text-sm bg-[var(--cardPanel)] cursor-pointer font-semibold px-3 py-3 border border-[var(--primaryPanel)] rounded-md text-[var(--primaryPanel)] hover:border-[var(--greenDarkPanel)] hover:text-[var(--greenDarkPanel)] transition"
                                            onClick={() => setShowRecordModal(true)}
                                        >
                                            Manage Payments <i className="fa-solid fa-angle-right ml-2 text-xs"></i>
                                        </button>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-[var(--textSecondary)] flex items-center gap-2">
                                                Partial Payment <span className="text-red-500">*</span>
                                                <span
                                                    className="bg-gray-200 text-[var(--textSecondary)] hover:bg-gray-300 transition rounded-full text-xs px-2 py-[1px] cursor-pointer"
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-content="Once enabled, the amount entered will be subtracted from the total and the remaining balance will be shown as due."
                                                    data-tooltip-place="top"
                                                >
                                                    ?
                                                </span>
                                            </label>
                                            <select
                                                value={partialPayment.isPartial}
                                                onChange={(e) => partialHandler("isPartial", e.target.value)}
                                                className="happyinput"
                                            >
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        {partialPayment.isPartial === "Yes" && (
                                            <div className="flex flex-col gap-1">
                                                <label className="font-medium text-[var(--textSecondary)]">
                                                    Partial Amount <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={partialPayment.amount}
                                                        onChange={(e) =>
                                                            partialHandler("amount", Number(e.target.value))
                                                        }
                                                        onBlur={(e) => {
                                                            e.target.value <= 0 && partialHandler("amount", Number(0));
                                                        }}
                                                        className="w-full text-right py-2 pr-10 pl-2 rounded-md border border-[var(--grey66)] focus:border-[var(--primaryPanel)] text-sm placeholder:text-gray-400 text-[var(--textPrimary)]"
                                                        placeholder="0"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--textSecondary)]">
                                                        {currencyShow[currentCurrency]}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div> */}
                                <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    {/* Header */}
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                            <i className="fa-solid fa-gear text-[var(--primaryPanel)] text-sm"></i>
                                            Invoice Settings
                                        </h3>
                                    </div>
                                    {/* Content */}
                                    <div className="px-5 sm:px-7 py-5 flex flex-col gap-4 text-sm text-[var(--textPrimary)]">
                                        {/* Invoice Theme */}
                                        <div>
                                            <label className="block font-medium mb-1 text-[var(--textSecondary)]">
                                                Invoice Theme <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-2 mt-1 flex-wrap">
                                                {[
                                                    { color: "green", isActive: isGreen, var: "greenTheme" },
                                                    { color: "blue", isActive: isBlue, var: "bluePanel" },
                                                    { color: "red", isActive: isRed, var: "redPanel" },
                                                    { color: "purple", isActive: isPurple, var: "purplePanel" },
                                                    { color: "orange", isActive: isOrange, var: "orangePanel" },
                                                ].map(({ color, isActive, var: colorVar }) => (
                                                    <div
                                                        key={color}
                                                        onClick={() => setTheme(color)}
                                                        className={`w-9 h-9 rounded-full cursor-pointer transition-all border-2 ${isActive ? "border-gray-700" : "border-transparent"
                                                            }`}
                                                        style={{ backgroundColor: `var(--${colorVar})` }}
                                                    >
                                                        {isActive && (
                                                            <div className="w-full h-full rounded-full bg-black/30 flex items-center justify-center text-white">
                                                                <i className="fa-solid fa-check text-xs"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-[var(--textSecondary)]">
                                                Invoice Status <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={invoiceStatus}
                                                onChange={(e) => updateInvoiceStatus(e.target.value)}
                                                className="happyinput"
                                            >
                                                <option>Draft</option>
                                                <option>Sent</option>
                                                <option>Viewed</option>
                                                <option>Payment Due</option>
                                                <option>Paid</option>
                                            </select>
                                        </div>
                                        {/* Mark Paid Button */}
                                        {invoiceStatus !== "Paid" && (
                                            <button
                                                className="w-full px-4 py-2 text-white cursor-pointer rounded-md bg-[var(--primaryPanel)] hover:bg-[var(--greenDarkPanel)] hover:text-white text-sm font-semibold transition"
                                                onClick={() => updateInvoiceStatus("Paid")}
                                            >
                                                Mark as Paid <i className="fa-solid fa-angle-right ml-2 text-xs"></i>
                                            </button>
                                        )}
                                        {/* Payment Mode */}
                                        {invoiceStatus === "Paid" && (
                                            <div className="flex flex-col gap-1">
                                                <label className="font-medium text-[var(--textSecondary)]">
                                                    Payment Mode <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={invoiceMode}
                                                    onChange={(e) => updateInvoiceMode(e.target.value)}
                                                    className="happyinput"
                                                >
                                                    {methods.map((m, i) => (
                                                        <option key={i}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <button
                                            className="w-full px-4 py-2 text-white cursor-pointer rounded-md bg-gray-700 hover:bg-gray-600 text-sm font-semibold transition"
                                            onClick={() => setShowSettings(true)}
                                        >
                                            <i className="fa-solid fa-gear mr-2 text-xs"></i> More Settings
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    {/* Header */}
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                            <i className="fa-solid fa-tag text-[var(--primaryPanel)] text-sm"></i>
                                            Tax and GST
                                        </h3>
                                    </div>
                                    {/* Content */}
                                    <div className="px-5 sm:px-7 pt-5 pb-7 flex flex-col gap-4 text-sm text-[var(--textPrimary)]">
                                        {/* Tax Type */}
                                        <div>
                                            <label className="block text-[var(--textSecondary)] font-medium mb-1">
                                                Tax Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={taxData.taxType}
                                                onChange={(e) => taxHandler('taxType', e.target.value)}
                                                className="happyinput"
                                            >
                                                <option>Per Item</option>
                                                <option>On Total</option>
                                                <option>Deducted</option>
                                                <option>None</option>
                                            </select>
                                        </div>
                                        {/* Conditional Fields */}
                                        {(taxData.taxType === 'On Total' || taxData.taxType === 'Deducted') && (
                                            <div className="flex flex-col gap-4">
                                                {/* Tax Label */}
                                                <div className="flex-1">
                                                    <label className="block text-[var(--textSecondary)] font-medium mb-1">
                                                        Tax Label <span className="text-sm text-[var(--textSecondary)]">(i.e. Tax, GST)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="taxlabel"
                                                        value={taxData.taxLabel}
                                                        onChange={(e) => taxHandler('taxLabel', e.target.value)}
                                                        onBlur={(e) => {
                                                            if (e.target.value === '') taxHandler('taxLabel', 'Tax');
                                                        }}
                                                        className="happyinput"
                                                        placeholder="i.e. Tax, GST, CGST / SGST"
                                                    />
                                                </div>
                                                {/* Tax Rate */}
                                                <div className="flex-1">
                                                    <label className="block text-[var(--textSecondary)] font-medium mb-1">
                                                        Tax Rate (%) <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={taxData.taxValue}
                                                            onChange={(e) => taxHandler('taxValue', Number(e.target.value))}
                                                            onBlur={(e) => {
                                                                if (e.target.value <= 0 || e.target.value === '') taxHandler('taxValue', 0);
                                                            }}
                                                            className="happyselect"
                                                            placeholder="0"
                                                        />
                                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--textSecondary)]">%</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <label htmlFor="inclusiveTax" className="text-sm font-medium text-[var(--textSecondary)] cursor-pointer" data-tooltip-id="my-tooltip" data-tooltip-content="Does the price include tax?" data-tooltip-place="top">
                                                            Inclusive?
                                                        </label>
                                                        <input
                                                            type="checkbox"
                                                            id="inclusiveTax"
                                                            checked={taxData.taxInclusive}
                                                            onChange={(e) => taxHandler('taxInclusive', e.target.checked)}
                                                            className="w-5 h-5 accent-[var(--greenLightPanel)] rounded cursor-pointer border-2"
                                                        />
                                                    </div>
                                                    <p className="text-xs italic text-[var(--textSecondary)] mt-1 flex items-center">
                                                        <i className="fa-solid fa-angle-right mr-1 text-[10px]"></i>
                                                        does the price include tax?
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-[var(--bgPanel)] rounded-xl shadow-sm w-full" style={{ border: '2px solid color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                                    {/* Header */}
                                    <div style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }} className="rounded-t-xl px-7 py-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                            <i className="fa-solid fa-money-bill-1 text-[var(--primaryPanel)] text-sm"></i>
                                            Discount
                                        </h3>
                                    </div>
                                    {/* Content */}
                                    <div className="px-5 sm:px-7 pt-5 pb-7 flex flex-col gap-5 text-sm text-[var(--textPrimary)]">
                                        {/* Discount Type */}
                                        <div>
                                            <label className="block text-[var(--textSecondary)] font-medium mb-1">
                                                Discount Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                className="happyinput"
                                                value={discountData.discountType}
                                                onChange={(e) => discountHandler('discountType', e.target.value)}
                                            >
                                                <option>None</option>
                                                <option>Percent</option>
                                                <option>Flat Amount</option>
                                            </select>
                                        </div>
                                        {/* Discount Value */}
                                        {discountData.discountType !== 'None' && (
                                            <div>
                                                <label className="block text-[var(--textSecondary)] font-medium mb-1">
                                                    {discountData.discountType} Value <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={discountData.discountValue}
                                                        onChange={(e) => discountHandler('discountValue', Number(e.target.value))}
                                                        onBlur={(e) => {
                                                            if (e.target.value <= 0 || e.target.value === '') {
                                                                discountHandler('discountValue', 0);
                                                            }
                                                        }}
                                                        className="happyselect"
                                                        placeholder="0"
                                                    />
                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--textSecondary)]">
                                                        {discountData.discountType === 'Percent' ? '%' : currencyShow[currentCurrency]}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className='flex justify-start gap-3 mt-6 mb-5'>
                            <Link href='/portal/invoice'><button className='btnGreenLightest'>Close</button></Link>
                            <button className=' btnRedLightest'>Delete Invoice</button>
                        </div> */}
                    </div>
                    <div className='hidden'>
                        <InvoiceGuide />
                    </div>
                </div>
            </div >
        </>
    )
}

export default InvoicePage