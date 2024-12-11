import React from "react";

const InventoryCard = ({ item }) => {
  return (
    <>
      <div className="bg-slate-100  m-5 rounded-2xl p-4 min-w-56 flex justify-center ">
        <div className="rounded-2xl bg-white p-4 w-full ">
          <div className="flex items-center">
            <span className="relative rounded-xl bg-purple-200 p-4">
              <div className="absolute top-1/2 left-1/2 h-4 -translate-x-1/2 -translate-y-1/2 transform text-purple-500">
                {item.icon}
              </div>
            </span>
            <p className="text-md ml-2 text-black capitalize font-semibold">
              {item.title}
            </p>
          </div>
          <div className="flex flex-col justify-start">
            <p className="my-4 text-left text-3xl font-bold text-gray-700">
              {item.value}
              <span className="text-sm"> ₹ </span>
            </p>
            {item.title === "sales" || item.title === "revenue" ? (
              <div class="flex items-center text-sm text-green-500">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
                </svg>
                <span> 5.5% </span>
                <span class="ml-2 text-gray-400"> vs last month </span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryCard;
