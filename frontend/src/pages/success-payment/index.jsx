import React, { useEffect, useState } from "react";
import { Instance } from "../../lib/instance";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { PAYMENT_INTENT } from "../../utils/constant";
const SuccessPayment = () => {
  const [sessionDetails, setSessionDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  async function updateMyOrder() {
    try {
      const request = await Instance.get(PAYMENT_INTENT, {
        withCredentials: true,
      });
      const response = await request.data;
      if (response.success) {
        console.log(response);
        setTimeout(() => {
          navigate("/order");
        }, 1000);
      }
    } catch (error) {
      const err = error.response?.data;
      if (err) {
        console.log(err);
      }
    }
  }
  useEffect(() => {
    const sessionId = queryParams.get("session_id");

    if (sessionId) {
      updateMyOrder();
    }
  }, [location]);
  return (
    <div className="h-screen bg-[#F7F7F7] w-full flex justify-center items-center">
      <img className="w-[30rem]" src="./image/Success.gif"></img>
    </div>
  );
};

export default SuccessPayment;
