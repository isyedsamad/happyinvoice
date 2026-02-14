"use client";
import Link from "next/link";
import React, { useState } from "react";
import Loading from "../other/Loading";

const Header = (props) => {
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && (
        <Loading />
      )}
      {menu && (
        <div className="w-[100vw] h-[100vh] bg-[var(--blackTrans)] fixed flex">
          <div className="bg-white w-[80%]">
            <div className="flex justify-center items-center py-8 px-9">
              <p className="text-md font-medium text-[var(--grey66)] flex-1">
                Menu
              </p>
              <i
                className="fa-solid fa-xmark text-2xl text-[var(--grey66)]"
                onClick={() => {
                  setMenu(false);
                }}
              ></i>
            </div>
            <div className="px-9 py-3">
              <div>
                {props.page == "home" ? (
                  <Link href="./">
                    <p className="text-base font-semibold text-[var(--primaryPanel)]">
                      <i className="fa-solid fa-home mr-4"></i>Home
                    </p>
                  </Link>
                ) : (
                  <Link href="./">
                    <p className="text-base font-semibold active:text-[var(--greenDarkPanel)]">
                      <i className="fa-solid fa-home mr-4"></i>Home
                    </p>
                  </Link>
                )}
              </div>
              <div className="mt-6">
                <Link href="./">
                  <p className="text-base font-semibold active:text-[var(--greenDarkPanel)]">
                    <i className="fa-solid fa-receipt mr-4"></i>Generate Invoice
                  </p>
                </Link>
              </div>
              <div className="mt-6">
                {props.page == "features" ? (
                  <Link href="./">
                    <p className="text-base font-semibold text-[var(--primaryPanel)]">
                      <i className="fa-solid fa-bolt mr-4"></i>Features
                    </p>
                  </Link>
                ) : (
                  <Link href="./">
                    <p className="text-base font-semibold active:text-[var(--greenDarkPanel)]">
                      <i className="fa-solid fa-bolt mr-4"></i>Features
                    </p>
                  </Link>
                )}
              </div>
              <div className="mt-6">
                {props.page == "pricing" ? (
                  <Link href="./">
                    <p className="text-base font-semibold text-[var(--primaryPanel)]">
                      <i className="fa-solid fa-indian-rupee-sign mr-4"></i>
                      Pricing
                    </p>
                  </Link>
                ) : (
                  <Link href="./">
                    <p className="text-base font-semibold active:text-[var(--greenDarkPanel)]">
                      <i className="fa-solid fa-indian-rupee-sign mr-4"></i>
                      Pricing
                    </p>
                  </Link>
                )}
              </div>
            </div>
            <Link href="signin/">
              <button className="mt-8 ml-8 py-3 px-8 text-white bg-[var(--primaryPanel)] active:bg-[var(--greenDarkPanel)] font-semibold rounded-lg cursor-pointer hover:bg-[var(--greenLightPanel)]">
                Login
              </button>
            </Link>
            <Link href="signup/">
              <button className="mt-2 ml-8 py-3 px-8 bg-[var(--greenLightestPanel)] active:bg-[var(--greenLightPanel)] text-black font-semibold rounded-lg cursor-pointer hover:bg-[var(--greenLightPanel)]">
                Join Now
              </button>
            </Link>
          </div>
          <div className="w-[1%] bg-[var(--primaryPanel)]"></div>
          <div
            className="w-[19%]"
            onClick={() => {
              setMenu(false);
            }}
          ></div>
        </div>
      )}
      <div className="flex py-2 justify-center items-center bg-[var(--primaryPanel)]">
        <p className="text-sm md:text-md font-semibold text-white">
          Smart. Simple. Seamless Invoicing.
        </p>
      </div>
      <div className="bg-white flex justify-center items-center py-4 lg:px-11 border-b-2 border-[var(--primaryPanel)]">
        <div className="px-6 lg:px-8 flex justify-start items-center flex-1">
          <h1 className="font-bold text-lg">
            <span className="text-[var(--primaryPanel)]">Happy</span>Invoice
          </h1>
          <div className="hidden lg:flex flex-1 gap-10 text-[16px] font-medium justify-center items-center">
            {props.page == "home" ? (
              <p className="cursor-pointer text-[var(--primaryPanel)] hover:text-[var(--greenDarkPanel)] py-2">
                <i className="fa-solid fa-house"></i>
              </p>
            ) : (
              <p className="cursor-pointer text-black hover:text-[var(--greenDarkPanel)] py-2">
                <i className="fa-solid fa-house"></i>
              </p>
            )}
            <p className="cursor-pointer hover:text-[var(--greenDarkPanel)] py-2 flex justify-center items-center">
              <i className="fa-solid fa-receipt mr-3 font-sm"></i>
              Generate Invoice
            </p>
            {props.page == "features" ? (
              <p className="cursor-pointer text-[var(--primaryPanel)] hover:text-[var(--greenDarkPanel)] py-2 flex justify-center items-center">
                <i className="fa-solid fa-bolt mr-3 font-sm"></i>
                Features
              </p>
            ) : (
              <p className="cursor-pointer hover:text-[var(--greenDarkPanel)] py-2 flex justify-center items-center">
                <i className="fa-solid fa-bolt mr-3 font-sm"></i>
                Features
              </p>
            )}
            {props.page == "pricing" ? (
              <p className="cursor-pointer text-[var(--primaryPanel)] hover:text-[var(--greenDarkPanel)] py-2 flex justify-center items-center">
                <i className="fa-solid fa-indian-rupee-sign mr-3 font-sm"></i>
                Pricing
              </p>
            ) : (
              <p className="cursor-pointer hover:text-[var(--greenDarkPanel)] py-2 flex justify-center items-center">
                <i className="fa-solid fa-indian-rupee-sign mr-3 font-sm"></i>
                Pricing
              </p>
            )}
          </div>
          <Link href="signin/">
            <button className="hidden lg:block py-2 px-6 bg-[var(--primaryPanel)] text-white font-semibold rounded-md cursor-pointer hover:bg-[var(--greenDarkPanel)]">
              Login
            </button>
          </Link>
          <Link href="signup/">
            <button className="hidden lg:block ml-2 py-2 px-6 bg-[var(--greenLightestPanel)] text-black font-semibold rounded-md cursor-pointer hover:bg-[var(--greenLightPanel)]">
              Join Now
            </button>
          </Link>
        </div>
        <div className="flex-1 pr-2 flex lg:hidden justify-end items-center">
          <i
            className="fa-solid fa-bars text-2xl px-4"
            onClick={() => {
              setMenu(true);
            }}
          ></i>
        </div>
      </div>
    </>
  );
};

export default Header;
