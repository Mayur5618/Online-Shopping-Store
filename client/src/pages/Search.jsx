import React, { useEffect, useState } from "react";
import { Label, Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../Components/ProductCard.jsx";

export default function Search() {
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
    subCategory: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const category = urlParams.get("category") || "";
    const sort = urlParams.get("sort") || "desc";
    const subCategory = urlParams.get("subCategory") || "";

    setSearchData({ sort, category, subCategory, searchTerm });

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const searchQuery = new URLSearchParams(urlParams);
        if (!searchTerm) searchQuery.delete("searchTerm");
        if (!category) searchQuery.delete("category");
        if (!subCategory) searchQuery.delete("subCategory");

        const res = await fetch(
          `/api/product/getProducts?${searchQuery.toString()}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.products);
        setShowMore(data.products.length === 9);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const urlParams = new URLSearchParams();
    
    window.innerWidth > 1024 ? urlParams.set("searchTerm",""):urlParams.set("searchTerm", searchData.searchTerm);
    if (searchData.sort) urlParams.set("sort", searchData.sort);
    if (searchData.category) urlParams.set("category", searchData.category);
    if (searchData.subCategory){
      let result = searchData.subCategory
      .split(' ')             
      .map((word, index) =>index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');   ;
      urlParams.set("subCategory", result);
    }

    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = products.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);

    try {
      const searchQuery = new URLSearchParams(urlParams);
      if (!searchData.category) searchQuery.delete("category");
      if (!searchData.subCategory) searchQuery.delete("subCategory");

      const res = await fetch(
        `/api/product/getProducts?${searchQuery.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch more products");

      const data = await res.json();
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setShowMore(data.products.length === 9);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getSubCategories = () => {
    const categories = {
      electronics: ["Laptop", "Camera", "Smartphone", "Watch", "Television"],
      fashion: ["Shirts", "Shoes", "Heels", "Jewelry", "Sneakers"],
      groceries: ["Fruits and Vegetables", "Dairy", "Beverages", "Snacks"],
      toyAndGames: [
        "Video Games",
        "Puzzles",
        "Action Figures",
        "Dolls and Accessories",
        "Educational Toys",
      ],
      homeAndFurniture: [
        "Living Room Furniture",
        "Bedroom Furniture",
        "Office Furniture",
        "Lighting",
        "Kitchenware",
      ],
    };
    return categories[searchData.category] || [];
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Search Sidebar */}
      <div className="md:min-h-screen p-7 border-b-[1px] border-gray-500">
        <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
          <div className="lg:hidden sm:flex items-center gap-2">
            <Label className="whitespace-nowrap font-medium text-md">Search Term:</Label>
            <TextInput
              id="searchTerm"
              placeholder="Search..."
              value={searchData.searchTerm}
              onChange={(e) => setSearchData({ ...searchData, searchTerm: e.target.value })}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="font-medium text-md">Category:</Label>
            <Select
              id="category"
              value={searchData.category}
              onChange={(e) =>
                setSearchData({ ...searchData, category: e.target.value, subCategory: ""})
              }
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="groceries">Groceries</option>
              <option value="toyAndGames">Toy and Games</option>
              <option value="homeAndFurniture">Home and Furniture</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="font-medium text-md">Sort:</Label>
            <Select
              id="sort"
              value={searchData.sort}
              onChange={(e) =>
                setSearchData({ ...searchData, sort: e.target.value })
              }
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          {searchData.category && (
            <div className="flex items-center gap-2">
              <Label className="font-medium text-md">Sub-Type:</Label>
              <Select
                id="subCategory"
                onChange={(e) =>{
                  const selectedValue= e.target.value.toLowerCase();
                  setSearchData({
                    ...searchData,
                    subCategory:selectedValue,
                  });
                }
                }
                value={searchData.subCategory}
              >
                <option value="">Sub-type</option>
                {getSubCategories().map((subCategory) => (
                  <option key={subCategory.toLowerCase()} value={subCategory.toLowerCase()}>
                    {subCategory}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            outline
            className="mt-3"
          >
            Apply Filters
          </Button>
        </form>
      </div>
      {/* Display Search Products */}
      <div className="w-full md:border-l-[1px] border-gray-500">
        <div className="md:border-b-[1px] border-gray-500 p-3 mt-5">
          <h1 className="text-3xl font-medium">Products results:</h1>
        </div>
        <div className="flex sm:flex-row flex-col flex-wrap gap-5 p-5">
          {!loading && products.length === 0 && (
            <h1 className="text-xl text-gray-500 m-3">No products found.</h1>
          )}
          {loading && <p className="text-gray-400 text-lg">Loading...</p>}
          {!loading &&
            products.map((product) => (
              <ProductCard width="90%" key={product._id} product={product} />
            ))}
          {showMore && (
            <p
              onClick={handleShowMore}
              className="text-gray-400 w-full text-center hover:text-teal-500 cursor-pointer hover:underline underline-offset-2"
            >
              Show More
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
