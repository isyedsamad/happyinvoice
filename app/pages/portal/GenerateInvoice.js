'use client'
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import NavBar from '@/app/components/portal/navbar/NavBar'
import Sidebar from '@/app/components/portal/navbar/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Select from 'react-select'
import { ImageIcon, X } from "lucide-react";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const GenerateInvoice = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        invoiceNo: "",
        invoiceDate: "",
        dueDate: "",
        name: "",
        mail: "",
        phone: "",
        address: "",
    });
    const [isDirty, setIsDirty] = useState(false);
    const debounceTimer = useRef(null);
    const handleChange = (field, value) => {
        setFormData((data) => ({
            ...data,
            [field]: value
        }))
        setIsDirty(true);
    }
    useEffect(() => {
        if (!isDirty) return;
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            saveToFirestore();
        }, 3000);
    }, [formData])
    const saveToFirestore = () => {
        // firebasefn
    }
    const [userCurrency, setUserCurrency] = useState("INR");
    const [clientList, setClientList] = useState([]);
    const { currentUser, userData, setUserData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu, isNewProduct, setIsNewProduct, productData, productDataReady, setIsUpdateProduct, isProductEdit, productEditArray, isNewProductTag, setIsNewProductTag, newProductTagID, setNewProductTagID } = useContext(FnContext);
    useEffect(() => {
        if (isReady && currentUser && userData) {
            setUserCurrency(userData.currency ? userData.currency : 'INR');
            handleChange('name', userData.businessname)
            handleChange('mail', userData.businessmail)
            handleChange('phone', userData.businessphone)
            handleChange('address', userData.businessaddress)
            handleChange('invoiceNo', userData.invoiceprefix + userData.invoicenumber);
            setLogoPreview(userData.businesslogo);
            const userClientArray = userData.clients ? userData.clients : [];
            const newClientList = [];
            userClientArray.forEach(child => {
                newClientList.push({ label: child.name, value: child.uid });
            })
            setClientList(newClientList);
            if (isMenu) setIsMenu(false);
        }
    }, [isReady, currentUser, userData])
    const [isGreen, setIsGreen] = useState(false);
    const [isBlue, setIsBlue] = useState(false);
    const [isRed, setIsRed] = useState(false);
    const [isPurple, setIsPurple] = useState(false);
    const [isOrange, setIsOrange] = useState(false);
    const setTheme = () => {

    }
    const inputRef = useRef();
    const [logoPreview, setLogoPreview] = useState(null);
    const resetInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Only PNG, JPG, and JPEG files are allowed.');
                resetInput();
                return;
            }
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                alert('File size must be less than 2MB.');
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
                await updateDoc(docRef, { businesslogo: downloadUrl });
                const updatedUserData = {
                    ...userData,
                    businesslogo: downloadUrl
                }
                setUserData(updatedUserData);
                setLogoPreview(URL.createObjectURL(file));
                setLoading(false);
                toast.success('Logo uploaded successfully!');
                resetInput();
            } catch (error) {
                setLoading(false);
                toast.success('Error: ' + error);
            }
        }
    };
    const removeLogo = async (e) => {
        e.stopPropagation();
        setLogoPreview(null);
        setLoading(true);
        const docRef = doc(db, 'happyuser', currentUser.uid);
        try {
            await updateDoc(docRef, { businesslogo: '' });
            const updatedUserData = {
                ...userData,
                businesslogo: ''
            }
            setUserData(updatedUserData);
            setLoading(false);
            toast.success('Logo removed successfully!');
        } catch (error) {
            setLoading(false);
            toast.success('Error: ' + error);
        }
    };
    return (
        <>
            {isMenu && (
                <Sidebar page="invoice" />
            )}
            {loading && (
                <Loading />
            )}
            <div className='flex h-screen max-w-screen'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="invoice" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen overflow-y-auto'>
                    <UpgradeBar />
                    <div className='border-b-2 px-6 border-[var(--greenLightPanel)] py-4 flex lg:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1'><span className='text-[var(--primaryPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex lg:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-6 md:px-8'>
                        <div className='block sm:flex'>
                            <div className='flex-1'>
                                <div className='flex justify-start items-center'>
                                    <div>
                                        <h1 className='text-xl font-semibold'>Generate Invoice</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-gray-500'>generate new invoice within seconds!</h3>
                            </div>
                        </div>
                        <form onSubmit={(e) => {
                            submitHandler(e);
                        }}>
                            <div className='mt-2 max-w-full flex flex-col md:flex-row gap-5'>
                                <div className='flex-1'>
                                    {/* invoice details */}
                                    <div className='bg-gray-50 mt-5 rounded-md px-5 sm:px-7 py-5 flex flex-col'>
                                        <h3 className='font-semibold text-lg'>Invoice Details</h3>
                                        <div className='w-full h-[1px] rounded bg-gray-300 mt-2'></div>
                                        <div className='flex flex-col md:flex-row gap-4 mt-4'>
                                            <div className='flex-1'>
                                                <p className='text-md font-medium text-[var(--themeBlack)]'>Invoice Number <span className='text-red-500'>*</span></p>
                                                <input type='text' name='invoiceNo' value={formData.invoiceNo} onChange={(e) => { handleChange('invoiceNo', e.target.value) }} className='happyinput' placeholder='i.e. INV1001' />
                                            </div>
                                            <div className='flex-1'>
                                                <p className='text-md font-medium text-[var(--themeBlack)]'>Invoice Date <span className='text-red-500'>*</span></p>
                                                <input type='date' name='invoiceDate' value={formData.invoiceDate} onChange={(e) => { handleChange('invoiceDate', e.target.value) }} className='happyinput' />
                                            </div>
                                            <div className='flex-1'>
                                                <p className='text-md font-medium text-[var(--themeBlack)]'>Due Date <span className='text-sm text-gray-500'>(optional)</span></p>
                                                <input type='date' name='dueDate' value={formData.dueDate} onChange={(e) => { handleChange('dueDate', e.target.value) }} className='happyinput' />
                                            </div>
                                        </div>
                                        {/* <div className='flex flex-col md:flex-row gap-4'>
                                            <button className='btnGreen mt-3'>Update General Settings <i className='fa-solid fa-angle-right ml-2'></i></button>
                                        </div> */}
                                        <ToastContainer />
                                    </div>
                                    {/* business details */}
                                    <div className='bg-gray-50 mt-5 rounded-md px-5 sm:px-7 py-5 flex flex-col'>
                                        <h3 className='font-semibold text-lg'>General Settings</h3>
                                        <div className='w-full h-[1px] rounded bg-gray-300 mt-2'></div>
                                        <div className="max-w-md mt-5">
                                            <div className="w-full max-w-75 h-35 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-white hover:border-blue-500 transition"
                                                onClick={() => inputRef.current.click()}>
                                                {logoPreview ? (
                                                    <div className="w-full h-full relative group z-10">
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo Preview"
                                                            className="object-contain h-full max-w-full mx-auto rounded"
                                                        />
                                                        <button
                                                            onClick={removeLogo}
                                                            className="absolute top-2 right-2 cursor-pointer bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                            title="Remove Logo"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-500">
                                                        <ImageIcon className="w-8 h-8" />
                                                        <span className="mt-1 text-sm font-medium">+ Logo</span>
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
                                        <div className='flex flex-col md:flex-row gap-4 mt-4'>
                                            <div className='flex-1'>
                                                <p className='text-md font-medium text-[var(--themeBlack)]'>Business Name <span className='text-red-500'>*</span></p>
                                                <input required type='text' name='name' value={formData.name} onChange={(e) => { handleChange('name', e.target.value) }} className='happyinput' placeholder='i.e. Rock N Services' />
                                            </div>
                                            <div className='flex-1'>
                                                <p className='text-md font-medium text-[var(--themeBlack)]'>Business Mail <span className='text-sm text-gray-500'>(optional)</span></p>
                                                <input type='text' name='mail' value={formData.mail} onChange={(e) => { handleChange('mail', e.target.value) }} className='happyinput' placeholder='i.e. support@rockn.com' />
                                            </div>
                                            <div className='flex-1'>
                                                <p className='text-md font-medium text-[var(--themeBlack)]'>Business Phone <span className='text-sm text-gray-500'>(optional)</span></p>
                                                <input type='text' name='phone' value={formData.phone} onChange={(e) => { handleChange('phone', e.target.value) }} className='happyinput' placeholder='i.e. 991 102 300' />
                                            </div>
                                        </div>
                                        <div className='flex flex-col md:flex-row gap-4'>
                                            <div className='flex-1'>
                                                <p className='text-md font-medium text-[var(--themeBlack)] mt-4'>Business Address <span className='text-sm text-gray-500'>(optional)</span></p>
                                                <textarea type='text' name='name' value={formData.address} onChange={(e) => { handleChange('address', e.target.value) }} className='happyinput max-w-[350px]' placeholder='i.e. 3rd floor, Oln Appartment'></textarea>
                                            </div>
                                        </div>
                                        {/* <div className='flex flex-col md:flex-row gap-4'>
                                                <button className='btnGreen mt-3'>Update General Settings <i className='fa-solid fa-angle-right ml-2'></i></button>
                                            </div> */}
                                        <ToastContainer />
                                    </div>
                                    {/* client details */}
                                    <div className='bg-gray-50 mt-5 rounded-md px-5 sm:px-7 py-5 flex flex-col'>
                                        <h3 className='font-semibold text-lg'>Client Details</h3>
                                        <div className='w-full h-[1px] rounded bg-gray-300 mt-2'></div>
                                        <div className='flex flex-col md:flex-row gap-4 mt-4'>
                                            <div className='flex-1'>
                                                <p className='text-md font-medium text-[var(--themeBlack)]'>Clients <span className='text-red-500'>*</span></p>
                                                <Select options={clientList} onChange={(e) => { alert(e.value) }} className='w-full box-border bg-transparent outline-0 border-2 border-[var(--grey66)] text-[var(--themeBlack)] placeholder:text-gray-500 rounded-md focus:border-[var(--primaryPanel)]' />
                                                {/* <input type='text' name='invoiceNo' value={invoiceNo} onChange={(e) => { setInvoiceNo(e.target.value) }} className='happyinput' placeholder='i.e. INV1001' /> */}
                                            </div>
                                            <div className='flex-1 max-h-fit'>
                                            </div>
                                            <div className='flex-1 max-h-fit'>
                                            </div>
                                        </div>
                                        {/* <div className='flex flex-col md:flex-row gap-4'>
                                            <button className='btnGreen mt-3'>Update General Settings <i className='fa-solid fa-angle-right ml-2'></i></button>
                                        </div> */}
                                        <ToastContainer />
                                    </div>
                                </div>
                                <div className='bg-gray-50 mt-5 rounded-md px-5 sm:px-7 py-5 flex flex-col'>
                                    <h3 className='font-semibold text-lg'>Invoice Settings</h3>
                                    <div className='w-full h-[1px] rounded bg-gray-300 mt-2'></div>
                                    <div className='flex-1'>
                                        <p className='text-md font-medium text-[var(--themeBlack)] mt-4'>Theme <span className='text-red-500'>*</span></p>
                                        <div className='flex flex-row mt-1 gap-2'>
                                            <div onClick={() => { setTheme('green') }} className='rounded-full w-10 h-10 bg-[var(--greenTheme)] cursor-pointer'>
                                                {isGreen && (
                                                    <div className='rounded-full w-10 h-10 bg-black opacity-20 flex justify-center items-center text-lg text-white font-semibold'><i className='fa-solid fa-check'></i></div>
                                                )}
                                            </div>
                                            <div onClick={() => { setTheme('blue') }} className='rounded-full w-10 h-10 bg-[var(--bluePanel)] cursor-pointer'>
                                                {isBlue && (
                                                    <div className='rounded-full w-10 h-10 bg-black opacity-20 flex justify-center items-center text-lg text-white font-semibold'><i className='fa-solid fa-check'></i></div>
                                                )}
                                            </div>
                                            <div onClick={() => { setTheme('red') }} className='rounded-full w-10 h-10 bg-[var(--redPanel)] cursor-pointer'>
                                                {isRed && (
                                                    <div className='rounded-full w-10 h-10 bg-black opacity-20 flex justify-center items-center text-lg text-white font-semibold'><i className='fa-solid fa-check'></i></div>
                                                )}
                                            </div>
                                            <div onClick={() => { setTheme('purple') }} className='rounded-full w-10 h-10 bg-[var(--purplePanel)] cursor-pointer'>
                                                {isPurple && (
                                                    <div className='rounded-full w-10 h-10 bg-black opacity-20 flex justify-center items-center text-lg text-white font-semibold'><i className='fa-solid fa-check'></i></div>
                                                )}
                                            </div>
                                            <div onClick={() => { setTheme('orange') }} className='rounded-full w-10 h-10 bg-[var(--orangePanel)] cursor-pointer'>
                                                {isOrange && (
                                                    <div className='rounded-full w-10 h-10 bg-black opacity-20 flex justify-center items-center text-lg text-white font-semibold'><i className='fa-solid fa-check'></i></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GenerateInvoice