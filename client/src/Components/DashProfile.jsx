import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  UpdateUserStart,
  UpdateUserSuccess,
  UpdateUserFailure,
  SignInSetUp,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { userData, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(userData.photoUrl);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [showModal,setShowModal]=useState(false);
  const [tokenExist, setTokenExist] = useState(null);
  const [modalAction, setModalAction] = useState(null); 

  useEffect(() => {
    const checkToken = async () => {
      const res = await fetch("/api/auth/cookie");
      const data = await res.json();
      if (!data.token) {
        setTokenExist(data.token);
      }
      if (data.token) {
        setTokenExist(data.token);
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (errorMessage || successMessage) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        setAlertVisible(false);
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [successMessage, errorMessage]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
        setImageFileUploadError(null); // Clear any previous error
      } else {
        setImageFile(null);
        setImageFileUploadError("File size must be less than 2MB");
      }
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImg();
    }
  }, [imageFile]);

  const uploadImg = () => {
    const storage = getStorage(app);
    // here, we create its new object for image uploading
    const filename = new Date().getTime() + imageFile.name;
    // here, we create a unique name for each image
    const storageRef = ref(storage, filename);
    // here, we create reference(pointer) so that we can have the memory address of img so that we can chage it directly,if we dont use reference that if we change image than it display img but not chnage in firebase,so we have its refererence so that we can upload it,download,update,delete it ddirectly
    // storageRef is like a address that helps us find and manage our image file in firebase storage
    // it creates a link <a>1719395991705WIN_20240218_16_59_38_Pro.jpg</a> that specify loaction of image 
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    // here, we use uploadBytesResumable because whenever we send req,res than data is transffered in bytes(smallest part of data ,in packets(chunks)) becuase img size is in MB so when we post img than it takes long time so we send our img in bytes packets and each bytes send in correct order for this firebase works here,
    // 1 byte=8 bits
    // 1 bit=0 or 1 (0,1)
    // 2 bit=00,01,10,11 ....
    // there is another method also named uploadBytes ,it is for small size file ,uploadBytesResumable is helpful to know that how much bytes are transffered out of total bytes .it provides two attribute named bytesTransferred,totalBytes to know progress and it also does that if our internet is slow than img resume and when internet speed becomes good than does not download from starting ,it starts form resume(jyathi baaki che,this feacture is not in uploadBytes ,it download from starting..)

    // 'state_changed'-->event name
    // snapshot -->is a simple obj that represent current state
    // toFixed -->is method to remove 1.0909 -->1
    // getDownloadURL-->to get publicly accessible URL of image and it returns promise

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("File size must be less than 2MB");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUploadProgress(null);
          setFormData({ ...formData, photoUrl: downloadURL });
          setSuccessMessage("Image uploaded successfully...");
          // filePickerRef.current.value = null;
        });
      }
    );
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      // console.log(Object.keys(formData)); //formdata is a object so to check that it is empty or not ,we want to use Global Object(O capital) function and its sub function named keys(object_name) so its returns number of keys./***/if we store data in array than we can directly use of if(formdata.length===0),if userdata is a string if(formdata.length===" "),if userdata is null or undifine if(!userdata) or we can use !formdata.email
      setErrorMessage("No changes made");
      return;
    }

    if(formData.password.toString().length===0)
    {
      setErrorMessage("No changes made");
      return;
    }

    dispatch(UpdateUserStart());
    try {
      const res = await fetch(`/api/user/updateUser/${userData._id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        // Handle error responses
        setErrorMessage(data.message || "An error occurred");
        dispatch(UpdateUserFailure(data));
      } else {
        dispatch(UpdateUserSuccess(data));
        setSuccessMessage("Changes saved successfully...");
      }
    } catch (error) {
      dispatch(UpdateUserFailure(error));
    }
  };
  console.log(formData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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

  const handleDeleteAcc = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userData._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShowModal(false);
        navigate("/signup");
        dispatch(SignInSetUp());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const openModalForAction = (action) => {
    setModalAction(action);
    setShowModal(true);
  };
  return (
    <div className="max-w-lg mx-auto w-full p-3">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleForm} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImage}
          ref={filePickerRef}
        />
        <div className="relative h-32 w-32 self-center rounded-full cursor-pointer shadow-md">
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: "0",
                  left: "0",
                },
                // root: Defines how the entire progress bar component is positioned and sized relative to its parent container
                path: {
                  stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                },
                // path: This style object applies specifically to the circular path that represents the progress of the bar. Defines the visual appearance of the circular path itself, particularly the stroke color
              }}
            />
          )}
          <img
            src={imageFileUrl}
            className={`border-8 object-cover w-full h-full rounded-full ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
            onClick={() => filePickerRef.current.click()}
          />
        </div>
        {alertVisible && imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          placeholder="Username"
          defaultValue={userData.username}
          id="username"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          placeholder="Email"
          defaultValue={userData.email}
          id="email"
          onChange={handleChange}
        />
        <TextInput
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
        />

        <Button
          disabled={loading}
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span>Updating...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
        {tokenExist && userData && userData.isAdmin ? (
          <Link to="/create-product">
            <Button type="button" className="w-full" gradientDuoTone="purpleToPink" outline>
              Create Product
            </Button>
          </Link>
        ) : (
          ""
        )}
      </form>
      <div className="flex justify-between mt-3 text-red-500">
        <span className="cursor-pointer" onClick={() =>openModalForAction('delete')}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={() => openModalForAction('signout')}>
          Sign out
        </span>
      </div>
      {alertVisible && successMessage && (
        <Alert color="success" className="mt-5">
          {successMessage}
        </Alert>
      )}
      {alertVisible && errorMessage && (
        <Alert color="failure" className="mt-5">
          {errorMessage}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-4xl mx-auto text-red-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {modalAction === 'delete'
                ? 'Are you sure you want to delete your account?'
                : 'Are you sure you want to sign out?'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {modalAction === 'delete'
                ? 'This action cannot be undone.'
                : 'You will be redirected to the sign-in page.'}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                color="failure"
                onClick={modalAction === 'delete' ? handleDeleteAcc : handleSignout}
              >
                {modalAction === 'delete' ? 'Yes, Delete' : 'Yes, Sign Out'}
              </Button>
              <Button
                color="gray"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
