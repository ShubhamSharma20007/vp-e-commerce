import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useParams, useSearchParams } from "react-router-dom";
import "tippy.js/dist/tippy.css"; // optional
import { useSelector } from "react-redux";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import Navbar from "../../components/Navbar";
import Tippy from "@tippyjs/react";
import { Instance } from "../../lib/instance";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_WISE,
  // PRODUCT_QUERY_FILTER,
} from "../../utils/constant";
import ProductCard from "../../components/ProductCard";
import CardSkeleton from "../../components/CardSkeleton";
import { debouce } from "../../utils/debounce";
import { localCurrency } from "../../utils/localCurrency";
const sortOptions = [
  { name: "Price: Low to High", value: "asc" },
  { name: "Price: High to Low", value: "desc" },
];

const CategoryProduct = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productReducer = useSelector((state) => state.product.carts);
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParamsPrice = searchParams.get("price");
  const searchCategory = searchParams.getAll("category");
  const searchProductName = searchParams.get("search");
  const searchSort = searchParams.get("sort");

  const [distinctCategory, setDistinctCategory] = useState([]);
  //    product data
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const request = await Instance.get(
          `${PRODUCT_CATEGORY_WISE}/${category}`,
          {
            withCredentials: true,
          }
        );
        const response = await request.data;

        if (response.success) {
          const { products } = response;
          setProducts(products);
          setLoading(false);
        }
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [productReducer]);

  //    categories
  useEffect(() => {
    (async () => {
      try {
        const request = await Instance.get(PRODUCT_CATEGORIES, {
          withCredentials: true,
        });
        const response = await request.data;

        if (response.success) {
          const { categories } = response;
          setDistinctCategory(categories);
        }
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          console.log(err);
        }
      }
    })();
  }, [productReducer]);

  //    checkbox functionality
  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        if (e.target.checked) {
          const existingValues = newParams.getAll(e.target.name);
          if (!existingValues.includes(e.target.value)) {
            newParams.append(e.target.name, e.target.value);
          }
        } else {
          const existingValues = newParams.getAll(e.target.name);
          const updatedValues = existingValues.filter(
            (value) => value !== e.target.value
          );
          newParams.delete(e.target.name);
          updatedValues.forEach((value) =>
            newParams.append(e.target.name, value)
          );
        }
        return newParams;
      });
    }
  };

  // **************************************** Price ****************************************//

  const [priceRange, setPriceRange] = useState(0);
  const [debouncedPriceRange, setDebouncedPriceRange] =
    useState(searchParamsPrice);
  console.log(debouncedPriceRange);

  const updateDebouncedPriceRange = debouce((value) => {
    setDebouncedPriceRange(value);
  }, 100);

  const handlePrice = (e) => {
    const value = e.target.value;
    setPriceRange(value);
    updateDebouncedPriceRange(value);
  };

  useEffect(() => {
    if (priceRange > 0) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set("price", debouncedPriceRange);
        return newParams;
      });
    }
  }, [priceRange, debouncedPriceRange]);

  // **************************************** Input Text  ****************************************//

  const [searchProduct, setSearchProduct] = useState("");
  const [debouncedPrductName, setDebouncedPrductName] =
    useState(searchProductName);

  const updateDebouncedPrductName = debouce((value) => {
    setDebouncedPrductName(value);
  });

  const handleInputChange = (e) => {
    setSearchProduct(e.target.value);
    updateDebouncedPrductName(e.target.value);
    if (e.target.value.trim().length === 0) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.delete("search");
        return newParams;
      });
    }
  };

  useEffect(() => {
    if (searchProduct.trim().length > 0) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set("search", searchProduct.trim().toLowerCase());
        return newParams;
      });
    }
    // else {
    //   setSearchParams((prevParams) => {
    //     const newParams = new URLSearchParams(prevParams);
    //     newParams.delete("search");
    //     return newParams;
    //   });
    // }
  }, [searchProduct]);

  // **************************************** Sort ****************************************//

  const [sort, setSort] = useState(searchSort || "");

  const handleSort = (e) => {
    setSort(e);
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("sort", e);
      return newParams;
    });
  };

  // ****************************************  filter functionality ****************************************//

  const textSearch = searchParams.get("search");
  const priceSearch = searchParams.get("price");
  const handleFilter = () => {
    let filteredValues = [...products];

    if (textSearch) {
      filteredValues = filteredValues.filter((product) =>
        product.name.toLowerCase().includes(textSearch.toLowerCase())
      );
    }

    if (sort) {
      filteredValues = filteredValues.sort((a, b) => {
        if (sort === "asc") {
          return a.price - b.price;
        } else if (sort === "desc") {
          return b.price - a.price;
        }
        return;
      });
    }
    if (priceSearch) {
      filteredValues = filteredValues.filter(
        (product) => product.price <= priceSearch
      );
    }

    setFilteredProducts(filteredValues);
  };

  const resetQueryFilter = () => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.delete("search");
      newParams.delete("price");
      newParams.delete("sort");
    });
    location.reload();
  };

  useEffect(() => {
    if (products.length > 0) {
      handleFilter();
    }
  }, [searchParams, textSearch, sort, products]);

  return (
    <div className="bg-white">
      <div>
        <Navbar />
        {/* Mobile filter dialog */}

        {/*  this is desktop part of desktop  */}

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  h-[calc(100vh-56px)] overflow-hidden ">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-5">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h1>

            <div className="flex items-center ">
              <Menu as="div" className="relative inline-block text-left z-20 ">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <p
                          onClick={() => {
                            handleSort(option.value);
                          }}
                          className="text-gray-500
                          cursor-pointer
                            block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          {option.name}
                        </p>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className=" pt-6 h-full">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5 h-full">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <div class="w-full ">
                  <input
                    class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Search anything here..."
                    onChange={handleInputChange}
                    value={debouncedPrductName}
                  />
                </div>
                {/* 
                {Array.from({ length: 1 }).map((section, idx) => (
                  <Disclosure
                    key={idx}
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          Category
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-[&:not([data-open])]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {distinctCategory.map((option, optionIdx) => {
                          return (
                            <div key={optionIdx} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    checked={searchCategory.includes(option)}
                                    name="category"
                                    value={option}
                                    onChange={handleChange}
                                    type="checkbox"
                                    className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                  >
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-[:checked]:opacity-100"
                                    />
                                    <path
                                      d="M3 7H11"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <label className="text-sm text-gray-600 capitalize">
                                {option}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))} */}
                <div className="py-6">
                  <div className="flex justify-between items-center">
                    <label
                      for="medium-range"
                      class="inline-block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Price Range (in rupees)
                    </label>
                    <span className="text-xs font-semibold m-0">
                      {localCurrency(+debouncedPriceRange)}
                    </span>
                  </div>

                  <input
                    id="medium-range"
                    min={0}
                    max={10000}
                    step={100}
                    defaultValue={0}
                    name="price"
                    value={debouncedPriceRange}
                    onChange={handlePrice}
                    type="range"
                    class="w-full h-[4px]  bg-gray-200 mb-2 rounded-lg appearance-none  "
                  />
                </div>
                <button
                  onClick={() => resetQueryFilter()}
                  type="button"
                  class="text-white bg-gray-800 w-full hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2"
                >
                  Reset Filter
                </button>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-4 flex flex-wrap  h-full overflow-y-auto pb-20">
                {loading ? (
                  <div className="lg:col-span-4 flex flex-wrap  h-full overflow-y-auto pb-20">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <CardSkeleton key={i} />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex justify-center items-center h-full w-full">
                    <p className=" text-4xl font-semibold ">No item found</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div className="mb-5">
                      <ProductCard data={product} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CategoryProduct;
