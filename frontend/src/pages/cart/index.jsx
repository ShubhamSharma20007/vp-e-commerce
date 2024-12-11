import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { CART_DELETE, CART_UPDATE, IMAGE_PATH } from "../../utils/constant";
import { CART_GET } from "../../utils/constant";
import { Instance } from "../../lib/instance";
import Loading from "../../components/Loading";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/productSlice";
import { customToast } from "../../lib/customToast";
import { removeFromCart } from "../../redux/productSlice";
import { localCurrency } from "../../utils/localCurrency";
import { Link } from "react-router-dom";
const Cart = () => {
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state.product.carts);
  const [carts, setCarts] = React.useState([]);

  const [loading, setLoading] = useState(false);
  const getCartItem = async () => {
    setLoading(true);
    try {
      const request = await Instance.get(CART_GET, {
        withCredentials: true,
      });
      const response = await request.data;
      if (response.success) {
        setCarts(response.cart.products);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getCartItem();
  }, [productReducer]);

  //  update the cart item
  const updateCartItem = async (id, quantity) => {
    try {
      const request = await Instance.put(
        CART_UPDATE,
        {
          productId: id,
          quantity: quantity,
        },
        {
          withCredentials: true,
        }
      );
      const response = await request.data;
      console.log(response);
      if (response.success) {
        dispatch(addToCart(response.updatedStockProduct));
      }
    } catch (error) {
      const err = error.response?.data;
      if (err) {
        customToast(err.message, "error");
      }
    }
  };

  //  remove the item from cart
  const handleDeleteProduct = async (product) => {
    const id = product.productId._id;
    const quantity = product.quantity;
    try {
      const request = await Instance.delete(
        `${CART_DELETE}/${id}/${quantity}`,
        {
          withCredentials: true,
        }
      );
      const response = await request.data;
      console.log(response);
      if (response.success) {
        customToast(response.message, "success");
        dispatch(removeFromCart(response.data));
      }
    } catch (error) {
      console.log(error);
      const err = error.response?.data;
      if (err) {
        customToast(err.message, "error");
      }
    }
  };

  //  Original price

  const [orgPrice, setOrgPrice] = useState(0);

  function originalPriceFun(product) {
    if (product && product.length > 0) {
      const value = product.reduce((acc, curr) => {
        return acc + curr.productId.price * curr.quantity;
      }, 0);
      return value;
    }
  }
  function discountPriceFun() {
    console.log(orgPrice);
    if (orgPrice) {
      return (orgPrice * 5) / 100;
    }
  }

  function TexPriceFun() {
    if (orgPrice) {
      return (orgPrice * 2) / 100;
    }
  }

  function grandTotalFun() {
    return orgPrice - (discountPriceFun() + TexPriceFun());
  }
  useEffect(() => {
    setOrgPrice(originalPriceFun(carts));
  }, [carts, productReducer]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <section className="bg-white py-8 antialiased h-">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 h-full">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Shopping Cart
          </h2>
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8 h-full">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl   h-[65vh]  overflow-auto">
              {carts.length > 0 ? (
                carts.map((product, idx) => (
                  <div className="space-y-6 mb-2" key={idx}>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                        <a href="#" className="shrink-0 md:order-1">
                          <img
                            className=" h-20 w-20 block object-contain"
                            src={`${IMAGE_PATH}/${product?.productId?.image}`}
                            alt="imac image"
                          />
                        </a>

                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                          <div className="flex items-center">
                            <button
                              onClick={() => {
                                updateCartItem(product.productId._id, -1);
                              }}
                              type="button"
                              id="decrement-button"
                              data-input-counter-decrement="counter-input"
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 text-white dark:border-gray-600 dark:focus:ring-gray-700 "
                            >
                              <svg
                                className="h-2.5 w-2.5 text-gray-900 "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M1 1h16"
                                />
                              </svg>
                            </button>
                            <span className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 ">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() => {
                                updateCartItem(product.productId._id, 1);
                              }}
                              type="button"
                              id="increment-button"
                              data-input-counter-increment="counter-input"
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600  text-gray-600 dark:focus:ring-gray-700"
                            >
                              <svg
                                className="h-2.5 w-2.5 text-gray-900 "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 1v16M1 9h16"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="text-end md:order-4 md:w-32">
                            <p className="text-base font-bold text-gray-900 ">
                              {localCurrency(
                                product?.productId?.price * product?.quantity
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                          <p className="text-base font-medium text-gray-900 hover:underline ">
                            {product?.productId?.name}
                          </p>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline  "
                            >
                              <svg
                                className="me-1.5 h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                                />
                              </svg>
                              Add to Favorites
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteProduct(product);
                              }}
                              type="button"
                              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                            >
                              <svg
                                className="me-1.5 h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18 17.94 6M18 18 6.06 6"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div class="flex flex-col items-center justify-center h-full ">
                  <h2 class="text-2xl font-bold text-gray-700 mb-4">
                    Your cart is empty
                  </h2>
                  <p class="text-gray-500 text-center">
                    Browse our products and add items to start shopping!
                  </p>
                  <button class="px-4 py-2 bg-blue-500 text-white rounded-md mt-4 hover:bg-blue-600">
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm  sm:p-6">
                <p className="text-xl font-semibold text-gray-900 ">
                  Order summary
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-900 ">
                        Original price
                      </dt>
                      <dd className="text-base font-medium text-gray-900 ">
                        {localCurrency(orgPrice)}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-900">
                        Discount
                      </dt>
                      <dd className="text-base font-medium text-green-800">
                        -{localCurrency(discountPriceFun())}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-900">
                        Tax
                      </dt>
                      <dd className="text-base font-medium text-gray-900 ">
                        {localCurrency(TexPriceFun())}
                      </dd>
                    </dl>
                  </div>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 ">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 ">
                      {localCurrency(grandTotalFun())}
                    </dd>
                  </dl>
                </div>
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Proceed to Checkout
                </a>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 ">
                    {" "}
                    or{" "}
                  </span>
                  <button className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
                    Continue Shopping
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
