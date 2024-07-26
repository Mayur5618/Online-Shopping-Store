import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
    <div className='max-w-2xl mx-auto p-3 text-center mt-[-70px]'>
      <div>
        <h1 className='text-3xl font font-semibold text-center my-7'>
        Welcome to Shopping Store!
        </h1>
        <div className='text-md text-gray-500 flex flex-col gap-6'>
          <p>
          Shopping Store is your go-to online store for all your shopping needs. We are committed to offering a wide variety of high-quality products at great prices, ensuring that you have a fantastic shopping experience.
          </p>

          <p>
          Our mission is to provide our customers with the best products, exceptional customer service, and a hassle-free shopping experience. We aim to be your trusted online shopping destination.
          </p>

          <p>
          Thank you for choosing Shopping store. Happy shopping!
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}
