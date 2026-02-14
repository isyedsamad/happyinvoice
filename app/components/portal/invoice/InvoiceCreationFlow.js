'use client'
const planConfig = require('@/app/plan.json')
import { useContext, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Select from 'react-select';
import { AuthContext } from '@/context/AuthContext';
import { FnContext } from '@/context/FunctionContext';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/fauth/firebase';
import { ToastContainer, toast } from 'react-toastify';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useRouter } from 'next/navigation'
import PlanLimit from '../../modal/PlanLimit';
import RocketLoading from '../../other/RocketLoading';
import InvoiceSuccessModal from '../../other/InvoiceSuccessModal';
import NewClient from '../client/NewClient';
import ProductNew from '../product/ProductNew';

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

export default function InvoiceCreationFlow({ isOpen, onClose, clientList, productList }) {
    const router = useRouter();
    const [showRocketLoading, setShowRocketLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [invoiceLink, setInvoiceLink] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    const [step, setStep] = useState(1)
    const { currentUser, userData, setUserData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isPDFPreview, setIsPDFPreview, isSignature, setIsSignature, isSignatureLink, isMenu, setIsMenu, isNewClient, setIsNewClient, isNewProduct, setIsNewProduct, productData, productDataReady, setIsUpdateProduct, isProductEdit, productEditArray, isNewProductTag, setIsNewProductTag, newProductTagID, setNewProductTagID } = useContext(FnContext);
    const [saveClient, setSaveClient] = useState(null)
    const [saveProduct, setSaveProduct] = useState(null)
    const [isClientSelected, setIsClientSelected] = useState(false);
    const [clientDataArray, setClientDataArray] = useState({
        id: "",
        name: "",
        mail: "",
        phone: "",
        address: ""
    })
    const [currentCurrency, setCurrentCurrency] = useState(null);
    const [userCurrency, setUserCurrency] = useState("INR");
    const [productDataArray, setProductDataArray] = useState([]);
    const [productSelection, setProductSelection] = useState(null);
    const [productSubtotal, setProductSubtotal] = useState(0);
    const [productTax, setProductTax] = useState(0);
    const [productTotal, setProductTotal] = useState(0);
    const [productBalanceDue, setProductBalanceDue] = useState(0);
    const [summary, setSummary] = useState({
        subtotal: 0,
        tax: 0,
        total: 0,
        discount: 0,
        balance: 0
    })
    const [isProductSelected, setIsProductSelected] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountData, setDiscountData] = useState({
        discountType: 'None',
        discountValue: Number(0).toFixed(2),
    })
    const [taxData, setTaxData] = useState({
        taxType: 'Per Item',
        taxLabel: 'Tax',
        taxValue: 0,
        taxInclusive: false
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
            setSaveClient(value)
            setIsClientSelected(true);
            setLoading(false);
        } else {
            setIsClientSelected(false);
            setLoading(false);
            toast.error('Client not found!');
        }
    }
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
                    setSaveProduct(newProductArray)
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
    useEffect(() => {
        if (isReady && currentUser && userData) {
            updatePricing();
        }
    }, [productDataArray])
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
                var balance = total - (discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100) : currentDiscount);
                setDiscountAmount(discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2))
                setProductSubtotal(subtotal.toFixed(2));
                setProductTax(tax.toFixed(2));
                setProductTotal(total.toFixed(2));
                setProductBalanceDue(balance.toFixed(2));
                setSummary({
                    subtotal: subtotal.toFixed(2),
                    tax: tax.toFixed(2),
                    total: total.toFixed(2),
                    discount: discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2),
                    balance: balance.toFixed(2)
                })
                // savePricingToFirestore(subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2), balance.toFixed(2));
            } else if (taxData.taxType == 'On Total') {
                var subtotal = 0, tax = 0;
                productDataArray.forEach(child => {
                    subtotal += Number(child.price * child.qty);
                })
                tax = Number((subtotal * taxData.taxValue) / 100);
                var total = 0
                if (!taxData.taxInclusive) total = subtotal + tax;
                else total = subtotal;
                var balance = total - (discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100) : currentDiscount);
                setDiscountAmount(discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2))
                setProductSubtotal(subtotal.toFixed(2));
                setProductTax(tax.toFixed(2));
                setProductTotal(total.toFixed(2));
                setProductBalanceDue(balance.toFixed(2));
                setSummary({
                    subtotal: subtotal.toFixed(2),
                    tax: tax.toFixed(2),
                    total: total.toFixed(2),
                    discount: discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2),
                    balance: balance.toFixed(2)
                })
                // savePricingToFirestore(subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2), balance.toFixed(2));
            } else if (taxData.taxType == 'Deducted') {
                var subtotal = 0, tax = 0;
                productDataArray.forEach(child => {
                    subtotal += Number(child.price * child.qty);
                })
                tax = Number((subtotal * taxData.taxValue) / 100);
                var total = 0
                if (!taxData.taxInclusive) total = subtotal - tax;
                else total = subtotal;
                var balance = total - (discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100) : currentDiscount);
                setDiscountAmount(discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2))
                setProductSubtotal(subtotal.toFixed(2));
                setProductTax(tax.toFixed(2));
                setProductTotal(total.toFixed(2));
                setProductBalanceDue(balance.toFixed(2));
                setSummary({
                    subtotal: subtotal.toFixed(2),
                    tax: tax.toFixed(2),
                    total: total.toFixed(2),
                    discount: discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2),
                    balance: balance.toFixed(2)
                })
                // savePricingToFirestore(subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2), balance.toFixed(2));
            } else if (taxData.taxType == 'None') {
                var subtotal = 0, tax = 0;
                productDataArray.forEach(child => {
                    subtotal += Number(child.price * child.qty);
                })
                var total = subtotal - tax;
                var balance = total - (discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100) : currentDiscount);
                setDiscountAmount(discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2))
                setProductSubtotal(subtotal.toFixed(2));
                setProductTax(tax.toFixed(2));
                setProductTotal(total.toFixed(2));
                setProductBalanceDue(balance.toFixed(2));
                setSummary({
                    subtotal: subtotal.toFixed(2),
                    tax: tax.toFixed(2),
                    total: total.toFixed(2),
                    discount: discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2),
                    balance: balance.toFixed(2)
                })
                // savePricingToFirestore(subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), discountData.discountType == 'Percent' ? ((total * currentDiscount) / 100).toFixed(2) : currentDiscount.toFixed(2), balance.toFixed(2));
            }
        }
    }
    const taxHandler = (field, value) => {
        setTaxData((data) => ({
            ...data,
            [field]: value
        }))
    }
    const discountHandler = (field, value) => {
        if (field == 'discountType' && value == 'None') {
            setDiscountData({ discountType: 'None', discountValue: Number(0).toFixed(2) })
        } else {
            setDiscountData((data) => ({
                ...data,
                [field]: value
            }))
        }
    }
    useEffect(() => {
        updatePricing()
    }, [taxData, discountData])
    const saveInvoiceToBackend = async () => {
        if (!saveClient) {
            toast.error('You have to select a client before proceeding!', {
                position: 'top-center',
                theme: 'colored'
            })
            setStep(1)
            return;
        }
        if (!saveProduct || saveProduct.length == 0) {
            toast.error('You have to select atleast one product before proceeding!', {
                position: 'top-center',
                theme: 'colored'
            })
            setStep(2)
            return;
        }
        setShowRocketLoading(true);
        try {
            const functions = getFunctions();
            const callGenerateInvoice = httpsCallable(functions, 'generateInvoice');
            const response = await callGenerateInvoice({
                client: clientDataArray,
                product: productDataArray,
                taxData: taxData,
                discountData: discountData,
                summary: summary
            });
            if (response.data.success) {
                const docRef = doc(db, 'happyuser', currentUser.uid);
                const snap = await getDoc(docRef);
                setUserData(snap.data());
                setInvoiceLink(response.data.invoiceId)
                setShowSuccessModal(true);
                setShowRocketLoading(false);
                // router.push(`/portal/${response.data.invoiceId}`);
            } else {
                if (response.data.type == 'limitExhausted') {
                    // upgradeBanner
                    setModalText(`You’ve reached your ${planConfig[userData?.planAnalysis.plan].invoicesPerMonth} invoice limit on the ${planConfig[userData?.planAnalysis.plan].name} Plan. Upgrade to continue.`)
                    setModalOpen(true);
                    // toast.error('Error: ' + response.data.message);
                    setLoading(false);
                    setShowRocketLoading(false);
                } else {
                    toast.error('Error: ' + response.data.message, {
                        position: 'top-center',
                        theme: 'colored'
                    });
                    setLoading(false);
                    setShowRocketLoading(false);
                }
            }
        } catch (error) {
            toast.error('Error: ' + error.message, {
                position: 'top-center',
                theme: 'colored'
            });
            setShowRocketLoading(false);
            setLoading(false);
        }
    }
    const removeHandler = async (data, pid) => {
        setLoading(true);
        const newProductArray = [...productDataArray];
        const updatedProductArray = newProductArray.filter(product => product.id != pid)
        if (updatedProductArray.length == 0) setCurrentCurrency(null);
        setProductDataArray(updatedProductArray);
        if (updatedProductArray.length == 0) {
            setProductSubtotal(0);
            setProductTax(0);
            setProductTotal(0);
            setProductBalanceDue(0);
            setSummary({
                subtotal: 0,
                tax: 0,
                total: 0,
                discount: 0,
                balance: 0
            })
            // savePricingToFirestore(0, 0, 0, 0, 0);
        }
        setSaveProduct(updatedProductArray);
        if (updatedProductArray.length == 0) setIsProductSelected(false);
        setLoading(false);
    }
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => (document.body.style.overflow = '')
    }, [isOpen])
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-35 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2">
            {isNewClient && (
                <NewClient />
            )}
            {isNewProduct && (
                <ProductNew />
            )}
            {showRocketLoading && (
                <RocketLoading />
            )}
            {showSuccessModal && (
                <InvoiceSuccessModal
                    invoiceCode={`${invoiceLink}`}
                />
            )}
            <PlanLimit
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Invoice Limit Reached"
                message={modalText}
            />
            <ToastContainer />
            <div className="bg-[var(--bgPanel)] w-full max-w-[95vw] md:max-w-[60vw] max-h-[90vh] rounded-xl shadow-xl overflow-hidden flex flex-col animate-fadeIn">
                {/* HEADER */}
                <div className="px-7 py-4 flex items-center justify-between border-b" style={{ borderColor: 'color-mix(in srgb, var(--primaryPanel) 50%, transparent)', background: 'color-mix(in srgb, var(--primaryPanel) 25%, transparent)' }}>
                    <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                        <i className="fa-solid fa-receipt text-[var(--primaryPanel)] text-sm"></i>
                        <span>Step-by-Step Invoice Setup</span>
                    </h3>
                    <button onClick={onClose} className="text-[var(--textSecondary)] cursor-pointer hover:text-black transition">
                        <X size={18} />
                    </button>
                </div>
                {/* STEP INDICATOR */}
                <div className="px-5 md:px-6 pt-5">
                    <div className="flex items-center justify-between mb-2 text-xs text-[var(--textSecondary)] font-medium">
                        <span>Step {step} of 3</span>
                    </div>
                    <div className="w-full h-1 rounded-full overflow-hidden mb-2" style={{ background: 'color-mix(in srgb, var(--textSecondary) 40%, transparent)' }}>
                        <div
                            className="h-full bg-[var(--primaryPanel)] transition-all"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>
                {/* SCROLLABLE BODY */}
                <div className="overflow-y-auto px-5 md:px-6 pb-6 pt-2 flex-1">
                    {step === 1 && (
                        <div className="min-h-[230px] transition-all duration-300 ease-in-out">
                            <div className="mb-2">
                                <h2 className="text-md font-semibold text-[var(--textPrimary)]">Step 1: Add Client</h2>
                                <p className="text-xs md:text-sm text-[var(--textSecondary)]">Select or add a client for this invoice, you can update it later.</p>
                            </div>
                            {clientList.length > 0 ? (
                                <div className="mb-4 mt-2 w-full max-w-sm">
                                    <p className="text-sm font-semibold text-[var(--textSecondary)] mb-[1px]">
                                        Select Client <span className="text-red-500">*</span>
                                    </p>
                                    <Select
                                        options={clientList}
                                        theme={selectTheme}
                                        styles={selectStyles}
                                        onChange={(e) => clientHandler(e.value)}
                                        className="text-sm bg-[var(--bgPanel)] w-full border border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)]"
                                    />
                                </div>
                            ) : (
                                <div className='w-full py-8 px-3 flex flex-col justify-center items-center font-semibold text-[var(--textPrimary)]'>
                                    <i className='fa-solid fa-triangle-exclamation text-5xl text-[var(--primaryPanel)]'></i>
                                    <h2 className='text-md text-center mt-5 text-[var(--textPrimary)]'>No Client Found!</h2>
                                    <p className='text-[var(--textSecondary)] text-xs text-center max-w-sm mt-1 font-medium'>You haven’t added any clients yet. Click the button below to add your first client.</p>
                                    <button className='btnGreenLightest mt-4' onClick={() => { setIsNewClient(true) }}>Add your First Client <i className='fa-solid fa-angle-right ml-2'></i></button>
                                </div>
                            )}
                            {isClientSelected && (
                                <div className="bg-[var(--cardPanel)] rounded-md px-4 py-3 shadow-sm text-sm text-[var(--textPrimary)] space-y-1">
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
                    )}
                    {step === 2 && (
                        <div className="min-h-[230px] transition-all duration-300 ease-in-out">
                            <div className="mb-2">
                                <h2 className="text-md font-semibold text-[var(--textPrimary)]">Step 2: Add Products</h2>
                                <p className="text-xs md:text-sm text-[var(--textSecondary)]">Include products or services you want to bill. You can update it anytime later.</p>
                            </div>
                            {productList.length > 0 ? (
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
                            ) : (
                                <div className='w-full py-8 px-3 flex flex-col justify-center items-center font-semibold text-[var(--textPrimary)]'>
                                    <i className='fa-solid fa-triangle-exclamation text-5xl text-[var(--primaryPanel)]'></i>
                                    <h2 className='text-md text-center mt-5 text-[var(--textPrimary)]'>No Product Found!</h2>
                                    <p className='text-[var(--textSecondary)] text-xs text-center max-w-sm mt-1 font-medium'>You haven’t added any products yet. Click the button below to add your first product.</p>
                                    <button className='btnGreenLightest mt-4' onClick={() => { setIsNewProduct(true) }}>Add your First Product <i className='fa-solid fa-angle-right ml-2'></i></button>
                                </div>
                            )}
                            {isProductSelected && (
                                <div className="relative overflow-x-auto overflow-y-hidden rounded-md shadow-sm -mx-2 sm:mx-0">
                                    <table className="min-w-[95vw] sm:min-w-full text-sm text-left">
                                        <thead className="font-semibold">
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
                                    <div className="h-[1px] bg-gray-200 my-2"></div>
                                    <div className="flex justify-between items-end text-base md:text-lg font-semibold text-[var(--textPrimary)]">
                                        <span>Amount Due</span>
                                        <span className='text-base md:text-lg  text-[var(--textPrimary)]'>
                                            {currencyShow[currentCurrency]} {Number(productBalanceDue).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {productDataArray.length > 0 && (
                                <div className="mt-3 px-4 py-2 border-l-4 border-yellow-400 rounded-md text-xs md:text-sm text-[var(--textPrimary)]" style={{ background: 'color-mix(in srgb, #F59E0B 40%, transparent)' }}>
                                    You can add or modify tax (i.e. Per Item, On Total, etc) and discount settings in the next step.
                                </div>
                            )}
                        </div>
                    )}
                    {step === 3 && (
                        <div className="min-h-[230px] transition-all duration-300 ease-in-out">
                            <div className="mb-4">
                                <h2 className="text-md font-semibold text-[var(--textPrimary)]">Step 3: Tax and Discount</h2>
                                <p className="text-xs md:text-sm text-[var(--textSecondary)]">Change tax and discount type. You can update it anytime later.</p>
                            </div>
                            <div>
                                {/* Summary */}
                                {currentCurrency && (
                                    <div className="space-y-2 text-sm text-[var(--textSecondary)]">
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
                            <div className='flex flex-col md:flex-row gap-5 mt-3'>
                                <div className="px-5 pt-4 pb-6 flex flex-1 flex-col gap-4 text-sm text-[var(--textPrimary)] bg-[var(--cardPanel)] rounded-lg">
                                    <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                        <i className="fa-solid fa-tag text-[var(--primaryPanel)] text-sm"></i>
                                        Tax and GST
                                    </h3>
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
                                <div className="px-5 pt-4 pb-6 flex flex-1 flex-col gap-4 text-sm text-[var(--textPrimary)] bg-[var(--cardPanel)] rounded-lg">
                                    <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-3">
                                        <i className="fa-solid fa-money-bill-1 text-[var(--primaryPanel)] text-sm"></i>
                                        Discount
                                    </h3>
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
                    )}
                </div>
                {/* FOOTER NAVIGATION */}
                <div className="px-6 py-4 border-t border-black/20 flex justify-between items-center">
                    <button
                        disabled={step === 1}
                        onClick={() => setStep(step - 1)}
                        className="text-sm cursor-pointer font-medium text-[var(--textSecondary)] hover:text-[var(--primaryPanel)] disabled:opacity-40"
                    >
                        Back
                    </button>
                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="btnGreen"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={() => { saveInvoiceToBackend() }}
                            className="btnGreen"
                        >
                            Finalize
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
