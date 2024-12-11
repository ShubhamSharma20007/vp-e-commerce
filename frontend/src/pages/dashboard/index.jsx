import React, { useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "../../components/Navbar";
import CarouselCom from "../../components/Carousel";
import { useState, useEffect } from "react";
import ProductCardSlide from "../../components/ProductCardSlide";
import { Instance } from "../../lib/instance";
import { PRODUCT_GROUP_WISE } from "../../utils/constant";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const productReducer = useSelector((state) => state.product.carts);
  const { currentUser } = useContext(UserContext);
  const [allProducts, setAllProducts] = useState([]);

  const carouselImages = [
    {
      img: "https://plus.unsplash.com/premium_photo-1664201890375-f8fa405cdb7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      img: "https://images.unsplash.com/photo-1683313041281-c2fa5f195608?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fGUlMjBjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      img: "https://plus.unsplash.com/premium_photo-1684179639963-e141ce2f8074?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const request = await Instance.get(PRODUCT_GROUP_WISE, {
          withCredentials: true,
        });
        const response = await request.data;
        if (response.success) {
          const { data } = response;

          setAllProducts(data);
        }
      } catch (error) {
        const err = error.response?.data;
        if (err) {
          console.log(err);
        }
      }
    })();
  });

  return (
    <>
      <div className="min-h-screen mb-10">
        <Navbar />
        <CarouselCom carouselImages={carouselImages} />
        <ProductCardSlide products={allProducts} />
      </div>
    </>
  );
};

export default Dashboard;
