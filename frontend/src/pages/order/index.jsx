import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useTransition } from "react";
import { Instance } from "../../lib/instance";
import { IMAGE_PATH, ORDER_GET } from "../../utils/constant";
import OrderTable from "../../components/OrderTable";
import { useState } from "react";
import { localCurrency } from "../../utils/localCurrency";
const Order = () => {
  function handleStatus(updatedAt) {
    const nextFourDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const orderDate = new Date(updatedAt);
    const difference = nextFourDays - orderDate;
    const dayDiff = Math.floor(difference / (1000 * 60 * 60 * 24));
    console.log(nextFourDays, orderDate, dayDiff);
    switch (dayDiff) {
      case 0:
        return (
          <div className="flex items-center h-full  ">
            <p className="bg-green-300 px-2 rounded-md py-1 text-xs font-semibold  my-auto">
              Delivered
            </p>
          </div>
        );

      case 1:
        return (
          <div className="flex items-center h-full  ">
            <p className="bg-orange-300 px-2 rounded-md py-1 text-xs font-semibold  my-auto">
              Out For Delivery
            </p>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center h-full  ">
            <p className="bg-orange-300 px-2 rounded-md py-1 text-xs font-semibold  my-auto">
              Out For Delivery
            </p>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center h-full  ">
            <p className="bg-red-300 px-2 rounded-md py-1 text-xs font-semibold  my-auto">
              Order Placed
            </p>
          </div>
        );

      default:
        return (
          <div className="flex items-center h-full  ">
            <p className="bg-slate-300 px-2 rounded-md py-1 text-xs font-semibold  my-auto">
              {dayDiff} Days Ago
            </p>
          </div>
        );
    }
  }

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    {
      field: "serial no",
      flex: 1,
      cellRenderer: (params) => params.node.rowIndex + 1,
    },
    { field: "name", flex: 2, filter: true },

    {
      field: "image",
      flex: 2,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <img
            className="w-8 h-8 rounded-full"
            src={`${IMAGE_PATH}/${params?.data?.image}`}
            alt=""
          />
        </div>
      ),
    },
    { field: "category", flex: 2, filter: true },
    {
      field: "status",
      flex: 2,
      filter: true,
      cellRenderer: (params) => handleStatus(params.data.itemCreatedAt),
    },
    { field: "description", flex: 3, filter: true },
    {
      field: "quantity",
      flex: 1,
      filter: true,
    },
    {
      field: "price",
      flex: 1,
      filter: true,
      cellRenderer: (params) =>
        localCurrency(params.data.price * params.data.quantity),
    },
    {
      field: "createdAt",
      flex: 2,
      filter: true,
      cellRenderer: (params) => {
        const date = new Date(params.data.createdAt);
        return date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          format: "DD/MM/YYYY",
        });
      },
    },
  ]);

  useEffect(() => {
    async function fetchOrders() {
      const request = await Instance.get(ORDER_GET, {
        withCredentials: true,
      });
      if (request.status === 200) {
        const values = request.data.items.map((item) => item.productId);
        setRowData(values);
      }
    }
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="m-5">
        <OrderTable rowData={rowData} colDefs={colDefs} />
      </div>
    </>
  );
};

export default Order;
