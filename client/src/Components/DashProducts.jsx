import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProducts() {
  const { userData } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [noMoreMesj, setNoMoreMesj] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  useEffect(() => {
    const products = async () => {
      try {
        const res = await fetch(`/api/product/getProducts`);
        const data = await res.json();
        if (!data.products) {
          setNoMoreMesj(true);
        }
        if (res.ok) {
          setProducts(data.products);
          if (data.products.length === 9) {
            setShowMore(true);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (userData.isAdmin) {
      products();
    }
  }, [userData._id]);

  const handleShowMore = async () => {
    const startIndex = products.length;
    try {
      const res = await fetch(
        `/api/product/getProducts?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (data) {
        setProducts((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) {
      return;
    }
    try {
      const res = await fetch(`/api/product/delete?productId=${deleteProductId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShowModal(false);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== deleteProductId)
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
          <Table.HeadCell>Date updated</Table.HeadCell>
          <Table.HeadCell>Product image</Table.HeadCell>
          <Table.HeadCell>Product Name</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
          <Table.HeadCell>Edit</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {products &&
            products.map((product) => (
              <Table.Row
                key={product._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {new Date(product.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {
                    <img
                      src={product.productPhotoUrl}
                      className="w-12 h-12 rounded-md object-contain"
                    />
                  }
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/product/${product.slug}`}
                    className="hover:underline"
                  >
                    {product.title}
                  </Link>
                </Table.Cell>

                <Table.Cell>{product.price}</Table.Cell>

                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>
                  <span
                    className="text-red-600 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setDeleteProductId(product._id);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/updateProduct/${product._id}`}>
                    <span className="text-indigo-600 hover:underline cursor-pointer">
                      Edit
                    </span>
                  </Link>
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
          No more products
        </p>
      )}
      {noMoreMesj && (
        <p className="w-full text-center text-slate-500 text-sm py-1">
          No Products
        </p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
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
