import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// Outlet --> it is a component which sets parameter to childern and in <Outlet /> component returns childern ...bus

export default function PrivateDashboard() {
  const {userData}=useSelector((state)=>state.user);
  return userData ? <Outlet/> : <Navigate to='/signin'/>
}
