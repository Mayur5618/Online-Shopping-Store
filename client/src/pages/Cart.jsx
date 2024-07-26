import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { cartRemove, cartAdd, cartItemRemove } from "../redux/cart/cartSlice";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price);
  };

  const fetchCartItems = async () => {
    try {
      const res = await fetch("/api/cart/getCartItems");
      if (res.status===404){
        setCartItems([]);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        const total = data.cartItems.reduce((sum, item) => sum + item.total, 0);
        setTotalPrice(total);
        setCartItems(data.cartItems);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [cart]);

  const handleDelete = async (cartItem) => {
    try {
      const res = await fetch(`/api/cart/delete/${cartItem._id}`, {
        method: "delete",
      });

      if (res.ok) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== cartItem._id)
        );
        dispatch(cartItemRemove(cartItem.quantity));

        setTotalPrice(totalPrice - cartItem.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrement = async (cartItem) => {
    try {
      const res = await fetch("/api/cart/updateQuantity", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ cartId: cartItem._id, action: "add" }),
      });
      if (res.ok) {
        const data = await res.json();

        setTotalPrice((prev) => prev + parseInt(data.productId.price));

        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === cartItem._id
              ? { ...item, quantity: data.quantity, total: data.total }
              : item
          )
        );
        dispatch(cartAdd());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrement = async (cartItem) => {
    try {
      const res = await fetch("/api/cart/updateQuantity", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ cartId: cartItem._id, action: "remove" }),
      });
      if (res.ok) {
        const data = await res.json();

        setTotalPrice((prev) => prev - parseInt(data.productId.price));

        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === cartItem._id
              ? { ...item, quantity: data.quantity, total: data.total }
              : item
          )
        );
        dispatch(cartRemove());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row ">
      {/* cart */}
      <div className="flex-1 lg:min-w-[60%] md:p-9 ">
        {cartItems && cartItems.length === 0 ? (
          <div>
            <div className="md:w-[80%] mx-auto md:rounded-xl shadow-lg  dark:text-black dark:bg-white bg-gray-200 text-black">
              <img
                src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
                alt="imgcart"
                className="w-60 h-56 mx-auto pt-5"
              />
              <p className="text-center text-lg text-gray-800 py-4 pb-2">
                Your cart is empty!
              </p>
              <p className="text-center text-xs text-gray-800 pb-3">
                Add items to it now.
              </p>
              <div className="flex justify-center items-center">
                <Link to='/'>
                  <button className="bg-blue-600 px-16 text-white py-3 mb-7">
                    Shop now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className=" md:rounded-xl shadow-lg md:bg-white bg-[rgb(16,23,42) dark:text-white md:dark:text-black">
            <h1 className="font-bold light:text-black text-3xl pb-2 p-8 pt-11">
              Shopping Cart
            </h1>
            <div className="p-4">
              <Table className="hidden md:table shadow-md">
                <Table.Head>
                  <Table.HeadCell>Products</Table.HeadCell>
                  <Table.HeadCell>Quantity</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body className=" border-white">
                  {cartItems &&
                    cartItems.map((cartItem) => (
                      <Table.Row key={cartItem._id} className="bg-white">
                        <Table.Cell>
                          <img
                            className="w-20 h-20"
                            src={cartItem.productId.productPhotoUrl}
                            alt={cartItem.productId.title}
                          />
                          <span className="ml-2 hover:underline line-clamp-1">
                            <Link to={`/product/${cartItem.productId.slug}`}>
                              {cartItem.productId.title}
                            </Link>
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-2">
                            {cartItem && cartItem.quantity === 1 ? (
                              <button
                                className="px-3 py-[10px] hover:text-red-500 text-xl bg-gray-300 rounded-md"
                                onClick={() => handleDelete(cartItem)}
                              >
                                <FaTrash className="text-lg" />
                              </button>
                            ) : (
                              <button
                                className="px-4 py-1 hover:text-black text-2xl bg-gray-300 rounded-md"
                                onClick={() => handleDecrement(cartItem)}
                              >
                                -
                              </button>
                            )}

                            <h1 className="font-bold text-lg text-gray-600">
                              {cartItem.quantity}
                            </h1>
                            <button
                              className="px-3 py-1 hover:text-black text-2xl bg-gray-300 rounded-md"
                              onClick={() => handleIncrement(cartItem)}
                            >
                              +
                            </button>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="font-bold text-lg text-gray-600">
                          ₹{cartItem.total && formatPrice(cartItem.total)}
                        </Table.Cell>
                        <Table.Cell className="font-bold text-lg text-gray-600">
                          <FaTrash
                            className="text-xl mx-auto hover:text-red-500 cursor-pointer"
                            onClick={() => handleDelete(cartItem)}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
              <div className="md:hidden bg-[rgb(16,23,42) mt-2">
                {cartItems &&
                  cartItems.map((cartItem) => (
                    <div
                      key={cartItem._id}
                      className="flex flex-col border-b bg-white mb-2 rounded-2xl p-4"
                    >
                      <div className="flex items-center">
                        <img
                          className="w-24 h-24"
                          src={cartItem.productId.productPhotoUrl}
                          alt={cartItem.productId.title}
                        />
                        <div className="ml-4">
                          <Link
                            to={`/product/${cartItem.productId.slug}`}
                            className="hover:underline text-xl font-medium text-black"
                          >
                            {cartItem.productId.title}
                          </Link>
                          <h1 className="font-bold text-2xl text-gray-800 mt-2">
                          ₹{cartItem.total && formatPrice(cartItem.total)}
                          </h1>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              className={`px-3 py-2 text-2xl bg-gray-300 rounded-md ${
                                cartItem.quantity === 1
                                  ? "hover:text-red-500"
                                  : "hover:text-black"
                              }`}
                              onClick={() =>
                                cartItem.quantity === 1
                                  ? handleDelete(cartItem)
                                  : handleDecrement(cartItem)
                              }
                            >
                              {cartItem.quantity === 1 ? (
                                <FaTrash className="text-lg" />
                              ) : (
                                "-"
                              )}
                            </button>
                            <h1 className="font-bold text-lg text-gray-600">
                              {cartItem.quantity}
                            </h1>
                            <button
                              className="px-3 pb-1 text-2xl bg-gray-300 rounded-md hover:text-black"
                              onClick={() => handleIncrement(cartItem)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* </div> */}
      {/* order detail */}
      {cartItems && cartItems.length !== 0 && (
        <div className="flex-1 text- min-h-screen w-[90%] mx-auto   md:p-9">
          <div className=" md:rounded-xl rounded-md dark:text-black dark:bg-white bg-gray-white shadow-xl text-black">
            <h1 className="text-2xl font-bold p-9 pb-0">PRICE DETAILS</h1>
            <div className="flex mt-3 justify-between border-b border-slate-200  w-full max-w-2xl text-xs"></div>

            <div className="flex items-center justify-between">
              <h1 className="font-normal p-9 py-0 text-lg light:text-gray-300">
                Price ({cart} items)
              </h1>
              <h1 className="font-medium p-4 text-xl light:text-black">
              ₹{totalPrice && formatPrice(totalPrice)}
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-normal p-9 py-0 text-lg light:text-gray-300">
                Discount
              </h1>
              <h1 className="font-medium p-4 text-xl light:text-black">₹0</h1>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-normal p-9 py-0 text-lg light:text-gray-300">
                Delivery Charges
              </h1>
              <h1 className="font-medium p-4 text-xl light:text-black">₹0</h1>
            </div>
            <div className="flex mt-3 justify-between border-b  border-slate-200 mx-4 max-w-2xl text-xs"></div>
            <div className="flex items-center justify-between">
              <h1 className="font-extrabold p-9 py-6 text-lg light:text-black">
                Total Amount
              </h1>
              <h1 className="font-extrabold p-4 text-2xl light:text-black">
                ₹{totalPrice && formatPrice(totalPrice)}
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
