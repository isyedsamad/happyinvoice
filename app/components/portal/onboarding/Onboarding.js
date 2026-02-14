"use client";

import { useContext, useEffect, useRef, useState } from "react";
import SignaturePad from '@/app/components/other/SignaturePad'
import { useRouter } from "next/navigation";
import { X, ImageIcon, Signature } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import Loading from "../../other/Loading";
import { ToastContainer, toast } from "react-toastify";
import AccountCreatedModal from "../../modal/AccountCreatedModal";
import OnBoardingCompletedModal from "../../modal/OnBoardingCompletedModal";
import OnBoardingLoading from "../../modal/OnBoardingLoading";
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/fauth/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FnContext } from "@/context/FunctionContext";
import ThemePicker from "../../other/ThemePicker";

export default function OnboardingPage() {
    const router = useRouter()
    const { loading, setLoading, isReady, currentUser, userData, setUserData } = useContext(AuthContext)
    const { isSignature, setIsSignature, isSignatureLink } = useContext(FnContext)
    const [step, setStep] = useState(1);
    const [stepTitle, setStepTitle] = useState('Business Details')
    const [aboardModal, setAboardModal] = useState(true)
    const [savingModal, setSavingModal] = useState(false)
    const [savedModal, setSavedModal] = useState(false)
    const [changePage, setChangePage] = useState(true)
    const titleRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        mail: "",
        phone: "",
        address: "",
        invoiceFooter: "",
        quoteFooter: "",
        invoicePrefix: "INV",
        quotePrefix: "QTE",
    });
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name == '') {
            setStep(1)
            setStepTitle('Business Details')
            toast.warning('Please enter the business name to continue.', {
                position: 'top-center',
                theme: 'colored'
            })
            return;
        }
        try {
            setSavingModal(true)
            const functions = getFunctions()
            const callOnBoarding = httpsCallable(functions, 'onBoardingProcess')
            const response = await callOnBoarding(formData)
            if (response.data.success) {
                const docRef = doc(db, 'happyuser', currentUser.uid);
                const snap = await getDoc(docRef);
                setUserData(snap.data());
                setSavingModal(false)
                setSavedModal(true)
            } else {
                toast.error('Error: ' + response.data.message, {
                    position: 'top-center',
                    theme: 'colored'
                })
            }
        } catch (error) {
            toast.error('Error: ' + error.message, {
                position: 'top-center',
                theme: 'colored'
            })
        }
    };
    const logoRef = useRef();
    const signRef = useRef();
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
                const dbInvoice = doc(db, 'happyuser', currentUser.uid);
                await updateDoc(dbInvoice, { 'business.signature': downloadUrl });
                const updatedUserData = {
                    ...userData,
                    'business.signature': downloadUrl
                }
                setUserData(updatedUserData);
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
        const docRef = doc(db, 'happyuser', currentUser.uid);
        try {
            await updateDoc(docRef, { 'business.signature': '' });
            const updatedUserData = {
                ...userData,
                'business.signature': ''
            }
            setUserData(updatedUserData);
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
    useEffect(() => {
        if (isReady && !currentUser && !userData) router.replace('/signin')
        if (isReady && currentUser && userData) {
            if (userData.business.isAboard && changePage) {
                router.replace('/portal')
            } else {
                setChangePage(false)
                setLoading(false)
            }
        }
    }, [isReady, currentUser, userData])
    useEffect(() => {
        setSignPreview(isSignatureLink);
    }, [isSignatureLink])
    return (
        <>
            {loading && (
                <Loading />
            )}
            {aboardModal && (
                <AccountCreatedModal close={() => { setAboardModal(false) }} />
            )}
            {savingModal && (
                <OnBoardingLoading />
            )}
            {savedModal && (
                <OnBoardingCompletedModal />
            )}
            {isSignature && (
                <SignaturePad id='account' />
            )}
            <ToastContainer />
            <div className="w-full min-h-screen flex justify-center items-start py-5 px-4" style={{ background: 'color-mix(in srgb, var(--primaryPanel) 30%, var(--bgPanel))' }}>
                <div className="bg-[var(--bgPanel)] w-full max-w-2xl px-6 md:px-8 py-5 md:py-7 rounded-xl shadow">
                    {/* Header */}
                    <div className="mb-5">
                        <h1 ref={titleRef} className="text-lg md:text-xl font-semibold text-[var(--textPrimary)]">Getting Started with <span className="text-[var(--primaryPanel)]">Happy</span>Invoice</h1>
                        <p className="text-xs md:text-sm text-[var(--textSecondary)] mt-1">Tailor your invoicing experience for your business needs.</p>
                    </div>
                    {/* Step Progress */}
                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-[var(--textPrimary)]">Step {step} of 2: {stepTitle}</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--textSecondary) 40%, transparent)' }}>
                            <div
                                className="h-full bg-[var(--primaryPanel)] transition-all duration-300"
                                style={{ width: step === 1 ? "50%" : "100%" }}
                            />
                        </div>
                    </div>
                    {/* Form */}
                    <form onSubmit={(e) => { handleSubmit(e) }} className="flex flex-col gap-5">
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="happylabel">Business Logo <span className="text-gray-600 text-xs">(optional)</span></label>
                                    <div>
                                        <div
                                            className="w-full max-w-sm aspect-[5/1.5] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-[var(--cardPanel)] hover:border-[var(--primaryPanel)] cursor-pointer transition"
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
                                </div>
                                <div>
                                    <label className="happylabel">Business Name <span className="text-red-500">*</span></label>
                                    <input
                                        className="happyinput"
                                        required
                                        placeholder="e.g. J&J Store"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="happylabel">Business Email <span className="text-gray-600 text-xs">(optional)</span></label>
                                    <input
                                        type="email"
                                        className="happyinput"
                                        placeholder="e.g. info@yourbusiness.com"
                                        value={formData.mail}
                                        onChange={(e) => handleChange("mail", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="happylabel">Phone <span className="text-gray-600 text-xs">(optional)</span></label>
                                    <input
                                        type="number"
                                        className="happyinput"
                                        placeholder="e.g. 9910099887"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="happylabel">Business Address <span className="text-gray-600 text-xs">(optional)</span></label>
                                    <textarea
                                        className="happyinput min-h-[60px]"
                                        placeholder="e.g. C Block, AJ Street"
                                        value={formData.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className='flex-1 max-w-sm'>
                                    <p className='text-sm font-medium text-[var(--textPrimary)] mb-1 mt-4'>Theme <span className='text-red-500'>*</span></p>
                                    <ThemePicker isCard={true} />
                                </div>
                                <div className="w-full max-w-sm">
                                    <p className="text-sm font-medium text-[var(--textPrimary)] mb-2">Authorized Signature <span className="text-gray-600 text-xs">(optional)</span></p>
                                    <div
                                        className="w-full max-w-sm aspect-[5/1.5] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer bg-[var(--cardPanel)] hover:border-[var(--primaryPanel)] transition"
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
                                        <label className="text-xs font-medium text-gray-500 block mb-1">or Upload Signature Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="block cursor-pointer w-full text-sm text-[var(--textPrimary)] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[var(--primaryPanel)] file:text-white hover:file:bg-[var(--primaryPanel)]"
                                            ref={inputRefSign}
                                            onChange={handleSignUpload}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="happylabel">Invoice Footer Note <span className="text-gray-600 text-xs">(optional)</span></label>
                                    <textarea
                                        className="happyinput"
                                        placeholder="e.g. Thanks for your business!"
                                        value={formData.invoiceFooter}
                                        onChange={(e) => handleChange("invoiceFooter", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="happylabel">Quote Footer Note <span className="text-gray-600 text-xs">(optional)</span></label>
                                    <textarea
                                        className="happyinput"
                                        placeholder="e.g. Looking forward to working with you!"
                                        value={formData.quoteFooter}
                                        onChange={(e) => handleChange("quoteFooter", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="happylabel">Invoice Prefix <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            className="happyinput"
                                            placeholder="e.g. INV1001"
                                            value={formData.invoicePrefix}
                                            onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                                        />
                                        <span className="absolute right-5 top-2.5 text-[var(--textSecondary)] font-semibold">{formData.invoicePrefix.toUpperCase()}1001</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="happylabel">Quote Prefix <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            className="happyinput"
                                            placeholder="e.g. QTE1001"
                                            value={formData.quotePrefix}
                                            onChange={(e) => handleChange("quotePrefix", e.target.value)}
                                        />
                                        <span className="absolute right-5 top-2.5 text-[var(--textSecondary)] font-semibold">{formData.quotePrefix.toUpperCase()}1001</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between items-center">
                            {step === 2 ? (
                                <>
                                    <button type="button" onClick={() => {
                                        setStep(1)
                                        setStepTitle('Business Details')
                                        titleRef.current?.scrollIntoView({ behavior: 'smooth' })
                                    }} className="text-sm mt-3 cursor-pointer text-gray-500 hover:underline">Back</button>
                                    <button type="submit" className="btnGreen mt-3">Finish Setup</button>
                                </>
                            ) : (
                                <>
                                    <div></div>
                                    <p onClick={() => {
                                        setStep(2)
                                        setStepTitle('Brand Customization')
                                        titleRef.current?.scrollIntoView({ behavior: 'smooth' })
                                    }} className="btnGreen">Next Step</p>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
