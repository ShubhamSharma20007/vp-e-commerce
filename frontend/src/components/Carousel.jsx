import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
const CarouselCom = ({ carouselImages }) => {
  return (
    <Carousel
      infiniteLoop
      showIndicators={false}
      showStatus={false}
      showThumbs={false}
      autoPlay
      interval={5000}
    >
      {carouselImages &&
        carouselImages.map((img, idx) => (
          <div className="w-full h-[80vh]" key={idx}>
            <img
              className="h-full w-full object-cover object-center"
              src={`${img.img}`}
            />
          </div>
        ))}
    </Carousel>
  );
};

export default CarouselCom;
