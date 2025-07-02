'use client'
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import ClientEdit from '@/app/components/portal/ClientEdit'
import ClientList from '@/app/components/portal/ClientList'
import ClientTags from '@/app/components/portal/ClientTags'
import NavBar from '@/app/components/portal/NavBar'
import NewClient from '@/app/components/portal/NewClient'
import Sidebar from '@/app/components/portal/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ImageIcon, X } from "lucide-react";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

const Settings = () => {
    const router = useRouter();
    const [url, setURL] = useState("");
    const [urlNow, setURLNow] = useState("no");
    const [urlTaken, setUrlTaken] = useState(false);
    const [urlSaved, setUrlSaved] = useState(false);
    const [urlSearch, setUrlSearch] = useState(false);
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [currency, setCurrency] = useState("");
    const { currentUser, userData, setUserData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu, isNewClient, setIsNewClient, clientData, clientDataReady, setIsUpdateClient, isClientEdit, userEditArray, isNewClientTag, setIsNewClientTag, newClientTagID, setNewClientTagID } = useContext(FnContext);
    const inputRef = useRef();
    const [logoPreview, setLogoPreview] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    };
    const removeLogo = (e) => {
        e.stopPropagation(); // prevent input click
        setLogoPreview(null);
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
            document.documentElement.style.setProperty('--greenPanel', 'var(--greenPanelSet)');
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
            document.documentElement.style.setProperty('--greenPanel', 'var(--bluePanel)');
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
            document.documentElement.style.setProperty('--greenPanel', 'var(--redPanel)');
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
            document.documentElement.style.setProperty('--greenPanel', 'var(--purplePanel)');
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
            document.documentElement.style.setProperty('--greenPanel', 'var(--orangePanel)');
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
            if (!urlSearch) setURLNow(userData.username);
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
            setURL(userData.username);
            setName(userData.businessname);
            setMail(userData.businessmail);
            setPhone(userData.businessphone);
            setAddress(userData.businessaddress);
            setLogoPreview(userData.businesslogo);
            if (isMenu) setIsMenu(false);
        }
        if (isReady && !currentUser && !userData) {
            router.replace('/signin/');
        }
    }, [isReady, currentUser, userData])
    useEffect(() => {
        if (isReady && currentUser && userData) {
            if (url != '') {
                if (url != urlNow) {
                    if (urlSearch) {
                        const timer = setTimeout(async () => {
                            setLoading(true);
                            const docRef = query(collection(db, 'happyuser'), where('username', '==', url));
                            const snap = await getDocs(docRef);
                            if (!snap.empty) {
                                setUrlTaken(true);
                                setUrlSaved(false)
                                setLoading(false);
                            } else {
                                setUrlTaken(false);
                                const docUser = doc(db, 'happyuser', currentUser.uid);
                                await updateDoc(docUser, { username: url });
                                const updatedUserData = {
                                    ...userData,
                                    username: url
                                }
                                setURLNow(url);
                                setUserData(updatedUserData);
                                setUrlSaved(true);
                                setLoading(false);
                            }
                        }, 1000);
                        return () => clearTimeout(timer);
                    }
                } else {
                    setUrlSearch(true);
                }
            }
        }
    }, [url, isReady, currentUser, userData]);
    const logout = () => {
        setLoading(true);
        signOut(auth);
        setLoading(false)
        router.replace('/signin/');
    }
    return (
        <>
            {isMenu && (
                <Sidebar page="settings" />
            )}
            {loading && (
                <Loading />
            )}
            <div className='flex h-screen max-w-screen'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="settings" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen overflow-y-auto'>
                    <UpgradeBar />
                    <div className='border-b-2 px-6 border-[var(--greenLightPanel)] py-4 flex lg:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1'><span className='text-[var(--greenPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex lg:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-6 md:px-8'>
                        <div className='block sm:flex'>
                            <div className='flex-1'>
                                <div className='flex justify-start items-center'>
                                    <div>
                                        <h1 className='text-xl font-semibold'>Settings</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-gray-500'>configure your settings here</h3>
                            </div>
                        </div>
                        <div className='bg-gray-50 mt-5 rounded-md px-5 sm:px-7 py-5 flex flex-col max-w-full overflow-x-auto'>
                            <h3 className='font-semibold text-lg'>Customize your URL</h3>
                            <div className='w-full h-[1px] rounded bg-gray-300 mt-2'></div>
                            <div className='flex flex-col md:flex-row gap-4 mt-4'>
                                <div className=''>
                                    <div className='flex justify-start items-center'>
                                        🚀 <p className='text-md font-medium text-[var(--greenDarkPanel)] ml-3'>thehappyinvoice.com/</p><input required type='text' name='name' value={url} onChange={(e) => { setURL(e.target.value) }} className='min-w-[150px] w-full py-1 px-1 box-border outline-0 border-b-2 border-b-[var(--grey66)] text-[var(--themeBlack)] placeholder:text-gray-500 focus:border-b-[var(--greenPanel)] hover:border-b-[var(--greenPanel)]' placeholder='i.e. rockn' />
                                    </div>
                                    {urlTaken && (
                                        <p className='text-sm font-medium text-red-700 mt-3'><i className='fa-solid fa-exclamation-triangle mr-2'></i>Username already taken, try a different one!</p>
                                    )}
                                    {urlSaved && (
                                        <p className='text-sm font-medium text-green-700 mt-3'><i className='fa-solid fa-check-circle mr-2'></i>Username updated successfully! enjoy!</p>
                                    )}
                                </div>
                            </div>
                            {/* <div className='flex flex-col md:flex-row gap-4'>
                                <button className='btnGreen mt-3'>Update General Details <i className='fa-solid fa-angle-right ml-2'></i></button>
                            </div> */}
                        </div>
                        <div className='bg-gray-50 mt-5 rounded-md px-5 sm:px-7 py-5 flex flex-col'>
                            <h3 className='font-semibold text-lg'>General Settings</h3>
                            <div className='w-full h-[1px] rounded bg-gray-300 mt-2'></div>
                            <div className="max-w-md mt-5">
                                <div className="w-full max-w-75 h-35 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-white hover:border-blue-500 transition"
                                    onClick={() => inputRef.current.click()}>
                                    {logoPreview ? (
                                        <div className="w-full h-full relative group">
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
                                    <input required type='text' name='name' value={name} onChange={(e) => { setName(e.target.value) }} className='happyinput' placeholder='i.e. Rock N Services' />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-md font-medium text-[var(--themeBlack)]'>Business Mail <span className='text-sm text-gray-500'>(optional)</span></p>
                                    <input type='text' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='happyinput' placeholder='i.e. support@rockn.com' />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-md font-medium text-[var(--themeBlack)]'>Business Phone <span className='text-sm text-gray-500'>(optional)</span></p>
                                    <input type='text' name='phone' value={phone} onChange={(e) => { setPhone(e.target.value) }} className='happyinput' placeholder='i.e. 991 102 300' />
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row gap-4'>
                                <div className='flex-1'>
                                    <p className='text-md font-medium text-[var(--themeBlack)] mt-4'>Business Address <span className='text-sm text-gray-500'>(optional)</span></p>
                                    <textarea type='text' name='name' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput max-w-[350px]' placeholder='i.e. 3rd floor, Oln Appartment'></textarea>
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row gap-4'>
                                <button className='btnGreen mt-3'>Update General Settings <i className='fa-solid fa-angle-right ml-2'></i></button>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row gap-5'>
                            <div className='flex-1 bg-gray-50 mt-5 rounded-md px-5 sm:px-7 py-5 flex flex-col'>
                                <h3 className='font-semibold text-lg'>Branding Settings</h3>
                                <div className='w-full h-[1px] rounded bg-gray-300 mt-2'></div>
                                <div className='flex flex-col gap-4'>
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
                                <div className='flex flex-col md:flex-row mt-5'>
                                    <div className='flex-1'>
                                        <p className='text-md font-medium text-[var(--themeBlack)]'>Currency</p>
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
                                        <p className='text-md font-medium text-[var(--themeBlack)]'>Invoice Footer Note</p>
                                        <textarea type='text' name='name' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='i.e. 3rd floor, Oln Appartment'></textarea>
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-md font-medium text-[var(--themeBlack)]'>Quotes Footer Note</p>
                                        <textarea type='text' name='name' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='i.e. 3rd floor, Oln Appartment'></textarea>
                                    </div>
                                </div>
                                <div className='flex flex-col md:flex-row gap-4'>
                                    <button className='btnGreen mt-3'>Update Branding Settings <i className='fa-solid fa-angle-right ml-2'></i></button>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col mt-7 mb-5'>
                            <button onClick={() => { logout(); }} className='btnRedLight md:mx-5'><i className='fa-solid fa-right-from-bracket mr-3'></i>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings