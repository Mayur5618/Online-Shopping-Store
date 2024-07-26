import { Alert, Button, Textarea, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function CommentSection({ productInfo }) {
  const { userData } = useSelector((state) => state.user);
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");
  const [commentMessage, setCommentMessage] = useState(null);
  const [unknown, setUnknown] = useState(false);
  const [rating, setRating] = useState(0);
  const [message,setMessage]=useState(null);
  const [alertVisible,setAlertVisible]=useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2500);

      return () => clearInterval(timer);
    }
  }, [message]);

  const handleClick = (index) => {
    setRating(index + 1); 
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments/${productInfo._id}`);
        const data = await res.json();
        if (data) {
          if (typeof data === "string") {
            setCommentMessage(data);
          }
          if (typeof data === "object") {
            setComments(data);
            setCommentMessage(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (productInfo) {
      fetchComments();
    }
  }, [productInfo]);

  
  useEffect(() => {
    if (unknown) {
      setUnknown(true);
      const timer = setInterval(() => {
        setUnknown(false);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [unknown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      setUnknown(true);
      setComment("");
      return;
    }
    if(!comment && rating==0)
    {
      setMessage("Plaese fillout review..");
      return;
    }
    if (!comment) {
      setMessage("please write something..");
      return;
    }
    if(rating===0){
      setMessage("please provide stars..");
      return;
    }
    try {
      const res = await fetch(`/api/comment/create/${productInfo._id}`, {
        method: "Post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ content: comment,star:rating}),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("comment is not submitted due to server error..");
        return;
      }
      setComments((prev) => (Array.isArray(prev) ? [data, ...prev] : [data]));
      setComment("");
      setRating(0);
    } catch (error) {
      console.log(error);
    }
  };

  const likeHandle = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/addLike/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/delete/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (commentId, updatdeComment) => {
    setComments((prev) =>
      prev.map((comObj) =>
        comObj._id === commentId
          ? { ...comObj, content: updatdeComment.content }
          : comObj
      )
    );
  };

  return (
    <>
      {userData && userData.username && (
        <div className="ml-3 md:ml-0 mb-1">
          <div className="flex gap-2">
            <p>@{userData.username}</p>
            <img
              src={userData.photoUrl}
              alt={userData.username}
              className="w-6 h-6 rounded-xl "
            />
          </div>
        </div>
      )}
      <form
        className="mt-4 mb-3 p-6 rounded-md border border-cyan-500 m-3 md:m-0"
        onSubmit={handleSubmit}
      >
        <div>
          <div className="stars flex space-x-2 p-5 justify-center">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => handleClick(index)}
                  style={{ cursor: "pointer", fontSize: "24px" }} // Adjust the size of the stars
                >
                  {index < rating ? (
                    <AiFillStar className="text-yellow-300 text-4xl" />
                  ) : (
                    <AiOutlineStar color="gray" className="text-4xl"/>
                  )}
                </span>
              ))}
            </div>
          <Textarea
            cols="10"
            rows="3"
            className="mt-5"
            placeholder="Type review..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <Button
            type="submit"
            outline
            className="mt-5"
            gradientDuoTone={"purpleToPink"}
          >
            Submit
          </Button>
        </div>
      </form>
      {message && <Alert color="failure" className="mt-3">{message}</Alert>}
      {unknown && <Alert color="failure" className="mt-3">Please sign-in</Alert>}
      {comments &&
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            likeHandle={likeHandle}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            rating
          />
        ))}
      {!comments && commentMessage && (
        <h2 className="mt-4 mb-3 text-center text-gray-400">
          {commentMessage}
        </h2>
      )}
    </>
  );
}
