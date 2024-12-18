import React, { useState } from "react";
import { Instance } from "../lib/instance";
import { customToast } from "../lib/customToast";
import { USER_ADDRESS } from "../utils/constant";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const UserAddressForm = ({
  setUserAddressFormOpen,
  userAddressformOpen,
  handleUserAddressOnChange,
  addressInput,
  validateAddressDetails,
  setAddressInput,
}) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  async function handleAddressSubmit(e) {
    e.preventDefault();
    if (validateAddressDetails()) {
      setLoading(true);

      try {
        const request = await Instance.post(
          USER_ADDRESS,
          {
            ...addressInput,
          },
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        if (response.success) {
          customToast(response.message, "success");
          setUserAddressFormOpen(false);
          setCurrentUser(response.updateUser);
          setLoading(false);
          setAddressInput({
            area: "",
            city: "",
            state: "",
            pincode: "",
          });
        }
      } catch (error) {
        console.log(error);
        const err = error.response?.data;
        if (err) {
          customToast(err.message, "error");
        }
      } finally {
        setLoading(false);
      }
    }
    return;
  }
  return (
    <>
      <div className=" p-4 w-full max-w-md h-full">
        <div
          className="h-full w-[30rem] transition-all p-4  duration-500 bg-white shadow-lg absolute right-0 top-0"
          style={{
            transform: userAddressformOpen
              ? "translateX(0%)"
              : "translateX(100%)",
          }}
        >
          <div className=" rounded-lg  ">
            <div className="h-auto">
              <h3 className="text-2xl mb-0.5 font-medium" />
              <p className="mb-4 text-sm font-normal text-gray-800" />
              <div className="flex justify-between items-center">
                <div className="text-start">
                  <p className="mb-3 text-2xl capitalize font-semibold leading-5 text-slate-900">
                    User address form
                  </p>
                  <p className="mt-2 text-sm leading-4 text-slate-600">
                    You must be fill a form for shipping product
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUserAddressFormOpen(false);
                  }}
                  type="button"
                  className=" right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="#c6c7c7"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      cliprule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Close popup</span>
                </button>
              </div>
              <div className="mt-7 flex gap-2 h-full"></div>
            </div>
          </div>
          <form
            className="w-full h-[calc(100%-84px)]"
            onSubmit={handleAddressSubmit}
          >
            <input
              name="area"
              type="text"
              className="block w-full mb-3 rounded-lg border border-gray-300 px-3 py-2  outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
              placeholder="What is your area?"
              value={addressInput.area}
              onChange={handleUserAddressOnChange}
            />

            <input
              name="city"
              type="text"
              className="block w-full mb-3 rounded-lg border border-gray-300 px-3 py-2  outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
              placeholder="What is your city?"
              value={addressInput.city}
              onChange={handleUserAddressOnChange}
            />

            <input
              name="state"
              type="text"
              className="block w-full mb-3 rounded-lg border border-gray-300 px-3 py-2  outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
              placeholder="What is your state?"
              value={addressInput.state}
              onChange={handleUserAddressOnChange}
            />

            <input
              name="pincode"
              type="number"
              className="block w-full mb-3 rounded-lg border border-gray-300 px-3 py-2  outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
              placeholder="What is your pincode?"
              value={addressInput.pincode}
              onChange={handleUserAddressOnChange}
            />

            <div className="h-full  ">
              <button
                disabled={loading}
                type="submit"
                className="block mt-auto  w-full text-center rounded-lg bg-zinc-900 transition-all duration-300 hover:bg-zinc-800 p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
              >
                {loading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="inline w-6 h-6 m-auto text-gray-200 animate-spin fill-zinc-800"
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
                  <span>Submit</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserAddressForm;
