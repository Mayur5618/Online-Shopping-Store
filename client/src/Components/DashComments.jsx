import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function DashComments() {
  const { userData } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteCommentID, setDeleteCommentID] = useState(null);

  useEffect(() => {
    const comments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();
        if (res.ok) {
          if (data.comments.length == 9) {
            setShowMore(true);
          }
          setComments(data.comments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (userData.isAdmin) {
      comments();
    }
  }, [userData._id]);
  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getComments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (data) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!commentId) {
      return;
    }
    try {
      const res = await fetch(`/api/comment/delete/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteCommentID(null);
        setShowModal(false);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error.message);
      setShowModal(false);
    }
  };

  return (
    <div className="md:mx-auto overflow-x-auto table-auto p-3">
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>DATA UPDATED</Table.HeadCell>
          <Table.HeadCell>Product IMAGE</Table.HeadCell>
          <Table.HeadCell>Rating</Table.HeadCell>
          <Table.HeadCell>COMMENT CONTENT</Table.HeadCell>
          <Table.HeadCell>NUMBER OF LIKES</Table.HeadCell>
          <Table.HeadCell>PRODUCTID</Table.HeadCell>
          <Table.HeadCell>USERID</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {comments &&
            comments.map((comment) => (
              <Table.Row
                key={comment._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {new Date(comment.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {
                    <img
                      src={comment.productId.productPhotoUrl}
                      className="w-12 h-12 object-contain rounded-md"
                    />
                  }
                </Table.Cell>
                <Table.Cell>
                  <div className="stars flex p-4 space-x-1 ">
                    {[...Array(5)].map((_, index) => (
                      <span key={index}>
                        {index < comment.star ? (
                          <AiFillStar className="text-yellow-300 text-sm" />
                        ) : (
                          <AiOutlineStar color="gray" className="text-sm" />
                        )}
                      </span>
                    ))}
                  </div>
                </Table.Cell>
                <Table.Cell>{comment.content}</Table.Cell>
                <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                <Table.Cell>{comment.productId._id}</Table.Cell>
                <Table.Cell>{comment.userId}</Table.Cell>
                <Table.Cell>
                  <span
                    className="text-red-600 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true), setDeleteCommentID(comment._id);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {showMore ? (
        <button
          className="w-full self-center text-teal-500 text-sm py-1"
          onClick={handleShowMore}
        >
          Show more
        </button>
      ) : (
        <p className="w-full text-center text-slate-500 text-sm py-1">
          You have not comment more!
        </p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        {/* <Modal.Header /> */}
        <Modal.Body>
          <div className="text-center m-5">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mt-8 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(deleteCommentID)}
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
  );
}
