import React, { useEffect } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { USER_LOGOUT } from "../utils/constant";
import { Instance } from "../lib/instance";
import { customToast } from "../lib/customToast";
import { useSelector } from "react-redux";
import { CART_LENGTH } from "../utils/constant";
import "tippy.js/dist/tippy.css"; // optional
import Tippy from "@tippyjs/react";
const Navbar = () => {
  const productReducer = useSelector((state) => state.product.carts);

  const { currentUser } = useContext(UserContext);
  const [toggle, setIsToggle] = React.useState(false);
  const [cartarrlength, setCartArrLength] = React.useState();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const request = await Instance.get(USER_LOGOUT, {
        withCredentials: true,
      });
      const response = await request.data;

      if (response.success) {
        customToast(response.message, "success");
        navigate("/login");
      }
    } catch (error) {
      const err = error.response?.data;
      if (err) {
        customToast(err.message, "error");
      }
    }
  };

  //  cart length
  const cartLength = async () => {
    try {
      const request = await Instance.get(CART_LENGTH, {
        withCredentials: true,
      });
      const response = await request.data;

      if (response.success) {
        setCartArrLength(response.cartLength);
      }
    } catch (error) {
      const err = error.response?.data;
      if (err) {
        customToast(err.message, "error");
      }
    }
  };

  useEffect(() => {
    cartLength();
  });

  return (
    <nav className=" sticky bg-white  w-full z-20 top-0 start-0 border-b shadow-md">
      <div className="max-w-screen-lg  flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex gap-5 items-center">
          <Link
            to={"/"}
            className="self-center text-sm hover:underline  font-semibold whitespace-nowrap text-black/70"
          >
            Home
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <IoBagHandleOutline />
          <p className="uppercase font-semibold text-black">E-commerce</p>
        </div>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="sm:flex items-center gap-5 hidden">
            <div className="relative w-fit ">
              <LuUserRound
                onClick={() => setIsToggle(!toggle)}
                className="cursor-pointer hover:scale-105 transition-all duration-200"
              />

              {/* dropdown */}
              {toggle && (
                <div
                  id="dropdown"
                  class="z-10 absolute top-[40px] -left-[100px]  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 overflow-hidden "
                >
                  <ul
                    class=" text-sm text-gray-700 "
                    aria-labelledby="dropdownDefaultButton"
                  >
                    <li className="relative cursor-default ">
                      <p class="block  px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Hello{" "}
                        <span className="capitalize inline-block font-bold ">
                          {currentUser.fullName.firstName} 👋
                        </span>
                      </p>
                    </li>
                    {currentUser.role === "admin" && (
                      <>
                        <li className="relative  cursor-pointer">
                          <Link
                            to={"/admin-dashboard"}
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Admin Panel
                          </Link>
                        </li>

                        <li className="relative  cursor-pointer">
                          <Link
                            to={"/add-product"}
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            New Product
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="relative cursor-pointer ">
                      <div
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          handleLogout();
                        }}
                      >
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <Link to={"/cart"} className="relative">
              {/* cart count */}
              {/* {productReducer.length > 0 && (
                <div className="w-4 h-4 absolute -top-3 -right-3 flex items-center justify-center text-xs font-medium text-white bg-red-500 rounded-full">
                  <p className="text-xs">
                    {productReducer.length > 10 ? "10+" : productReducer.length}
                  </p>
                </div>
              )} */}

              {cartarrlength > 0 && (
                <div className="w-4 h-4 absolute -top-3 -right-3 flex items-center justify-center text-xs font-medium text-white bg-red-500 rounded-full">
                  <p className="text-xs">
                    {cartarrlength > 10 ? "10+" : cartarrlength}
                  </p>
                </div>
              )}

              <FiShoppingCart className="cursor-pointer hover:scale-105 transition-all duration-200" />
            </Link>
          </div>

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          class="items-center justify-between hidden w-full  md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="#"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="#"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
