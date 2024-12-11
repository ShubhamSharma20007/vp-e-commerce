import React from "react";
import { Link } from "react-router-dom";
import { IMAGE_PATH } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/productSlice";
import { CART_ADD } from "../utils/constant";
import { Instance } from "../lib/instance";
import { customToast } from "../lib/customToast";
import { BsBoxes } from "react-icons/bs";
const ProductCard = ({ data }) => {
  const dispatch = useDispatch();

  // post the cart to the database
  const handleCart = async (data) => {
    dispatch(addToCart(data));
    try {
      const request = await Instance.post(
        CART_ADD,
        {
          productId: data._id,
        },
        {
          withCredentials: true,
        }
      );
      const response = await request.data;
      if (response.success) {
        customToast(response.message, "success");
      }
    } catch (error) {
      const err = error.response?.data;
      if (err) {
        customToast(err.message, "error");
      }
    }
  };

  // try {
  //   const request = await Instance.post("/cart", productReducer, {
  //     withCredentials: true,
  //   });
  //   const response = await request.data;
  //   if (response.success) {
  //     customToast(response.message, "success");
  //   }
  // } catch (error) {
  //   const err = error.response?.data;
  //   if (err) {
  //     customToast(err.message, "error");
  //   }
  // }
  return (
    <div className="relative mx-5 card">
      <div className=" flex w-[17rem] flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
        <Link
          className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
          to={{
            pathname: `/product/${data?._id}`,
          }}
        >
          {/* out of stock layer */}
          {data.stockes === 0 && (
            <div className="h-full w-full bg-white/80 absolute top-0 left-0 z-10"></div>
          )}
          <img
            className="object-contain w-full h-full object-top"
            src={`${IMAGE_PATH}/${data?.image}`}
            alt="product image"
          />
        </Link>
        <div className="mt-3 px-5 pb-5">
          <h5 className="text-md tracking-tight capitalize text-slate-900 line-clamp-1">
            {data.name}
          </h5>

          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-xl font-bold text-slate-900">
                ${data.price}
              </span>
              <span className="text-sm text-slate-900 line-through ml-1">
                ${data.price > 500 ? data.price - 99 : data.price - 20}
              </span>
            </p>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 gap-2 font-medium text-slate-700">
              <BsBoxes />
              <span className="text-sm">{data.stockes}</span>
            </span>
          </div>
          <button
            disabled={data.stockes === 0}
            onClick={() => {
              handleCart(data);
            }}
            href="#"
            className="flex w-full items-center justify-center rounded-md bg-slate-900 px-5 h-12 text-center text-xs font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {data.stockes === 0 ? (
              <>
                <span className="text-red-500 text-md">Out of stock</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-white">Add to cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
