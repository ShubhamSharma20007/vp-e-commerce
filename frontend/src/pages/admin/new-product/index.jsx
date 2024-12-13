import React from "react";
import Navbar from "../../../components/Navbar";
import colors from "../../../utils/colorpalette";
import { useState } from "react";
import { customToast } from "../../../lib/customToast";
import { Instance } from "../../../lib/instance";
import { PRODUCT_ADD } from "../../../utils/constant";
import { useRef } from "react";
const NewProduct = () => {
  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState({
    ele: null,
    file: null,
  });
  const [userInputs, setUserInputs] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stockes: "",
  });

  const handleUserInputs = (e) => {
    setUserInputs({ ...userInputs, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    console.log(userInputs);
    const { name, price, description, category, stockes } = userInputs;
    if (!name || !price || !description || !category || !stockes) {
      customToast("Please fill all the fields", "error");
      return;
    }
    if (isNaN(price) || isNaN(stockes)) {
      customToast("Price and stockes must be a number", "error");
      return;
    }
    if (name.trim().length < 3 || description.trim().length < 20) {
      customToast(
        "Name must be at least 3 characters and description must be at least 20 characters",
        "error"
      );
      return;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleValidation()) {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", userInputs.name);
      formData.append("price", userInputs.price);
      const imageFile = imageInput.file;

      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("description", userInputs.description);
      formData.append("category", userInputs.category);
      formData.append("stockes", userInputs.stockes);

      try {
        const request = await Instance.post(PRODUCT_ADD, formData, {
          withCredentials: true,
        });
        const response = await request.data;

        if (response.success) {
          customToast(response.message, "success");
          setUserInputs({
            name: "",
            price: "",
            description: "",
            category: "",
            stockes: "",
          });
          imageInput.ele.value = null;
        }
        setLoading(false);
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          customToast(err.message, "error");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className=" p-6  flex items-center justify-center h-[90vh]">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="bg-white rounded-lg border shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Product Details</p>
                  <p>Please fill out all the fields.</p>
                </div>
                <div className="lg:col-span-2">
                  <form
                    className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5"
                    onSubmit={handleSubmit}
                  >
                    <div className="md:col-span-3">
                      <label htmlFor="name">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={userInputs.name}
                        onChange={handleUserInputs}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Product Name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="price">Price</label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={userInputs.price}
                        onChange={handleUserInputs}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Price"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="description">Description</label>
                      <textarea
                        name="description"
                        value={userInputs.description}
                        onChange={handleUserInputs}
                        className="w-full p-2 h-20 border mt-1 rounded  bg-gray-50 resize-none"
                        id=""
                      ></textarea>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="image">Product Image</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="file"
                          name="image"
                          id="image"
                          onChange={(e) => {
                            setImageInput((prev) => ({
                              ...prev,
                              ele: e.target,
                              file: e.target.files[0],
                            }));
                          }}
                          accept=".png, .jpg, .jpeg, .webp"
                          placeholder="Image"
                          className="block w-full px-3 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
                            file:bg-gray-50 file:border-0
                            file:me-4
                            file:py-2 file:px-4
                            dark:file:text-neutral-400"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="category">Category</label>
                      <select
                        name="category"
                        id="category"
                        value={userInputs.category}
                        onChange={handleUserInputs}
                        className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      >
                        <option value="">Select Category</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kids">Kids</option>
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="stockes">Stock</label>
                      <input
                        type="number"
                        name="stockes"
                        value={userInputs.stockes}
                        id="stockes"
                        onChange={handleUserInputs}
                        className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Stock"
                      />
                    </div>

                    <div className="md:col-span-2"></div>
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end gap-3">
                        <button
                          disabled={loading}
                          type="submit"
                          className="bg-blue-500 min-w-20 justify-center flex items-center  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          {loading ? (
                            <div role="status">
                              <svg
                                aria-hidden="true"
                                class="inline w-4  h-4  text-gray-200 animate-spin fill-blue-600"
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
                        <button
                          type="reset"
                          className="bg-red-500 min-w-20 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewProduct;
