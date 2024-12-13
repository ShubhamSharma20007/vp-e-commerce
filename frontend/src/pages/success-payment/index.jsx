import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
const SuccessPayment = () => {
  setTimeout(() => {
    window.location.href = "/";
  }, 3000);
  return (
    <div className="h-screen bg-[#F7F7F7] w-full flex justify-center items-center">
      <img className="w-[30rem]" src="./image/Success.gif"></img>
    </div>
  );
};

export default SuccessPayment;
