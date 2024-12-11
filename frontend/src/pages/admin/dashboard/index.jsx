import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import InventoryCard from "../components/ItemCard";
import { AiOutlineProduct } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";
import { TbCoinRupee } from "react-icons/tb";
import { BsGraphUpArrow } from "react-icons/bs";
import { useState } from "react";
import ProductTable from "../components/ProductTable";
import { RiEdit2Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { PRODUCT_GET, PRODUCT_LIST } from "../../../utils/constant";
import { Instance } from "../../../lib/instance";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProductUpdateForm from "../../../components/ProductUpdateForm";
import { IMAGE_PATH } from "../../../utils/constant";
const AdminDashboard = () => {
  const updateFormRef = useRef(null);
  const handleOpenCloseForm = () => {
    updateFormRef.current.classList.toggle("translate-x-full");
  };
  const productDets = [
    {
      title: "total product",
      value: 1000,
      icon: <AiOutlineProduct />,
    },
    {
      title: "users",
      value: 100,
      icon: <GrGroup />,
    },
    {
      title: "sales",
      value: 1000,
      icon: <TbCoinRupee />,
    },
    {
      title: "revenue",
      value: 100,
      icon: <BsGraphUpArrow />,
    },
  ];

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
        <IoClose className="text-xl cursor-pointer transition-all duration-300  rounded-md  hover:bg-red-200 p-1 box-content " />
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
  const gridRef = useRef(null);

  // get the url values
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get("limit")) || 50
  );

  const [totalProduct, setTotalProduct] = useState(0);
  const [isupdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const request = await Instance.get(
          `${PRODUCT_LIST}?page=${currentPage}&limit=${pageSize}`,
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        if (response.success) {
          const { products, productCount } = response;
          setTotalProduct(productCount);
          setRowData(products);
        }
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          console.log(err);
        }
      }
    };
    fetchProduct();
  }, [currentPage, pageSize, isupdate]);

  const onPaginationChanged = (event) => {
    const newPage = event.api.paginationGetCurrentPage() + 1;
    const newLimit = event.api.paginationGetPageSize();
    setCurrentPage(newPage);
    setPageSize(newLimit);
    setSearchParams({
      page: newPage,
      limit: newLimit,
    });
  };

  return (
    <div className="relative">
      <Navbar />
      <ProductUpdateForm
        currentProductData={currentProductData}
        updateFormRef={updateFormRef}
        setIsUpdate={setIsUpdate}
        isupdate={isupdate}
        handleOpenCloseForm={handleOpenCloseForm}
      />
      {/* <div className="flex justify-around flex-wrap ">
        {productDets.map((item, idx) => (
          <InventoryCard item={item} key={idx} />
        ))}
      </div> */}
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
  );
};

export default AdminDashboard;
