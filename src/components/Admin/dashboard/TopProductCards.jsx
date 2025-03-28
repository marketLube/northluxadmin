import React from "react";

function TopProductCards({ item }) {
  return (
    <div className="w-full  bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col ">

        <img
          className="p-5 rounded-t-lg h-80 object-contain"
          src={item?.image ? item.image : item?.image[0]}
          alt="product image"
        />

      <div className="px-5 pb-5">
        <div className="flex justify-between">
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {item?.name}
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            ₹{item?.price}
          </span>
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {item?.totalOrdered}{" "}
          </p>
          <p className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
            Orders
          </p>
        </div>
      </div>
    </div>
  );
}

export default TopProductCards;
