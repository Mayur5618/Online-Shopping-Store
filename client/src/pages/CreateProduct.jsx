import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    subCategory:""
  });
  const [imageFile, setImageFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage || errorMessage) {
      setAlertVisible(true);
      const timer = setInterval(() => {
        setAlertVisible(false);
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const uploadImage = () => {
    const storage = getStorage(app);
    const uniqueNameFile = new Date().getTime() + "-" + imageFile.name;
    const storageRef = ref(storage, `/products/${uniqueNameFile}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress.toFixed(0));
      },
      (error) => {
        setErrorMessage("File must be less than 2MB");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setSuccessMessage("Image uploaded..");
          setFormData({ ...formData, productPhotoUrl: downloadUrl });
        });
      }
    );
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        setProgress(null);
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      } else {
        setImageFile(null);
        setErrorMessage("Image size must be less than 2MB");
      }
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setErrorMessage("No changes made");
      return;
    }
    try {
      const res = await fetch("/api/product/create", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message);
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
        <div className=" p-3 max-w-3xl mx-auto">
          <h1 className="text-3xl font-medium underline underline-offset-4 text-center">
            Create Product
          </h1>
          <form className="mt-5 flex flex-col gap-3" onSubmit={handleForm}>
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
              <TextInput
                type="text"
                placeholder="Product Name"
                className="flex-1"
                id="title"
                onChange={handleChange}
              />
              <Select id="category" onChange={handleChange}>
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="homeAndFurniture">Home & Furniture</option>
                <option value="groceries">Groceries</option>
                <option value="toyAndGames">Toy and Games</option>
              </Select>
            </div>
            <div>
              <div className="flex justify-center items-center gap-2 border-dashed p-2 border-2 border-cyan-500">
                <FileInput
                  type="file"
                  accept="image/*"
                  className="flex-1"
                  onChange={handleImage}
                />

                {progress && progress < 100 ? (
                  <>
                    <Button
                      className="bo border-2 p-1 bg-gradient-puple-blue"
                      gradientDuoTone="purpleToBlue"
                      outline
                    >
                      <CircularProgressbar
                        size="md"
                        className="w-14"
                        value={progress}
                        text={`${progress}%`}
                        styles={{
                          root: {
                            color: "black",
                          },
                          trail: { stroke: "white" },
                          text: { fill: "white" },
                          path: {
                            stroke: "green",
                          },
                        }}
                      />
                    </Button>
                  </>
                ) : (
                  <Button
                    gradientDuoTone="purpleToBlue"
                    outline
                    onClick={() => uploadImage()}
                  >
                    Upload image
                  </Button>
                )}
              </div>
              {imageFileUrl && (
                <img
                  src={imageFileUrl}
                  className="w-full h-52 object-scale-down "
                />
              )}
            </div>
            <div className="flex gap-2">
              <TextInput
                type="text"
                placeholder="Price"
                className="flex-1"
                id="price"
                onChange={handleChange}
              />
              {formData.category == "electronics" && (
                <Select id="subCategory" onChange={handleChange}>
                  <option value="">Select a sub-category</option>
                  <option value="laptop">Laptop</option>
                  <option value="camera">Camera</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="watch">Watch</option>
                  <option value="television">Television</option>
                </Select>
              )}
              {formData.category == "fashion" && (
                <Select id="subCategory" onChange={handleChange}>
                  <option value="">Select a sub-category</option>
                  <option value="shirts">Shirts</option>
                  <option value="shoes">shoes</option>
                  <option value="Heels">Heels</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="sneakers">Sneakers</option>
                </Select>
              )}
              {formData.category == "groceries" && (
                <Select id="subCategory" onChange={handleChange}>
                  <option value="">Select a sub-category</option>
                  <option value="fruitsAndVegetables">Fruits and Vegetables</option>
                  <option value="dairy">Dairy</option>
                  <option value="beverages">Beverages</option>
                  <option value="snacks">Snacks</option>
                  <option value="television">Television</option>
                </Select>
              )}
              {formData.category == "toyAndGames" && (
                <Select id="subCategory" onChange={handleChange}>
                  <option value="">Select a sub-category</option>
                  <option value="videoGames">Video Games</option>
                  <option value="puzzles">Puzzles</option>
                  <option value="actionFigures">Action Figures</option>
                  <option value="dollsAndAccessories">Dolls and Accessories</option>
                  <option value="educationalToys">Educational Toys</option>
                </Select>
              )}
              {formData.category == "homeAndFurniture" && (
                <Select id="subCategory" onChange={handleChange}>
                  <option value="">Select a sub-category</option>
                  <option value="livingRoomFurniture">Living Room Furniture</option>
                  <option value="bedroomFurniture">Bedroom Furniture</option>
                  <option value="officeFurniture">Office Furniture</option>
                  <option value="lighting">Lighting</option>
                  <option value="kitchenware">Kitchenware</option>
                </Select>
              )}
              
            </div>
            <ReactQuill
              theme="snow"
              placeholder="Write something..."
              className="h-72 mb-12"
              onChange={(value) => setFormData({ ...formData, content: value })}
            ></ReactQuill>
            <Button type="submit" outline gradientDuoTone="purpleToPink">
              Publish
            </Button>
            {errorMessage && (
              <Alert color="failure" className="mt-3">
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
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
