import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'

export default function Category({products,category,subCategory}) {
  return (
    <div className='w-full mx-auto p-0 flex flex-col gap-5 dark:bg-[#161f2e] bg-[#F8F8F8] py-0'>
        {products && products.length > 0 && (
          <div className='flex flex-col '>
            <div className='flex justify-between px-3 py-1 sm:px-9'>
            <h2 className='my-auto text-xl font-semibold capitalize'>{subCategory}</h2>
            <Link
              to={`/search?category=${category}&subCategory=${subCategory}`}
              className='text-lg text-teal-500 hover:underline text-center'
            >
            <Button gradientDuoTone='greenToBlue' outline>See all</Button>
            </Link>
            </div>
            <div className='flex flex-wrap'>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
  )
}
