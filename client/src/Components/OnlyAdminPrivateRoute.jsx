import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom";
import Signin from "../pages/Signin";

export default function OnlyAdminPrivateRoute() {
  const {userData}=useSelector((state)=>state.user);
  return userData && userData.isAdmin?<Outlet /> : <Signin />;
}
