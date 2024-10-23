import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import Category from "../Components/Category.jsx";

const useFetchProducts = (url, setState) => {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setState(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [url, setState]);
};

const CategoryContainer = ({ category, subCategory, limit }) => {
  const [products, setProducts] = useState([]);

  useFetchProducts(`/api/product/getProducts?category=${category}&subCategory=${subCategory}&limit=${limit}`, setProducts);

  return (
    <div className="p-2 my-5">
      <Category products={products} category={category} subCategory={subCategory} />
    </div>
  );
};

export default function Home() {
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const updateCarouselImages = () => {
      if (window.innerWidth <= 520) {
        setCarouselImages([
          {
            src: "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/D103625178_DesktopTallHero_3000x1200_V3._CB558389732_%5B2%5D.jpg?alt=media&token=38bba878-e963-4b27-9862-0fe42a60caf4",
            link: "/search?category=electronics&subCategory=smartphone",
          },   
          {
            src:"https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/D132995370_Homepage_DesktopHeroTemplate_3000x1200._CB557152260_%5B1%5D.jpg?alt=media&token=06a2d127-e364-40b2-b909-442ba80997f4",
            link: "/search?category=groceries&subCategory=dairy",
          },
          {
            src: "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/PC_hero_1_2x_1._CB582889946_%5B1%5D.jpg?alt=media&token=c47262de-5843-44fc-ab3c-bbad1bf2bded",
            link: "/search?category=homeAndFurniture&subCategory=kitchenware",
          },
          {
            src: "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/5300---Kitchen-hero---BAU---update_3000X1200._CB569213170_%5B1%5D.jpg?alt=media&token=6644445f-faa0-4523-8395-031c7b6e6de7",
            link: "/search?category=groceries&subCategory=snacks",
          },
        ]);
      } else {
        setCarouselImages([
          {
            src: "/pictures/p1.jpg",
            link: "/search?category=electronics&subCategory=smartphone",
          },
          {
            src: "/pictures/p2.jpg",
            link: "/search?category=groceries&subCategory=dairy",
          },
          {
            src: "/pictures/p3.jpg",
            link: "/search?category=homeAndFurniture&subCategory=kitchenware",
          },
          {
            src: "/pictures/p4.jpg",
            link: "/search?category=groceries&subCategory=snacks",
          },
        ]);
      }
    };

    updateCarouselImages();

    window.addEventListener("resize", updateCarouselImages);

    return () => {
      window.removeEventListener("resize", updateCarouselImages);
    };
  }, []);

  return (
    <div className="container mx-auto p-0">
      <div className="h-60 sm:h-25 xl:h-80 2xl:h-90">
        <Carousel>
          {carouselImages.map((image, index) => (
            <Link key={index} to={image.link}>
              <img
                src={image.src}
                alt="..."
                className="w-full h-full object-cover object-left sm:object-center"
              />
            </Link>
          ))}
        </Carousel>
      </div>
      <CategoryContainer category="fashion" subCategory="shoes" limit={4} />
      <CategoryContainer category="electronics" subCategory="smartphone" limit={4} />
      <CategoryContainer category="electronics" subCategory="watch" limit={4} />
      <CategoryContainer category="electronics" subCategory="laptop" limit={4} />
      <CategoryContainer category="groceries" subCategory="snacks" limit={4} />
      <CategoryContainer category="homeAndFurniture" subCategory="kitchenware" limit={4} />
      <CategoryContainer category="groceries" subCategory="dairy" limit={4} />
    </div>
  );
}
