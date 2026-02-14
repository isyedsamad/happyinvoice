import React from "react";

const BlockTab = () => {
  return (
    <>
      <div className="bg-[var(--primaryPanel)] py-9 px-8 md:px-11">
        <div className="block md:flex justify-center items-center">
          <div className="flex-1">
            <p className="text-lg md:text-2xl font-bold text-white">
              Empower your brand with us.
            </p>
            <p className="text-sm md:text-md font-medium mt-2 text-white">
              Hello Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              soluta sequi esse consectetur voluptatibus ipsam nisi illum saepe
              nostrum aliquam facere, nihil aliquid et quibusdam at sint rerum
              qui exercitationem?
            </p>
          </div>
          <div className="flex-1 flex justify-start md:justify-end items-center">
            <button className="mt-5 md:mt-0 py-3 px-8 bg-[var(--greenLightestPanel)] active:bg-[var(--greenLightPanel)] text-black font-semibold rounded-lg cursor-pointer hover:bg-[var(--greenLightPanel)]">
              Start for Free
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockTab;
