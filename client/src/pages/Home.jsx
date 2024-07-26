import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import Category from "../Components/Category.jsx";

export default function Home() {
  const [shoes, setShoes] = useState([]);
  const [smartPhone, setSmartPhone] = useState([]);
  const [watch, setWatch] = useState([]);
  const [laptop, setLaptop] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        "/api/product/getProducts?category=fashion&subCategoty=shoes&limit=4"
      );
      const data = await res.json();
      setShoes(data.products);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        "/api/product/getProducts?subCategory=smartphone&limit=4"
      );
      const data = await res.json();
      setSmartPhone(data.products);
    };
    fetchProducts();
  }, []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        "/api/product/getProducts?subCategory=laptop&limit=4"
      );
      const data = await res.json();
      setLaptop(data.products);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        "/api/product/getProducts?subCategory=watch&limit=4"
      );
      const data = await res.json();
      setWatch(data.products);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const updateCarouselImages = () => {
      if (window.innerWidth <= 430) {
        setCarouselImages([
          {
            src: "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/PC_hero_1_2x_1._CB582889946_%5B1%5D.jpg?alt=media&token=c47262de-5843-44fc-ab3c-bbad1bf2bded",
            link: "/search?category=electronics&subCategory=smartphone",
          },
          {
            src:"https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/D132995370_Homepage_DesktopHeroTemplate_3000x1200._CB557152260_%5B1%5D.jpg?alt=media&token=06a2d127-e364-40b2-b909-442ba80997f4",
            link: "/fashion",
          },
          {
            src: "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/5300---Kitchen-hero---BAU---update_3000X1200._CB569213170_%5B1%5D.jpg?alt=media&token=6644445f-faa0-4523-8395-031c7b6e6de7",
            link: "/fashion",
          },
          {
            src: "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/D103625178_DesktopTallHero_3000x1200_V3._CB558389732_%5B2%5D.jpg?alt=media&token=38bba878-e963-4b27-9862-0fe42a60caf4",
            link: "/fashion",
          },   
        ]);
      } else {
        setCarouselImages([
          {
            src: "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/D103625178_DesktopTallHero_3000x1200_V3._CB558389732_.jpg?alt=media&token=c8a91150-29b5-481e-b5f5-d4287c6d6ffc",
            link: "/search?category=electronics&subCategory=smartphone",
          },
          {
            src:"https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/PC_Hero_1_3000._CB582457311_%5B1%5D.jpg?alt=media&token=4dd44002-9211-462d-862e-a41024288838",
            link: "/search?category=groceries&subCategory=dairy",
          },
          {
            src:  "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/PC_hero_1_2x_1._CB582889946_.jpg?alt=media&token=a0a18f2b-eef0-4ebb-b819-751e80cfd97c",
            link: "/search?category=homeAndFurniture&subCategory=kitchenware",
          },
          {
            src: "https://firebasestorage.googleapis.com/v0/b/online-shopping-store-d90c0.appspot.com/o/5300---Kitchen-hero---BAU---update_3000X1200._CB569213170_.jpg?alt=media&token=1e34fd70-a881-44f5-9b02-dc48528eef6d",
            link: "/search?category=groceries&subCategory=snacks",
          },
        ]);
      }
    };

    // Initial call to set images based on the current window size
    updateCarouselImages();

    // Add event listener to handle window resize
    window.addEventListener("resize", updateCarouselImages);

    // Clean up the event listener on component unmount
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
                  key={index}
                  src={image.src}
                  alt="..."
                  className="w-full h-full object-cover object-left sm:object-center"
                />
              </Link>
          ))}
        </Carousel>
      </div>
      <div className="p-2 my-5">
        <Category products={shoes} category="fashion" subCategory="shoes" />
      </div>
      <div className="p-2 my-5">
        <Category products={smartPhone} category="electronics" subCategory="smartphone"/>
      </div>
      <div className="p-2 my-5">
        <Category products={watch} category="electronics" subCategory="watch" />
      </div>
      <div className="p-2 my-5">
        <Category products={laptop} category="electronics" subCategory="laptop" />
      </div>
    </div>
  );
}
