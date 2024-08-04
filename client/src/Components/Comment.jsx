import { Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useDispatch } from "react-redux";

export default function Comment({
  comment,
  likeHandle,
  handleEdit,
  handleDelete,
}) {
  const [userData, setUserData] = useState(null);
  const { userData: currentUser } = useSelector((state) => state.user);
  const [commentContent, setCommentContent] = useState(comment.content);
  const [showInput, setShowInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(comment.star);
  const dispatch = useDispatch();

  const handleClick = (index) => {
    setRating(index + 1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/getUser/${comment.userId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log("Failed to fetch user data.");
          return;
        }
        setUserData(data);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (comment.userId) {
      fetchUser();
    }
  }, [comment.userId]);

  const editComment = async (commentId) => {
    if (!commentContent) {
      return;
    }
    try {
      const res = await fetch(`/api/comment/edit/${commentId}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ content: commentContent, star: rating }),
      });
      if (res.ok) {
        const data = await res.json();
        handleEdit(comment._id, data);
        setShowInput(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {userData && (
        <div className="flex items-center gap-3 mt-4 shadow-md p-1 md:p-2 m-2">
          <div className="mt-[-15px]">
            <img
              src={userData.photoUrl}
              className="w-10 h-10 object-cover rounded-full"
              alt={userData.username}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center flex-1 mt-[-3px]  gap-1">
              <h5 className="font-medium text-xs">@{userData.username}</h5>
              <p className="text-[10px] mt-[2px] text-gray-400">
                {getRelativeTime(new Date(comment.createdAt))}
              </p>
            </div>
            {showInput ? (
              <div>
                <div className="stars flex p-4 space-x-2 ">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      onClick={() => handleClick(index)}
                      style={{ cursor: "pointer", fontSize: "10px" }}
                    >
                      {index < rating ? (
                        <AiFillStar className="text-yellow-300 text-xl" />
                      ) : (
                        <AiOutlineStar color="gray" className="text-xl" />
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <TextInput
                    className="flex-1"
                    onChange={(e) => setCommentContent(e.target.value)}
                    value={commentContent}
                  />
                  <Button
                    gradientDuoTone={"purpleToBlue"}
                    onClick={() => {
                      editComment(comment._id);
                    }}
                    outline
                  >
                    Save
                  </Button>
                  <Button
                    gradientDuoTone={"purpleToBlue"}
                    onClick={() => setShowInput(false)}
                    outline
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col mt-1">
                <div className="stars flex space-x-2 ">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      style={{ cursor: "pointer", fontSize: "10px" }}
                    >
                      {index < rating ? (
                        <AiFillStar className="text-yellow-300 text-base" />
                      ) : (
                        <AiOutlineStar color="gray" className="text-base" />
                      )}
                    </span>
                  ))}
                </div>
                <p className="text-[13.5px]">{commentContent}</p>
              </div>
            )}
            <div className="flex items-center gap-1 text-[14px]">
              <FaThumbsUp
                onClick={() => likeHandle(comment._id)}
                className={`hover:text-green-400  ${
                  currentUser && comment.likes.includes(currentUser._id)
                    ? "text-green-500"
                    : ""
                }`}
              />
              <h3>
                {comment.numberOfLikes === 0 ? "" : comment.numberOfLikes}
              </h3>
              {currentUser && comment.userId === currentUser._id && (
                <div className="ml-1 flex items-center gap-1 text-[11px] text-gray-500">
                  <p
                    className="hover:text-gray-300 cursor-pointer"
                    onClick={() => setShowInput(true)}
                  >
                    Edit
                  </p>
                  <p
                    className="hover:text-gray-300 cursor-pointer"
                    onClick={() => setShowModal(true)}
                  >
                    Delete
                  </p>
                </div>
              )}
            </div>
          </div>
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this comment?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    onClick={() => handleDelete(comment._id)}
                  >
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
}

function getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (years > 0) {
    return rtf.format(-years, "year");
  }
  if (months > 0) {
    return rtf.format(-months, "month");
  }
  if (days > 0) {
    return rtf.format(-days, "day");
  }
  if (hours > 0) {
    return rtf.format(-hours, "hour");
  }
  if (minutes > 0) {
    return rtf.format(-minutes, "minute");
  }
  return rtf.format(-seconds, "second");
}
