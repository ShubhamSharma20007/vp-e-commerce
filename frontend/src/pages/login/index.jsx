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
      className="flex h-screen w-screen   flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0"
      style={{
        backgroundColor: colors.bgSecondaryColor,
      }}
    >
      <div className="w-full bg-white/70 rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
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
