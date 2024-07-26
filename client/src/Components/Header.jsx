import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaShoppingCart, FaSun } from "react-icons/fa";
import { themeToggle } from "../redux/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartSetUp } from "../redux/cart/cartSlice";

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const { userData } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [headerSearch, setHeaderSearch] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      const res = await fetch("/api/cart/getCartItems");
      const data = await res.json();
      if (!res.ok) {
        dispatch(cartSetUp(0));
        console.log("off");
        return;
      }
      dispatch(cartSetUp(data.totalCartItems));
    };
    if (userData) {
      fetchCartItems();
    }
  }, [userData]);

  useEffect(() => {
    if (cart > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cart]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/sign-out", {
        method: "POST",
      });

      if (res.ok) {
        navigate("/signin");
      } else {
        console.log("Internal server error...");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${headerSearch}`);
  };

  useEffect(()=>{
    setHeaderSearch("");
  },[location.search])
  return (
    <Navbar className="border-b-2 sticky top-0 z-50">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Shopping
        </span>
        Store
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search.."
          onChange={(e) => setHeaderSearch(e.target.value)}
          value={headerSearch}
          rightIcon={AiOutlineSearch}
          className="hidden lg:block"
        />
      </form>
      <Button
        className="w-12 h-10 lg:hidden d-flex justify-center items-center cursor-pointer"
        color="gray"
        pill
        type="submit"
      >
        {window.innerWidth < 1024 ? (
          <Link to="/search">
            <AiOutlineSearch />
          </Link>
        ) : (
          <AiOutlineSearch />
        )}
      </Button>
      
      <div className="flex gap-4 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:block d-flex justify-center items-center"
          color="gray"
          pill
          onClick={() => dispatch(themeToggle())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {userData ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <img
                className="rounded-full w-9 h-9 object-cover"
                src={userData.photoUrl}
              />
            }
          >
            <DropdownHeader>
              <span className="block">@{userData.username}</span>
              <span className="block truncate">{userData.email}</span>
            </DropdownHeader>

            <Link to={"/dashboard?tab=profile"}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={() => handleSignout()}>
              Sign out
            </DropdownItem>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign in
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        {userData && (
          <Navbar.Link active={path === "/projects"} as={"div"}>
           <Link to="/cart">
            <div className="cart-icon-container">
              <FaShoppingCart size={20} className="text-gray-400 mt-[2px]" />
              {cart > 0 && (
                <div className={`cart-count ${animate ? "animate-count" : ""} px-2 rounded-full`}>
                  {cart}
                </div>
              )}
            </div>
            </Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
