import React from "react";
import Navbar from "../../../components/Navbar";
import colors from "../../../utils/colorpalette";
import { useState } from "react";
import { customToast } from "../../../lib/customToast";
import { Instance } from "../../../lib/instance";
import { PRODUCT_ADD } from "../../../utils/constant";
import { useRef } from "react";
const NewProduct = () => {
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
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          customToast(err.message, "error");
        }
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
                        <option value="babies">Babies</option>
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
                          type="submit"
                          className="bg-blue-500 min-w-20 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Submit
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
