import Link from "next/link";
import React from "react";

const MainDiv = () => {
  return (
    <>
      <div className="py-10 px-8 lg:py-14 bg-[var(--greenLightest2Panel)]">
        <div className="flex h-[100%]">
          <div className="flex justify-center flex-col items-center text-left h-[100%] flex-1">
            <h1 className="font-semibold text-2xl md:text-3xl">
              Empower Your Brand with{" "}
              <span className="text-[var(--primaryPanel)]">
                Premium Invoicing
              </span>
              .
            </h1>
            <h3 className="font-medium text-sm md:text-lg text-[var(--grey66)] mt-2">
              Create, manage, and send professional invoices in seconds —
              <span className="text-black"> the smart way.</span>
            </h3>
            <Link href='signup'>
              <button className="mt-6 py-3 px-8 bg-[var(--primaryPanel)] text-white font-semibold rounded-md cursor-pointer hover:bg-[var(--greenDarkPanel)]">
                Start for Free
              </button>
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              No credit card required.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDiv;
