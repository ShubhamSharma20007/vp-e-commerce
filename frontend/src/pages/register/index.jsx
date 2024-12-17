import React, { useState } from "react";
import colors from "../../utils/colorpalette";
import { Link } from "react-router-dom";
import { USER_REGISTER } from "../../utils/constant";
import { customToast } from "../../lib/customToast";
import { Instance } from "../../lib/instance";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [userInputs, setUserInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleValidation = () => {
    const { password, firstName, lastName, email, confirmPassword } =
      userInputs;
    if (password !== confirmPassword) {
      customToast("Password and confirm password do not match", "error");
      return;
    }
    if (password.length < 6) {
      customToast("Password must be at least 6 characters", "error");
      return;
    }
    var regrex = /\S+@\S+\.\S+/;
    if (!regrex.test(email)) {
      customToast("Invalid email", "error");
      return;
    }
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      customToast("All fields are required", "error");
      return;
    }
    if (firstName.trim().length < 3 || lastName.trim().length < 3) {
      customToast("Name must be at least 3 characters", "error");
      return;
    }
    return true;
  };

  const handleChange = (e) => {
    setUserInputs({ ...userInputs, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { password, firstName, lastName, email, confirmPassword } =
        userInputs;
      // post request to store data
      try {
        const request = await Instance.post(
          USER_REGISTER,
          {
            fullName: {
              firstName,
              lastName,
            },
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        if (response.success) {
          customToast(response.message, "success");
          navigate("/login");
          setUserInputs({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          customToast(err.message, "error");
        }

        // if (arr_error?.errors) {
        //   Object.values(arr_error).forEach((error) =>
        //     customToast(error.msg, "error")
        //   );
        // } else {
        //   customToast(arr_error, "error");
        // }
      }
    }
  };
  return (
    <>
      <div className="flex bg-no-repeat bg-cover  bg-[url('https://plus.unsplash.com/premium_photo-1674729243673-0b5e871a8a24?q=80&w=1535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]  h-screen w-screen   flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white/70 rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <form
            className="p-6 space-y-4 md:space-y-6 sm:py-4"
            onSubmit={handleSubmit}
          >
            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create an account
            </p>
            <div className="w-full sm:flex justify-between items-center gap-x-4 space-y-4 md:space-y-0  ">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  First Name
                </label>
                <input
                  placeholder="Firsname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full ">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Last Name
                </label>
                <input
                  placeholder="Last Name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="Email"
                name="email"
                type="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="••••••••"
                name="password"
                type="password"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Confirm password
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="••••••••"
                id="confirmPassword"
                name="confirmPassword"
                type="text"
                onChange={handleChange}
              />
            </div>

            <button
              className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:ring-blue-800 text-white"
              type="submit"
            >
              Create an account
            </button>
          </form>
          <div className="flex items-center justify-center w-full px-4 pb-4">
            <div className="ml-3 text-sm ">
              <label className="font-light text-gray-500  ">
                Already have an account?
                <Link
                  to={{
                    pathname: "/login",
                  }}
                  className="font-medium text-blue-600 hover:underline  ml-2"
                >
                  Login
                </Link>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
