'use client'
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import NavBar from '@/app/components/portal/navbar/NavBar'
import Sidebar from '@/app/components/portal/navbar/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db, storage } from '@/fauth/firebase'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ImageIcon, X } from "lucide-react";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { ToastContainer, toast } from 'react-toastify'
import ThemePicker from '@/app/components/other/ThemePicker'

const Settings = () => {
    const router = useRouter();
    const [isFree, setIsFree] = useState(true);
    const [url, setURL] = useState("");
    const [urlNow, setURLNow] = useState("no");
    const [urlTaken, setUrlTaken] = useState(false);
    const [urlSaved, setUrlSaved] = useState(false);
    const [urlSearch, setUrlSearch] = useState(false);
    const [planData, setPlanData] = useState({
        plan: '',
    });
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [currency, setCurrency] = useState("INR");
    const [iFooter, setIFooter] = useState("");
    const [qFooter, setQFooter] = useState("");
    const { currentUser, userData, setUserData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu } = useContext(FnContext);
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
                toast.success('Logo uploaded successfully!', {
                    theme: 'colored',
                    position: 'top-center'
                });
                resetInput();
            } catch (error) {
                setLoading(false);
                toast.success('Error: ' + error, {
                    theme: 'colored',
                    position: 'top-center'
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
            await updateDoc(docRef, { businesslogo: '' });
            const updatedUserData = {
                ...userData,
                businesslogo: ''
            }
            setUserData(updatedUserData);
            setLoading(false);
            toast.success('Logo removed successfully!', {
                theme: 'colored',
                position: 'top-center'
            });
        } catch (error) {
            setLoading(false);
            toast.success('Error: ' + error, {
                theme: 'colored',
                position: 'top-center'
            });
        }
    };
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
    useEffect(() => {
        if (isReady && currentUser && userData) {
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
            if (userData.plan == 'Free') {
                setIsFree(true);
            } else {
                setIsFree(false);
            }
            setURL(userData.username);
            setURLNow(userData.username);
            setName(userData.business.businessname);
            setMail(userData.business.businessmail);
            setPhone(userData.business.businessphone);
            setAddress(userData.business.businessaddress);
            setLogoPreview(userData.business.businesslogo);
            setCurrency(userData.business.currency ? userData.business.currency : 'INR');
            setIFooter(userData.business.ifooter ? userData.business.ifooter : '');
            setQFooter(userData.business.qfooter ? userData.business.qfooter : '');
            setLoading(false);
            if (isMenu) setIsMenu(false);
        }
        if (isReady && !currentUser && !userData) {
            router.replace('/signin/');
        }
    }, [isReady, currentUser, userData])
    const updateUsername = async () => {
        if (url != urlNow && url != '') {
            setLoading(true);
            // firebasefn
            const docRef = query(collection(db, 'happyuser'), where('username', '==', url));
            const snap = await getDocs(docRef);
            if (!snap.empty) {
                toast.error("Username already taken!", {
                    theme: 'colored',
                    position: 'top-center'
                })
                setLoading(false);
            } else {
                const docUser = doc(db, 'happyuser', currentUser.uid);
                await updateDoc(docUser, { username: url });
                const updatedUserData = {
                    ...userData,
                    username: url
                }
                setURLNow(url);
                setUserData(updatedUserData);
                setLoading(false);
                toast.success("Username updated successfully!", {
                    theme: 'colored',
                    position: 'top-center'
                })
            }
        }
    }
    // useEffect(() => {
    //     if (isReady && currentUser && userData) {
    //         if (url != '') {
    //             if (url != urlNow) {
    //                 if (urlSearch) {
    //                     const timer = setTimeout(async () => {
    //                         setLoading(true);
    //                         const docRef = query(collection(db, 'happyuser'), where('username', '==', url));
    //                         const snap = await getDocs(docRef);
    //                         if (!snap.empty) {
    //                             setUrlTaken(true);
    //                             setUrlSaved(false)
    //                             setLoading(false);
    //                         } else {
    //                             setUrlTaken(false);
    //                             const docUser = doc(db, 'happyuser', currentUser.uid);
    //                             await updateDoc(docUser, { username: url });
    //                             const updatedUserData = {
    //                                 ...userData,
    //                                 username: url
    //                             }
    //                             setURLNow(url);
    //                             setUserData(updatedUserData);
    //                             setUrlSaved(true);
    //                             setLoading(false);
    //                         }
    //                     }, 1000);
    //                     return () => clearTimeout(timer);
    //                 }
    //             } else {
    //                 setUrlSearch(true);
    //             }
    //         }
    //     }
    // }, [url, isReady, currentUser, userData]);
    const logout = () => {
        setLoading(true);
        signOut(auth);
        setLoading(false)
        router.replace('/signin/');
    }
    const generalHandler = async (e) => {
        e.preventDefault();
        // firebasefn
        setLoading(true);
        const updateRef = doc(db, 'happyuser', currentUser.uid);
        try {
            await updateDoc(updateRef, {
                'business.businessname': name,
                'business.businessmail': mail,
                'business.businessphone': phone,
                'business.businessaddress': address
            });
            const updatedUserData = {
                ...userData,
                business: {
                    ...userData.business,
                    'businessname': name,
                    'businessmail': mail,
                    'businessphone': phone,
                    'businessaddress': address
                }
            }
            setUserData(updatedUserData);
            setLoading(false);
            toast.success('Business details updated successfully!', {
                theme: 'colored',
                position: 'top-center'
            });
        } catch (error) {
            setLoading(false);
            toast.error('Error : ' + error, {
                theme: 'colored',
                position: 'top-center'
            });
        }
    }
    const brandHandler = async (e) => {
        e.preventDefault();
        // firebasefn
        setLoading(true);
        const updateRef = doc(db, 'happyuser', currentUser.uid);
        try {
            await updateDoc(updateRef, {
                'business.currency': currency,
                'business.ifooter': iFooter,
                'business.qfooter': qFooter
            });
            const updatedUserData = {
                ...userData,
                business: {
                    ...userData.business,
                    'currency': currency,
                    'ifooter': iFooter,
                    'qfooter': qFooter
                }
            }
            console.log(updatedUserData);
            setUserData(updatedUserData);
            setLoading(false);
            toast.success('Settings updated successfully!', {
                theme: 'colored',
                position: 'top-center'
            });
        } catch (error) {
            setLoading(false);
            toast.error('Error : ' + error, {
                theme: 'colored',
                position: 'top-center'
            });
        }
    }
    return (
        <>
            {isMenu && (
                <Sidebar page="settings" />
            )}
            {loading && (
                <Loading />
            )}
            <div className='flex h-screen max-w-screen bg-[var(--bgPanel)]'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="settings" />
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
                                        <h1 className='text-xl font-semibold text-[var(--textPrimary)]'>Settings</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-[var(--textSecondary)]'>configure your settings here</h3>
                            </div>
                        </div>
                        <div className='bg-[var(--cardPanel)] mt-5 rounded-md px-5 sm:px-6 py-5 flex flex-col max-w-full overflow-x-auto'>
                            <h3 className='font-semibold text-md text-[var(--textPrimary)]'>Customize your URL</h3>
                            <div className='w-full h-[1px] rounded bg-[var(--textSecondary)] mt-2'></div>
                            <div className='flex flex-col md:flex-row gap-4 mt-4'>
                                <div className=''>
                                    <p className='text-sm font-medium text-[var(--bgPanel)] rounded-md mb-3 bg-[var(--primaryPanel)] px-3 py-1'>www.happyinvoice.com/{url}</p>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Username <span className='text-red-500'>*</span></p>
                                        <input required type='text' name='url' value={url} onChange={(e) => { setURL(e.target.value) }} className='happyinput' placeholder='i.e. happyinvoice' />
                                        <p className='text-xs font-medium text-[var(--textSecondary)] rounded-md mt-1 px-1'>customize your brand url</p>
                                    </div>
                                    {url != urlNow && (
                                        <div className='flex flex-col md:flex-row gap-4'>
                                            <button onClick={() => { updateUsername() }} className='btnGreen mt-3'>Check Availability <i className='fa-solid fa-angle-right ml-2'></i></button>
                                        </div>
                                    )}
                                    {/* <div className='flex justify-start items-center'>
                                        🚀 <p className='text-md font-medium text-[var(--greenDarkPanel)] ml-3'>thehappyinvoice.com/</p><input required type='text' name='name' value={url} onChange={(e) => { setURL(e.target.value) }} className='min-w-[150px] w-full py-1 px-1 box-border outline-0 border-b-2 border-b-[var(--grey66)] text-[var(--textPrimary)] placeholder:text-gray-500 focus:border-b-[var(--primaryPanel)] hover:border-b-[var(--primaryPanel)]' placeholder='i.e. happyinvoice' />
                                    </div>
                                    {urlTaken && (
                                        <p className='text-sm font-medium text-red-700 mt-3'><i className='fa-solid fa-exclamation-triangle mr-2'></i>Username already taken, try a different one!</p>
                                    )}
                                    {urlSaved && (
                                        <p className='text-sm font-medium text-green-700 mt-3'><i className='fa-solid fa-check-circle mr-2'></i>Username updated successfully! enjoy!</p>
                                    )} */}
                                </div>
                            </div>
                            {/* <div className='flex flex-col md:flex-row gap-4'>
                                <button className='btnGreen mt-3'>Update General Details <i className='fa-solid fa-angle-right ml-2'></i></button>
                            </div> */}
                        </div>
                        <div className='bg-[var(--cardPanel)] mt-5 rounded-md px-5 sm:px-6 py-5 flex flex-col'>
                            <h3 className='font-semibold text-md text-[var(--textPrimary)]'>General Settings</h3>
                            <div className='w-full h-[1px] rounded bg-[var(--textSecondary)] mt-2'></div>
                            <div className="max-w-md mt-5">
                                <div className="w-full max-w-70 h-15 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--cardPanel)] hover:border-blue-500 transition"
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
                                                className="absolute top-2 right-2 cursor-pointer bg-black/70 text-white rounded-full p-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition"
                                                title="Remove Logo"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <ImageIcon className="w-4 h-4" />
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
                            <form onSubmit={(e) => {
                                generalHandler(e);
                            }}>
                                <div className='flex flex-col md:flex-row gap-4 mt-4'>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Business Name <span className='text-red-500'>*</span></p>
                                        <input required type='text' name='name' value={name} onChange={(e) => { setName(e.target.value) }} className='happyinput' placeholder='i.e. Rock N Services' />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Business Mail <span className='text-sm text-gray-500'>(optional)</span></p>
                                        <input type='text' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='happyinput' placeholder='i.e. support@rockn.com' />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Business Phone <span className='text-sm text-gray-500'>(optional)</span></p>
                                        <input type='text' name='phone' value={phone} onChange={(e) => { setPhone(e.target.value) }} className='happyinput' placeholder='i.e. 991 102 300' />
                                    </div>
                                </div>
                                <div className='flex flex-col md:flex-row gap-4'>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-[var(--textPrimary)] mb-1 mt-4'>Business Address <span className='text-sm text-gray-500'>(optional)</span></p>
                                        <textarea type='text' name='name' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput max-w-[350px]' placeholder='i.e. 3rd floor, Oln Appartment'></textarea>
                                    </div>
                                </div>
                                <div className='flex flex-col md:flex-row gap-4'>
                                    <button className='btnGreen mt-3'>Update General Settings <i className='fa-solid fa-angle-right ml-2'></i></button>
                                </div>
                                <ToastContainer />
                            </form>
                        </div>
                        <div className='flex-1 bg-[var(--cardPanel)] mt-5 rounded-md px-5 sm:px-6 py-5 flex flex-col'>
                            <h3 className='font-semibold text-md text-[var(--textPrimary)]'>Billing and Plan</h3>
                            <div className='w-full h-[1px] rounded bg-[var(--textSecondary)] mt-2'></div>
                            <div className='flex flex-col mt-4'>
                                <p className='text-xs font-medium text-[var(--textPrimary)] mb-1 bg-[var(--bgPanel)] px-3 py-1 rounded-md max-w-fit'>CURRENT PLAN</p>
                                {isFree ? (
                                    <p className='text-xl ml-1 font-semibold text-[var(--textPrimary)]'>FREE PLAN</p>
                                ) : (
                                    <p className='text-xl ml-1 font-semibold text-[var(--textPrimary)]'>PLUS PLAN</p>
                                )}
                            </div>
                            <div className='flex flex-col md:flex-row gap-4'>
                                {isFree && (
                                    <button className='btnGreen mt-3'>Upgrade to Plus <i className='fa-solid fa-angle-right ml-2'></i></button>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row gap-5'>
                            <div className='flex-1 bg-[var(--cardPanel)] mt-5 rounded-md px-5 sm:px-6 py-5 flex flex-col'>
                                <h3 className='font-semibold text-md text-[var(--textPrimary)]'>Branding Settings</h3>
                                <div className='w-full h-[1px] rounded bg-[var(--textSecondary)] mt-2'></div>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex-1 max-w-sm'>
                                        <p className='text-sm font-medium text-[var(--textPrimary)] mb-1 mt-4'>Theme <span className='text-red-500'>*</span></p>
                                        <ThemePicker isCard={false} />
                                        {/* <div className='flex flex-row mt-1 gap-2'>
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
                                        </div> */}
                                    </div>
                                </div>
                                <form onSubmit={(e) => {
                                    brandHandler(e);
                                }}>
                                    <div className='flex flex-col md:flex-row mt-5'>
                                        <div className='flex-1'>
                                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Currency</p>
                                            <select value={currency} onChange={(e) => { setCurrency(e.target.value) }} id='currency' name='currency' className='happyinput'>
                                                <option value="INR">INR ₹</option>
                                                <option value="USD">USD $</option>
                                                <option value="EUR">EUR €</option>
                                                <option value="GBP">GBP £</option>
                                                <option value="JPY">JPY ¥</option>
                                            </select>
                                        </div>
                                        <div className='flex-1'></div>
                                        <div className='flex-1'></div>
                                    </div>
                                    <div className='flex gap-3 md:gap-6 flex-col md:flex-row mt-6 md:mt-4'>
                                        <div className='flex-1'>
                                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Invoice Footer Note</p>
                                            <textarea type='text' name='name' value={iFooter} onChange={(e) => { setIFooter(e.target.value) }} className='happyinput' placeholder='enter invoice footer note here...'></textarea>
                                        </div>
                                        <div className='flex-1'>
                                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Quote Footer Note</p>
                                            <textarea type='text' name='name' value={qFooter} onChange={(e) => { setQFooter(e.target.value) }} className='happyinput' placeholder='enter quote footer note here...'></textarea>
                                        </div>
                                    </div>
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <button className='btnGreen mt-3'>Update Branding Settings <i className='fa-solid fa-angle-right ml-2'></i></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className='mt-5 mb-5'>
                            <button onClick={() => { logout(); }}
                                className="filter-tab-btn"
                                style={{
                                    '--tab-color': '#EF4444',
                                }}
                            ><i className='fa-solid fa-right-from-bracket mr-3'></i>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings