import React from 'react'

function TopProductCards({ item }) {
    return (


        <div class="w-full  bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img class="p-8 rounded-t-lg" src={item?.image ? item.image : item?.image[0]} alt="product image" className='' />
            </a>
            <div class="px-5 pb-5">
                <div className='flex justify-between'>
                    <span class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{item?.name}</span>
                    <span class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">₹{item?.price}</span>
                </div>
                <div>
                    <p className='text-lg font-semibold tracking-tight text-gray-900 dark:text-white'>{item?.totalOrdered} </p>
                    <p className='text-sm font-semibold tracking-tight text-gray-900 dark:text-white'>Orders</p>
                </div>

            </div>
        </div>

    )
}

export default TopProductCards
