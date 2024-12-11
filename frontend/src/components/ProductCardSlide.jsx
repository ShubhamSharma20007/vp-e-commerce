import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useRef } from "react";
import { Link } from "react-router-dom";

const ProductCardSlide = ({ products }) => {
  const carouselContainers = useRef([]);
  const itemCard = useRef(null);
  const leftArrow = useRef([]);
  const rightArrow = useRef([]);
  const handleIncrementScroll = (idx) => {
    const marginAdjustment = 40;
    const adjustedWidth = 272 + marginAdjustment;

    carouselContainers.current[idx]?.scrollBy({
      left: adjustedWidth,
      behavior: "smooth",
    });
  };
  // console.log(itemCard.current.offsetWidth);

  const handleDecrementScroll = (idx) => {
    const marginAdjustment = 40;
    const adjustedWidth = 272 + marginAdjustment;
    carouselContainers.current[idx]?.scrollBy({
      left: -adjustedWidth,
      behavior: "smooth",
    });
  };

  // useEffect(() => {
  //   if (carouselContainers.current) {
  //     carouselContainers.current.forEach((i) => {
  //       // check the container is scrollable
  //       const containerWidth = i.clientWidth;
  //       if (i.scrollWidth > containerWidth) {
  //         leftArrow.current.classList.add("block");
  //         rightArrow.current.classList.add("block");
  //       } else {
  //         leftArrow.current.classList.remove("block");
  //         rightArrow.current.classList.remove("block");
  //       }
  //     });
  //   }
  // }, []);

  return (
    <>
      {products.length > 0 && products
        ? products.map((product, idx) => {
            return (
              <>
                <div className="m-5 relative" key={idx}>
                  <h1 className="text-2xl capitalize font-semibold border-b-[1px] pb-3 border-gray-300 tracking-wide">
                    {product.category}
                  </h1>
                  <div className="flex  w-full justify-center items-center  relative">
                    <div
                      ref={(ele) => {
                        return (leftArrow.current[idx] = ele);
                      }}
                      className="top-1/2 -left-3 z-10 absolute  inline-block"
                    >
                      <MdKeyboardArrowLeft
                        onClick={() => handleDecrementScroll(idx)}
                        className="text-3xl text-gray-500 cursor-pointer hover:border hover:border-gray-500 transition-all duration-300 rounded-full hover:bg-white/80 "
                      />
                    </div>
                    <div
                      className=" flex w-full my-5   overflow-hidden justify-start items-center  transition-all duration-300 ease-in-out"
                      ref={(el) => {
                        return (carouselContainers.current[idx] = el);
                      }}
                    >
                      {product.products.map((data, idx) => (
                        <ProductCard key={idx} data={data} />
                      ))}
                    </div>

                    <div className="top-1/2 -right-3 z-10 absolute  inline-block">
                      <MdKeyboardArrowRight
                        ref={(ele) => {
                          return (rightArrow.current[idx] = ele);
                        }}
                        onClick={() => handleIncrementScroll(idx)}
                        className=" text-3xl text-gray-500 cursor-pointer hover:border hover:border-gray-500 transition-all duration-300 rounded-full hover:bg-white/80"
                      />
                    </div>
                  </div>
                  {product.products.length >= 10 ? (
                    <div className="flex justify-center items-center">
                      <Link
                        to={`/category/${product.category}`}
                        className=" text-center text-blue-500 w-full text-semibold text-lg hover:underline "
                      >
                        View All
                      </Link>
                    </div>
                  ) : null}
                </div>
              </>
            );
          })
        : ""}
    </>
  );
};

export default ProductCardSlide;
