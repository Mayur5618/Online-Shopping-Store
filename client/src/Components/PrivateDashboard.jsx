import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateDashboard() {
  const {userData}=useSelector((state)=>state.user);
  return userData ? <Outlet/> : <Navigate to='/signin'/>
}
