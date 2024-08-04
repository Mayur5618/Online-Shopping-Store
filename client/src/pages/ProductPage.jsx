import { Alert, Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../Components/CommentSection.jsx";
import ProductCard from "../Components/ProductCard.jsx";
import { cartAdd } from "../redux/cart/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";

export default function ProductPage() {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentProducts, setRecentProducts] = useState(null);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [unknown, setUnknown] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (unknown) {
      const timer = setTimeout(() => {
        setUnknown(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [unknown]);

  const fetchCartItems = async () => {
    try {
      const res = await fetch("/api/cart/getCartItems");
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

     if(userData)
    {
      fetchCartItems();
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    setLoading(true);
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/getProduct/${slug}`);
        const data = await res.json();
        if (data) {
          setProductData(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (productData) {
      const fetchRecentProducts = async () => {
        try {
          const res = await fetch(
            `/api/product/getProducts?subCategory=${productData.subCategory}&limit=5`
          );
          if (res.ok) {
            const data = await res.json();
            const filteredProducts = data.products.filter(
              (product) => product.slug !== slug
            );
            setRecentProducts(filteredProducts);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchRecentProducts();
    }
  }, [productData]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  const addToCart = async (productId) => {
    if (!userData) {
      setUnknown(true);
      return;
    }
    try {
      const res = await fetch("/api/cart/addToCart", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        await res.json();
        dispatch(cartAdd());
        fetchCartItems(); 
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.productId._id === productId);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row relative">
        <div className="flex-1">
          <div className="flex min-w-[50%] p-6 rounded-md">
            <img
              src={productData && productData.productPhotoUrl}
              alt={productData && productData.title}
              className="p-4 bg-white shadow-2xl rounded-md max-h-[500px] w-full object-contain"
            />
          </div>
        </div>
        <div className="flex-1 p-3 mx-auto lg:mx-0">
          <h5 className="text-2xl text-center lg:text-left mt-5 p-3 font-medium text-black dark:text-white lg:text-4xl">
            {productData && productData.title}
          </h5>
          <div className="flex justify-between border-b border-slate-500 w-full max-w-2xl text-xs"></div>
          <div
            className="p-7 pb-0 max-w-2xl leading-7 w-full product-content text-xl"
            dangerouslySetInnerHTML={{
              __html: productData && productData.content,
            }}
          ></div>
          <div className="flex items-center p-7 gap-3">
            <span className="text-3xl">
              ₹{productData && formatPrice(productData.price)}
            </span>
          </div>
          <div className="flex flex-col gap-5 mt-3">
            {productData && isProductInCart(productData._id) ? (
              <Link to="/cart">
                <Button
                  gradientDuoTone="purpleToBlue"
                  outline
                  className="mx-auto w-[90%]"
                >
                  Go to cart
                </Button>
              </Link>
            ) : (
              userData ? (
                <Link to="/cart">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    outline
                    className="mx-auto w-[90%]"
                    onClick={() => addToCart(productData._id)}
                  >
                    Add to cart
                  </Button>
                </Link>
              ) : (
                <Button
                  gradientDuoTone="purpleToBlue"
                  outline
                  className="mx-auto w-[90%]"
                  onClick={() => setUnknown(true)}
                >
                  Add to cart
                </Button>
              )
            )}
            <Button
              gradientDuoTone="greenToBlue"
              outline
              className="mx-auto w-[90%]"
            >
              Add to favorites
            </Button>
          </div>
          {unknown && (
            <Alert color="failure" className="w-[90%] mx-auto mt-4">
              Please sign-in
            </Alert>
          )}
        </div>
      </div>
      <div>
        <div className="md:max-w-3xl mx-auto mt-5">
          <CommentSection productInfo={productData} />
        </div>
      </div>
      <div className="mt-5 flex flex-col items-center">
        <h1 className="mt-5 mb-5 flex justify-center items-center text-2xl font-sans">
          See similar products
        </h1>
        <div className="flex gap-3 flex-wrap p-2 sm:p-0 mb-5">
          {recentProducts &&
            recentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </div>
    </>
  );
}
