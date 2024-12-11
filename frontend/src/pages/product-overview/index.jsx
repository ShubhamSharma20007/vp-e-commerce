import React from "react";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { Instance } from "../../lib/instance";
import { PRODUCT_GET } from "../../utils/constant";
import { useParams } from "react-router-dom";
import { IMAGE_PATH } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/productSlice";
import { CART_ADD } from "../../utils/constant";
import { customToast } from "../../lib/customToast";
import { localCurrency } from "../../utils/localCurrency";
const ProductOverView = () => {
  const [itemProduct, setItemProduct] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const request = await Instance.get(`${PRODUCT_GET}/${id}`, {
          withCredentials: true,
        });
        const response = await request.data;
        if (response.success) {
          const { data } = response;
          setItemProduct(data);
        }
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          console.log(err);
        }
      }
    })();
  }, []);

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

  return (
    <>
      <Navbar />
      {!itemProduct ? (
        <div
          role="status"
          class="space-y-8 m-20 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
        >
          <div class="flex items-center justify-center w-full h-[18rem] bg-gray-300 rounded sm:w-1/2 dark:bg-gray-400">
            <svg
              class="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <div class="w-full">
            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-48 mb-4"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-300 max-w-[480px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-300 max-w-[440px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-300 max-w-[460px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-300 max-w-[360px]"></div>
          </div>
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        <section class="py-8  antialiased m-auto ">
          <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0">
            <div class="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
              <div class="shrink-0 w-80 lg:max-w-lg mx-auto  ">
                {
                  <img
                    src={`${IMAGE_PATH}/${itemProduct?.image}`}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      margin: "auto",
                    }}
                  />
                }
              </div>

              <div class="mt-6 sm:mt-8 lg:mt-0">
                <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl ">
                  {itemProduct?.name}
                </h1>
                <div class="mt-4 sm:items-center sm:gap-4 sm:flex">
                  <p class="text-2xl font-extrabold text-gray-900 sm:text-3xl ">
                    {localCurrency(itemProduct?.price)}
                  </p>
                </div>

                <div class="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                  {itemProduct.stockes === 0 ? (
                    <span className="text-red-500 font-medium">
                      Out of stock
                    </span>
                  ) : (
                    <>
                      <div className="flex cursor-pointer group gap-2 transition-all duration-100 items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-600 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 hover:text-white ">
                        <svg
                          class="w-5 h-5 "
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                          />
                        </svg>
                        <span
                          className="text-black group-hover:text-white font-medium 
                          "
                          onClick={() => {
                            handleCart(itemProduct);
                          }}
                        >
                          Add to cart
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <hr class="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

                <p class="mb-6 text-gray-600 ">{itemProduct?.description}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductOverView;
