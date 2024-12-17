import React from "react";
import { Link } from "react-router-dom";
import colors from "../../utils/colorpalette";
import { useState } from "react";
import { Instance } from "../../lib/instance";
import { useNavigate } from "react-router-dom";
import { USER_LOGIN } from "../../utils/constant";
import { customToast } from "../../lib/customToast";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
const Login = () => {
  const { setCurrentUser } = useContext(UserContext);

  const [userInputs, setUserInputs] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleValidation = () => {
    const { password, email } = userInputs;

    if (!email || !password) {
      customToast("All fields are required", "error");
      return;
    }

    var regrex = /\S+@\S+\.\S+/;
    if (!regrex.test(email)) {
      customToast("Invalid email", "error");
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
      const { password, email } = userInputs;
      // post request to store data
      try {
        const request = await Instance.post(
          USER_LOGIN,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        if (response.success) {
          setCurrentUser(response.user);
          customToast(response.message, "success");
          navigate("/");
          setUserInputs({
            email: "",
            password: "",
          });
        }
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          customToast(err.message, "error");
        }
      }
    }
  };
  return (
    <div
      className="flex  bg-no-repeat bg-cover  bg-[url('https://plus.unsplash.com/premium_photo-1674729243673-0b5e871a8a24?q=80&w=1535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] 
      h-screen w-screen   flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0"
    >
      <div className="w-full bg-white/70 rounded-lg absolute z-10  shadow border md:mt-0 sm:max-w-md xl:p-0">
        <form
          className="p-6 space-y-4 md:space-y-6 sm:py-4"
          onSubmit={handleSubmit}
        >
          <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Login
          </p>

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
              onChange={handleChange}
              type="password"
            />
          </div>

          <button
            className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:ring-blue-800 text-white"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="flex items-center justify-center w-full px-4 pb-4">
          <div className="ml-3 text-sm ">
            <label className="font-light text-gray-500  ">
              Don't have an account?
              <Link
                to={{
                  pathname: "/register",
                }}
                className="font-medium text-blue-600 hover:underline  ml-2"
              >
                Signup
              </Link>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
