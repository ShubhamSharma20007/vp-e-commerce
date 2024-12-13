import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";

import { useState } from "react";
import ProductTable from "../components/ProductTable";
import { RiEdit2Line } from "react-icons/ri";
import {
  PRODUCT_COUNT,
  PRODUCT_GET,
  PRODUCT_LIST,
} from "../../../utils/constant";
import { Instance } from "../../../lib/instance";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProductUpdateForm from "../../../components/ProductUpdateForm";
import { IMAGE_PATH } from "../../../utils/constant";
import ConfirmationPopup from "../components/ConfirmationPopup";
import { PRODUCT_DELETE } from "../../../utils/constant";
import { MdOutlineDeleteForever } from "react-icons/md";
import { selectDeleteItem } from "../../../redux/productSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { customToast } from "../../../lib/customToast";
const AdminDashboard = () => {
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const dispatch = useDispatch();
  const deletemItem = useSelector((val) => val.product.deleteProduct);
  const updateFormRef = useRef(null);
  const handleOpenCloseForm = () => {
    updateFormRef.current.classList.toggle("translate-x-full");
  };

  const [currentProductData, setCurrentProductData] = useState(null);

  const CustomButtonComponent = (data) => {
    return (
      <div className="flex items-center h-full ">
        <RiEdit2Line
          onClick={() => {
            setCurrentProductData(data);
            handleOpenCloseForm();
          }}
          className="text-xl cursor-pointer transition-all duration-300  rounded-md  hover:bg-green-200 p-1 box-content "
        />
        <MdOutlineDeleteForever
          onClick={() => {
            dispatch(selectDeleteItem(data));
            setIsDeletePopupOpen(true);
          }}
          className="text-xl cursor-pointer transition-all duration-300  rounded-md  hover:bg-red-200 p-1 box-content "
        />
      </div>
    );
  };

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(null);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "name", flex: 2, filter: true },
    { field: "price", flex: 1, filter: true },
    { field: "description", flex: 3, filter: true },
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
    { field: "stockes", flex: 1, filter: true },
    {
      field: "action",
      cellRenderer: (params) => CustomButtonComponent(params.data),
      flex: 1,
    },
  ]);

  // *******************************************  product table data append   ************************************//
  //  fetch the data from the backend
  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = parseInt(searchParams.get("limit")) || 10;
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [totalProduct, setTotalProduct] = useState(0);
  const [isupdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const request = await Instance.get(PRODUCT_COUNT, {
          withCredentials: true,
        });
        if (request.data.success) {
          setTotalProduct(request.productCount);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductCount();
  }, [isupdate]);

  const fetchProduct = async () => {
    try {
      const request = await Instance.get(
        `${PRODUCT_LIST}?page=${currentPage}&limit=${""}`,
        {
          withCredentials: true,
        }
      );
      const response = await request.data;
      if (response.success) {
        const { products } = response;
        console.log(products);

        setRowData(products);
      }
    } catch (error) {
      const err = error.response?.data;
      if (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [pageSize]);

  const onPaginationChanged = (event) => {
    const newPage = event.api.paginationGetCurrentPage() + 1;
    const newLimit = event.api.paginationGetPageSize();

    const tabsNum = Math.ceil(totalProduct / pageSize);
    console.log(newPage, newLimit);

    setSearchParams({ page: newPage, limit: newLimit });
  };

  //  handle delete product
  const handleDeleteProduct = async () => {
    const id = deletemItem?._id;
    try {
      const request = await Instance.delete(`${PRODUCT_DELETE}/${id}`, {
        withCredentials: true,
      });
      if (request.data.success) {
        setIsDeletePopupOpen(false);
        customToast(request.data.message, "success");
        fetchProduct();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ConfirmationPopup
        handleDeleteProduct={handleDeleteProduct}
        isDeletePopupOpen={isDeletePopupOpen}
        setIsDeletePopupOpen={setIsDeletePopupOpen}
      />
      <div className="relative">
        <Navbar />
        <ProductUpdateForm
          currentProductData={currentProductData}
          updateFormRef={updateFormRef}
          setIsUpdate={setIsUpdate}
          isupdate={isupdate}
          handleOpenCloseForm={handleOpenCloseForm}
        />

        <div className="m-5 ">
          <ProductTable
            colDefs={colDefs}
            rowData={rowData}
            onPaginationChanged={onPaginationChanged}
            totalProduct={totalProduct}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
