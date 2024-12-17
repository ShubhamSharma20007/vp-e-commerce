import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import {
  CART_DELETE,
  CART_UPDATE,
  IMAGE_PATH,
  PAYMENT_ADD,
} from "../../utils/constant";
import { CART_GET } from "../../utils/constant";
import { Instance } from "../../lib/instance";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/productSlice";
import { customToast } from "../../lib/customToast";
import { removeFromCart } from "../../redux/productSlice";
import { localCurrency } from "../../utils/localCurrency";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import UserAddressForm from "../../components/UserAddressForm";
import { useTransition } from "react";
const Cart = () => {
  const { currentUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state.product);
  const [carts, setCarts] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userAddressformOpen, setUserAddressFormOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [addressInput, setAddressInput] = useState({
    area: "",
    pincode: "",
    state: "",
    city: "",
  });

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
      console.log(error);
      setLoading(false);
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

      if (response.success) {
        dispatch(addToCart(response.updatedCart));
        customToast(response.message, "success");
      }
    } catch (error) {
      const err = error.response?.data;
      if (err) {
        customToast(err.message, "error");
      }
    }
  };
  const handleUpdateCart = (id, quantity) => {
    startTransition(() => {
      updateCartItem(id, quantity);
    });
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

  //  ************************************    add the payement **************************************//

  const handlePayment = async () => {
    if (!currentUser.address) {
      setUserAddressFormOpen(true);
      return;
    } else {
      try {
        setPaymentLoading(true);
        const { state, pincode, city, area } = currentUser;
        const request = await Instance.post(
          PAYMENT_ADD,
          {
            products: carts,
            state,
            pincode,
            city,
            area,
          },
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        if (response.success) {
          console.log(response);
          setPaymentLoading(false);
          window.location.href = response.url;
        }
      } catch (error) {
        console.log(error);
        const err = error.response?.data;
        if (err) {
          customToast(err.message, "error");
        }
      } finally {
        setPaymentLoading(false);
      }
    }
  };

  // *********************************** user Address form ***********************************

  function validateAddressDetails() {
    const { area, city, pincode, state } = addressInput;
    if (!area || !city || !pincode || !state) {
      customToast("Please fill all the details", "error");
      return;
    }
    if (!pincode.match(/^\d{6}$/)) {
      customToast("Please enter a valid pincode", "error");
      return;
    }
    if (!state.match(/^[a-zA-Z\s]*$/)) {
      customToast("Please enter a valid state", "error");
      return;
    }
    if (!city.match(/^[a-zA-Z\s]*$/)) {
      customToast("Please enter a valid city", "error");
      return;
    }

    return true;
  }

  const handleUserAddressOnChange = (e) => {
    const { name, value } = e.target;
    setAddressInput({ ...addressInput, [name]: value });
  };

  return (
    <>
      <Navbar />

      {/* user address form */}
      <div
        className={` bg-black/50 transtion duration-500  h-screen  fixed top-0 right-0 left-0 z-50 `}
        style={{
          visibility: userAddressformOpen ? "visible" : "hidden",
          opacity: userAddressformOpen ? 1 : 0,
        }}
      >
        <UserAddressForm
          addressInput={addressInput}
          setAddressInput={setAddressInput}
          userAddressformOpen={userAddressformOpen}
          setUserAddressFormOpen={setUserAddressFormOpen}
          handleUserAddressOnChange={handleUserAddressOnChange}
          validateAddressDetails={validateAddressDetails}
        />
      </div>

      <section className="bg-white py-8 antialiased h-">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 h-full">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Shopping Cart
          </h2>
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8 h-full">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl   h-[65vh]  overflow-auto">
              {/* {carts.length > 0 ? (
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
                                handleUpdateCart(product.productId._id, -1);
                              }}
                              disabled={isPending}
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
                                handleUpdateCart(product.productId._id, 1);
                              }}
                              disabled={isPending}
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
                    <Link to={"/"}>Continue Shopping</Link>
                  </button>
                </div>
              )} */}

              {loading ? (
                <div
                  role="status"
                  className="space-y-8 skeleton m-20 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                >
                  <div className="w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full max-w-[480px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full max-w-[440px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : carts.length === 0 ? (
                <div class="flex flex-col items-center justify-center h-full ">
                  <h2 class="text-2xl font-bold text-gray-700 mb-4">
                    Your cart is empty
                  </h2>
                  <p class="text-gray-500 text-center">
                    Browse our products and add items to start shopping!
                  </p>
                  <button class="px-4 py-2 bg-blue-500 text-white rounded-md mt-4 hover:bg-blue-600">
                    <Link to={"/"}>Continue Shopping</Link>
                  </button>
                </div>
              ) : (
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
                                handleUpdateCart(product.productId._id, -1);
                              }}
                              disabled={isPending}
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
                                handleUpdateCart(product.productId._id, 1);
                              }}
                              disabled={isPending}
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
              )}
            </div>
            {loading ? (
              <div class="flex items-center justify-center w-full h-[18rem] rounded sm:w-1/2 ">
                <div class="w-full">
                  <div class="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[480px] mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[440px] mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"></div>
                  <div class="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
                  <div class="h-2.5 bg-gray-200 rounded-full w-48 mt-4"></div>
                </div>
              </div>
            ) : (
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
                          {localCurrency(orgPrice) || 0}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-900">
                          Discount
                        </dt>
                        <dd className="text-base font-medium text-green-800">
                          -{localCurrency(discountPriceFun()) || 0}
                        </dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-900">
                          Tax
                        </dt>
                        <dd className="text-base font-medium text-gray-900 ">
                          {localCurrency(TexPriceFun()) || 0}
                        </dd>
                      </dl>
                    </div>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                      <dt className="text-base font-bold text-gray-900 ">
                        Total
                      </dt>
                      <dd className="text-base font-bold text-gray-900 ">
                        {localCurrency(grandTotalFun()) || 0}
                      </dd>
                    </dl>
                  </div>
                  <button
                    disabled={paymentLoading}
                    onClick={handlePayment}
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 bg-blue-500 hover:hover:bg-blue-600"
                  >
                    {paymentLoading ? (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          class="inline w-6 h-6 m-auto text-gray-200 animate-spin fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <span>Proceed to Checkout</span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-500 ">
                      {" "}
                      or{" "}
                    </span>
                    <Link
                      to={"/"}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                    >
                      continue shopping
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
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
