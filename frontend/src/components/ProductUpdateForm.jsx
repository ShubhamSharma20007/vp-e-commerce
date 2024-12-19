import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IMAGE_PATH, PRODUCT_UPDATE } from "../utils/constant";
import { FcAddImage } from "react-icons/fc";
import { customToast } from "../lib/customToast";
import { Instance } from "../lib/instance";
import { useDispatch } from "react-redux";
import Loading from "./Loading";

const ProductUpdateForm = ({
  currentProductData,
  updateFormRef,
  fetchProduct,
  setIsUpdate,
  isupdate,
  handleOpenCloseForm,
}) => {
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const [isloading, setLoading] = useState(false);
  const [input, setInputs] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    if (currentProductData) {
      setInputs({
        id: currentProductData._id,
        name: currentProductData.name,
        price: currentProductData.price,
        description: currentProductData.description,
        image: currentProductData.image,
        stock: currentProductData.stockes,
        category: currentProductData.category,
      });
    }
  }, [currentProductData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const validation = () => {
    if (
      input.name === "" ||
      input.price === "" ||
      input.description === "" ||
      input.image === "" ||
      input.stock === "" ||
      input.category === ""
    ) {
      customToast("Please fill all the fields", "error");
      return false;
    }

    if (input.price < 0) {
      customToast("Price should be greater than 0", "error");
      return false;
    }
    if (input.stock < 0) {
      customToast("Stock should be greater than 0", "error");
      return false;
    }

    return true;
  };

  //  form data is globally declared
  const [uploadImage, setUploadImage] = useState(null);
  const handleImageChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      setUploadImage(file);
      setInputs((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (validation()) {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("price", input.price);
      formData.append("description", input.description);
      formData.append("stock", input.stock);
      formData.append("category", input.category);
      formData.append("image", uploadImage);
      formData.append("id", input.id);
      try {
        const request = await Instance.put(
          `${PRODUCT_UPDATE}/${input.id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        if (response.success) {
          setLoading(false);
          setIsUpdate(!isupdate);
          customToast(response.message, "success");
          fetchProduct();
          //reset the inputs
          setInputs({
            name: "",
            price: "",
            description: "",
            stock: "",
            category: "",
            image: "",
          });
          setUploadImage(null);
          handleOpenCloseForm();
        }
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
    <div
      ref={updateFormRef}
      className="fixed translate-x-full transition-all duration-700 z-20 border-t border-l right-0 top-13 w-[40%] h-[calc(100vh-56px)] bg-white shadow-md p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="pl-3 text-xl font-semibold">Update Product</p>
        <AiOutlineClose
          onClick={() => {
            handleOpenCloseForm();
          }}
          className="text-xl border-[1px] border-gray-300 ml-auto cursor-pointer transition-all duration-300 rounded-full bg-gray-100 hover:bg-gray-200 p-2 box-content"
        />
      </div>

      <div className="w-full p-2 h-[90%] mt-5">
        <form
          className="flex flex-col h-full justify-between space-y-2"
          onSubmit={handleSubmit}
        >
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-1 sm:gap-0 lg:gap-4 lg:grid-cols-2 gap-4">
              <input
                placeholder="Product Name"
                className="block text-sm h-11 bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                name="name"
                onChange={handleChange}
                value={input.name}
              />

              <input
                placeholder="Price"
                className="block text-sm h-11 bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="number"
                name="price"
                onChange={handleChange}
                value={input.price}
              />
            </div>

            <div className="w-full">
              <textarea
                rows={5}
                placeholder="Description"
                className="bg-gray-100 text-sm w-full resize-none text-gray-800 border-0 rounded-md p-2 mb-3 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                name="description"
                value={input.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 sm:gap-0 lg:gap-4 lg:grid-cols-2 gap-4 items-center">
              <div className="mb-4">
                <div className="h-20 cursor-pointer group mx-auto w-20 border relative rounded-md overflow-hidden">
                  {input["image"].startsWith("blob") ? (
                    <img
                      className="h-full w-full object-cover object-top"
                      src={`${input.image}`}
                      alt="Preview"
                    />
                  ) : (
                    <img
                      className="h-full w-full object-cover object-top"
                      src={`${IMAGE_PATH}/${input?.image}`}
                      alt="Preview"
                    />
                  )}

                  <div
                    className="transition-all group-hover:flex duration-300 hidden w-full h-full inset-0 bg-black/50 absolute justify-center items-center z-20"
                    onClick={() => imageRef.current.click()}
                  >
                    <FcAddImage className="text-2xl" />
                    <input
                      ref={imageRef}
                      type="file"
                      name="image"
                      hidden
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <select
                  value={input.category}
                  name="category"
                  id="category"
                  className="transition-all text-sm h-11 mb-4 flex items-center border mt-1 rounded px-4 w-full bg-gray-100"
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
                <input
                  placeholder="Stocks"
                  className="w-full block bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  type="number"
                  name="stock"
                  value={input.stock}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            disabled={isloading}
            className="bg-gradient-to-r flex justify-center items-center h-10 mt-auto from-indigo-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
            type="submit"
          >
            {isloading ? (
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
              "Update Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdateForm;
