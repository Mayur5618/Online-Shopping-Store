import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiChartPie, HiUser, HiDocumentText } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function DashSide() {
  const [tab, setTab] = useState("");
  const location = useLocation();
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [tokenExist, setTokenExist] = useState(null);

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
    const urlParams = new URLSearchParams(location.search);
    const paramResult = urlParams.get("tab");
    setTab(paramResult);
  }, [location]);

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

  return (
      <Sidebar className="w-full md:w-56 " >
        <Sidebar.Items >
          <Sidebar.ItemGroup > 
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={userData.isAdmin ? "Admin" : "user"}
              labelColor="dark"
              as={Link}
              to={"/dashboard?tab=profile"}
            >
              Profile
            </Sidebar.Item>
            {tokenExist && userData && userData.isAdmin && (
              <>
                <Sidebar.Item
                  active={tab === "dash"}
                  icon={HiChartPie}
                  labelColor="dark"
                  as="div"
                >
                  <Link to={"/dashboard?tab=dash"}>Dashboard</Link>
                </Sidebar.Item>
                <Sidebar.Item
                  active={tab === "products"}
                  icon={HiDocumentText}
                  as="div"
                >
                  <Link to={"/dashboard?tab=products"}>Products</Link>
                </Sidebar.Item>
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiDocumentText}
                  as="div"
                >
                  <Link to={"/dashboard?tab=comments"}>Reviews</Link>
                </Sidebar.Item>
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiDocumentText}
                  as="div"
                >
                  <Link to={"/dashboard?tab=users"}>Users</Link>
                </Sidebar.Item>
              </>
            )}
            <Sidebar.Item
              className="cursor-pointer"
              onClick={() => handleSignout()}
            >
              Sign out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
  );
}
