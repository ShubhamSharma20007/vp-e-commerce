import React from "react";

const CardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-lg mx-5  overflow-hidden  shadow-md h-[26rem]  w-[17rem] animate-pulse ">
      <div className="h-48  dark:bg-gray-300"></div>
      <div className="flex-1 px-4 py-8 space-y-4 sm:p-8 dark:bg-gray-50">
        <div className="w-full h-6 rounded dark:bg-gray-300"></div>
        <div className="w-full h-6 rounded dark:bg-gray-300"></div>
        <div className="w-3/4 h-6 rounded dark:bg-gray-300"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
