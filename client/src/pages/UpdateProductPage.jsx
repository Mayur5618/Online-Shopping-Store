import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const categories = {
  electronics: ["Laptop", "Camera", "Smartphone", "Watch", "Television"],
  fashion: ["Shirts", "Shoes", "Heels", "Jewelry", "Sneakers"],
  groceries: ["Fruits and Vegetables", "Dairy", "Beverages", "Snacks", "Health"],
  toyAndGames: ["Video Games", "Puzzles", "Action Figures", "Dolls and Accessories", "Educational Toys"],
  homeAndFurniture: ["Living Room Furniture", "Bedroom Furniture", "Office Furniture", "Lighting", "Kitchenware"],
};

function useAlert() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (alertVisible) {
      const timer = setTimeout(() => {
        setAlertVisible(false);
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [alertVisible]);

  const showAlert = (message, type) => {
    if (type === "success") {
      setSuccessMessage(message);
    } else {
      setErrorMessage(message);
    }
    setAlertVisible(true);
  };

  return { alertVisible, successMessage, errorMessage, showAlert };
}

export default function UpdateProductPage() {
  const [formData, setFormData] = useState({});
  const [newFormData, setNewFormData] = useState({});
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const { alertVisible, successMessage, errorMessage, showAlert } = useAlert();
  const { productId } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/getProducts?productId=${productId}`);
        const data = await res.json();
        if (res.ok) {
          setFormData(data.products[0]);
        } else {
          console.log("Fetching product error..");
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        setProgress(null);
        setFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      } else {
        setFile(null);
        showAlert("Image size must be less than 2MB","failure");
      }
    }
  };

  const handleChange = (e) => {
    setNewFormData({ ...newFormData, [e.target.id]: e.target.value });
  };

  const uploadImage = () => {
    if (!file) {
      showAlert("No changes made", "error");
      return;
    }
    const storage = getStorage(app);
    const uniqueNameFile = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, `/products/${uniqueNameFile}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress.toFixed(0));
      },
      (error) => {
        showAlert("File must be less than 2MB", "error");
        setProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          showAlert("Image uploaded..", "success");
          setNewFormData((prev) => ({ ...prev, productPhotoUrl: downloadUrl }));
          setFormData((prev) => ({ ...prev, productPhotoUrl: downloadUrl }));
          setProgress(null);
        });
      }
    );
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (Object.keys(newFormData).length === 0) {
      showAlert("No change has occurred...", "error");
      return;
    }
    try {
      const res = await fetch(`/api/product/updateProduct?productId=${productId}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newFormData),
      });

      const data = await res.json();
      if (!res.ok) {
        showAlert(data.message, "error");
        return;
      }
      if (res.ok) {
        navigate(`/product/${data.slug}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="p-3 max-w-4xl mx-auto min-h-screen static">
        <div className="p-3 max-w-3xl mx-auto">
          <h1 className="text-3xl font-medium underline underline-offset-4 text-center">
            Update Product
          </h1>
          <form className="mt-5 flex flex-col gap-3" onSubmit={handleForm}>
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
              <TextInput
                type="text"
                placeholder="Title"
                className="flex-1"
                id="title"
                onChange={handleChange}
                value={newFormData.title ?? formData.title ?? ""}
              />
              <Select
                id="category"
                onChange={handleChange}
                value={newFormData.category ?? formData.category ?? ""}
              >
                <option value="">Select a category</option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex justify-center items-center gap-2 border-dashed p-2 border-2 border-cyan-500">
              <FileInput
                type="file"
                accept="image/*"
                className="flex-1"
                onChange={handleImage}
              />
              {progress && progress < 100 ? (
                <Button
                  className="border-2 p-1 bg-gradient-puple-blue"
                  gradientDuoTone="purpleToBlue"
                  outline
                >
                  <CircularProgressbar
                    size="md"
                    className="w-14"
                    value={progress}
                    text={`${progress}%`}
                    styles={{
                      root: { color: "black" },
                      trail: { stroke: "white" },
                      text: { fill: "white" },
                      path: { stroke: "green" },
                    }}
                  />
                </Button>
              ) : (
                <Button gradientDuoTone="purpleToBlue" outline onClick={uploadImage}>
                  Upload image
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <TextInput
                type="text"
                placeholder="Price"
                className="flex-1"
                id="price"
                onChange={handleChange}
                value={newFormData.price ?? formData.price ?? ""}
              />
              {formData.category && categories[formData.category] && (
                <Select
                  id="subCategory"
                  onChange={handleChange}
                  value={newFormData.subCategory ?? formData.subCategory ?? ""}
                >
                  <option value="">Select a sub-category</option>
                  {categories[formData.category].map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </Select>
              )}
            </div>
            {imageFileUrl ? (
              <img
                src={imageFileUrl}
                className="w-full h-52 object-scale-down"
                alt="Product"
              />
            ):( <img
              src={formData && formData.productPhotoUrl}
              className="w-full h-52 object-scale-down"
              alt="Product"
            />)}
            {alertVisible && errorMessage && (
              <Alert color="failure" className="mt-3">
                {errorMessage}
              </Alert>
            )}
            <ReactQuill
              ref={quillRef}
              theme="snow"
              placeholder="Write something..."
              className="h-72 mb-12"
              onChange={(value) => setNewFormData({ ...newFormData, content: value })}
              value={newFormData.content ?? formData.content ?? ""}
            />
            <Button type="submit" outline gradientDuoTone="purpleToPink">
              Update
            </Button>
            {alertVisible && successMessage && (
              <Alert color="success" className="mt-3">
                {successMessage}
              </Alert>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
