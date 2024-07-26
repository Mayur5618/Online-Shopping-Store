import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({width,product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price);
  };

  const cardWidth = width === "90%" ? "w-[300px]" :"w-[48%]";
  const cardHeight = width === "90%" ? "h-[335px]" :"h-[230px]";
  const imageHight=width === "90%" ? "h-[260px]" :"h-[170px]";
  const padding=width === "90%" ? "p-3" :"p-1";
  return (
    <div className={`${cardWidth} ${cardHeight} sm:mt-5 mt-1 rounded-md shadow-2xl relative sm:h-[335px] group sm:w-[300px] mx-auto dark:bg-transparent transition-all border border-sky-400 mb-2 overflow-hidden`}>
      <Link to={`/product/${product.slug}`}>
        <img
          className={`w-full sm:group-hover:h-[200px] sm:h-[260px] ${imageHight} object-contain bg-white transition-all`}
          src={product.productPhotoUrl}
          alt="product img"
        />
      </Link>
        <div className={`flex sm:p-3 ${padding} flex-col`}>
          <p className="line-clamp-1 font-medium">{product.title}</p>
          <p className="line-clamp-2 font-bold text-xl">₹{product && formatPrice(product.price)}</p>
          <Link to={`/product/${product.slug}`} className="z-10 hidden sm:block group-hover:bottom-0 border !rounded-tl-none border-teal-500 p-2 rounded-md absolute left-0 right-0  bottom-[-100px] text-center m-2 hover:bg-purple-500">
            See Details
          </Link>
        </div>
    </div>
  );
}

// import React from "react";
// import { Link } from "react-router-dom";

// export default function ProductCard({ product }) {
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-IN', {
//       minimumFractionDigits: 0
//     }).format(price);
//   };
//   return (
//     <div className="w-[50%] h-[240px] mt-5 rounded-md shadow-2xl relative sm:h-[335px] group sm:w-[300px] mx-auto dark:bg-transparent transition-all border border-sky-400 overflow-hidden">
//       <Link to={`/product/${product.slug}`}>
//         <img
//           className="w-full sm:group-hover:h-[200px] h-[180px] object-contain bg-white transition-all"
//           src={product.productPhotoUrl}
//           alt="product img"
//         />
//       </Link>
//         <div className="flex sm:p-3 p-1 flex-col">
//           <p className="line-clamp-1 sm:font-medium text-sm">{product.title}</p>
//           <p className="line-clamp-2 font-bold text-xl">₹{product && formatPrice(product.price)}</p>
//           <Link to={`/product/${product.slug}`} className="z-10 group-hover:bottom-0 border !rounded-tl-none border-teal-500 p-2 rounded-md absolute left-0 right-0  bottom-[-100px] text-center m-2 hover:bg-purple-500">
//             See Details
//           </Link>
//         </div>
//     </div>
//   );
// }
