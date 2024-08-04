import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashSide from "../Components/DashSide";
import DashProfile from "../Components/DashProfile";
import DashboardCompass from "../Components/DashboardCompass";
import DashProducts from "../Components/DashProducts";
import DashUsers from "../Components/DashUsers";
import DashComments from "../Components/DashComments";

export default function Dashboard() {
  const location=useLocation();
  const [tab,setTab]=useState('');

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab')
    setTab(tabFromUrl);
  },[location]);

  return (
    <div className='flex flex-col md:flex-row '>
      <div className=" md:min-h-screen ">
        {/* Dashside */}
        <DashSide />
      </div>
      {/* <div> */}

      {/* Profile */}
      {tab==="profile" && <DashProfile />}
      {/* Dashboard */}
      {tab==="dash" && <DashboardCompass />}
      {/* products */}
      {tab==="products" && <DashProducts />}
      {/* Users */}
      {tab==="users" && <DashUsers />}
      {/* Comments */}
      {tab==="comments" && <DashComments />}
      {/* </div> */}

    </div>
  )
}
