import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashUsers() {
  const { userData } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const users = async () => {
      try {
        const res = await fetch("/api/user/getUsers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.filterUsersArr);
          if (data.filterUsersArr.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (userData.isAdmin) {
      users();
    }
  }, []);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`);
      const data = await res.json();
      if (data) {
        setUsers((prev) => [...prev, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/user/deleteUser/${deleteUserId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
          setShowModal(false);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== deleteUserId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="md:mx-auto overflow-x-auto table-auto p-3">
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Date createdAt</Table.HeadCell>
          <Table.HeadCell>Image</Table.HeadCell>
          <Table.HeadCell>UserId</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>isAdmin</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {users &&
            users.map((user) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user._id}>
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {
                    <img
                      src={user.photoUrl}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  }
                </Table.Cell>
                <Table.Cell>{user._id}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  {user.isAdmin ? (
                    <FaCheck className="text-green-400 mx-auto" />
                  ) : (
                    <FaTimes className="text-red-500 mx-auto" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <span
                    className="text-red-600 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setDeleteUserId(user._id);
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
          You have not more users!
        </p>
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
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete()}>
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
