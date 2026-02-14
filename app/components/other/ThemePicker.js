"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Check, Sun, Moon } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { AuthContext } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/fauth/firebase";
import { FnContext } from "@/context/FunctionContext";
const themeColors = [
  "#2BB673", // Green
  "#f8684c",
  "#2196F3", // Blue
  "#03A9F4", // Light Blue
  "#009688", // Teal
  "#00BCD4", // Cyan
  "#3F51B5", // Indigo
  "#9C27B0", // Purple
  "#673AB7", // Deep Purple
  "#E53935", // Red
  "#E91E63", // Pink
  "#FB8C00", // Orange
  "#F4511E", // Deep Orange
  "#FFC107", // Amber
  "#795548", // Brown
  "#607D8B", // Gray
  "#80ff00",
  "#ff83bf"
];
const LIGHT_TRACK = "#FFC107";
const DARK_TRACK = "#673AB7";
export default function ThemePicker(props) {
  const [isDark, setIsDark] = useState(false);
  const { currentUser, userData, setUserData, loading, isReady, setLoading } = useContext(AuthContext);
  const { setThemeData, setIsDirtyTheme, setIsUpdateTheme } = useContext(FnContext);
  const [selectedTheme, setSelectedTheme] = useState('#2BB673');
  const handleThemeChange = (color) => {
    setSelectedTheme(color);
    setTheme(color);
    setIsDirtyTheme(true);
    setThemeData({
      'theme-mode': isDark ? 'darkMode' : 'lightMode',
      'theme-color': color
    })
  };
  const setTheme = (color) => {
    localStorage.setItem('theme-color', color);
    document.documentElement.style.setProperty('--primaryPanel', color);
  }
  const isThemeSelected = (color) => selectedTheme === color;
  const toggleTheme = () => {
    setIsDirtyTheme(true);
    setThemeData({
      // opposite bcoz isDark will be changed below
      'theme-mode': isDark ? 'lightMode' : 'darkMode',
      'theme-color': selectedTheme
    })
    setIsDark(!isDark);
    if (!isDark) {
      //darkMode
      localStorage.setItem('theme-mode', 'darkMode');
      document.documentElement.style.setProperty('--bgPanel', '#11141d');
      document.documentElement.style.setProperty('--cardPanel', '#1d1f2d');
      document.documentElement.style.setProperty('--textPrimary', '#ffffff');
      document.documentElement.style.setProperty('--textSecondary', '#999999');
      document.documentElement.style.setProperty('--textTrans', '#11141d');
    } else {
      //lightMode
      localStorage.setItem('theme-mode', 'lightMode');
      document.documentElement.style.setProperty('--bgPanel', '#ffffff');
      document.documentElement.style.setProperty('--cardPanel', '#ebebeb');
      document.documentElement.style.setProperty('--textPrimary', '#000000');
      document.documentElement.style.setProperty('--textSecondary', '#666666');
      document.documentElement.style.setProperty('--textTrans', '#ffffff');
    }
  }
  useEffect(() => {
    if (isReady && currentUser && userData) {
      if (userData.theme.mode == 'lightMode') {
        setIsDark(false);
      } else {
        setIsDark(true);
      }
      setSelectedTheme(userData.theme.color);
    }
  }, [isReady, currentUser, userData])
  useEffect(() => {
    const theme = localStorage.getItem('theme-mode');
    setSelectedTheme(localStorage.getItem('theme-color'));
    setTheme(localStorage.getItem('theme-color'));
    if (theme == 'darkMode') {
      setIsDark(true);
      document.documentElement.style.setProperty('--bgPanel', '#11141d');
      document.documentElement.style.setProperty('--cardPanel', '#1d1f2d');
      document.documentElement.style.setProperty('--textPrimary', '#ffffff');
      document.documentElement.style.setProperty('--textSecondary', '#999999');
      document.documentElement.style.setProperty('--textTrans', '#11141d');
    } else {
      setIsDark(false);
      document.documentElement.style.setProperty('--bgPanel', '#ffffff');
      document.documentElement.style.setProperty('--cardPanel', '#ebebeb');
      document.documentElement.style.setProperty('--textPrimary', '#000000');
      document.documentElement.style.setProperty('--textSecondary', '#666666');
      document.documentElement.style.setProperty('--textTrans', '#ffffff');
    }
  }, [])
  return (
    <div className="space-y-4 mt-2">
      <div className="flex gap-3 items-center px-5 py-3 rounded-lg max-w-fit"
        style={{ background: props.isCard ? 'var(--cardPanel)' : 'var(--bgPanel)' }}>
        <p className="text-[var(--textPrimary)] text-sm font-semibold">Light</p>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          onClick={toggleTheme}
          className="
        relative inline-flex h-7 w-16 cursor-pointer items-center rounded-full
        shadow-inner transition-colors focus:outline-none
      "
          style={{ backgroundColor: isDark ? DARK_TRACK : LIGHT_TRACK }}
        >
          {/* Sliding knob */}
          <span
            className={`
          absolute left-1 h-5 w-5 rounded-full shadow-md transform transition-transform duration-300 ease-out
          ${isDark ? "translate-x-9 bg-white" : "translate-x-0 bg-black"}
        `}
          >
            {/* Icons inside the knob */}
            <Sun
              className={`absolute inset-0 m-auto h-3 w-3 transition-opacity duration-200 text-[#FFC107] ${isDark ? "opacity-0" : "opacity-100"
                }`}
            />
            <Moon
              className={`absolute inset-0 m-auto h-4 w-4 transition-opacity duration-200 text-[#673AB7] ${isDark ? "opacity-100" : "opacity-0"
                }`}
            />
          </span>
        </button>
        <p className="text-[var(--textPrimary)] text-sm font-semibold">Dark</p>
      </div>
      <div className="grid grid-cols-8 gap-3">
        {themeColors.map((color) => (
          <button
            type="button"
            key={color}
            onClick={() => { handleThemeChange(color) }}
            className="relative w-8 h-8 rounded-md shadow-md cursor-pointer"
            style={{ backgroundColor: color }}
          >
            {isThemeSelected(color) && (
              <Check className="absolute inset-0 m-auto w-4 h-4 text-white" />
            )}
          </button>
        ))}
        {/* <button
          onClick={() => setShowPicker(!showPicker)}
          className="relative w-8 h-8 rounded-md border shadow-md flex items-center justify-center"
        >
          <span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-blue-500 rounded-sm" />
        </button> */}
      </div>
      {/* {showPicker && ( */}
      <div className="mt-1">
        <HexColorPicker
          color={selectedTheme}
          onChange={(newColor) => { handleThemeChange(newColor) }}
        />
        <p className="mt-2 text-sm text-gray-600">
          Selected: <span className="font-mono">{selectedTheme}</span>
        </p>
      </div>
      {/* )} */}
    </div>
  );
}
