import { Button } from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import {app} from '../firebase.js';
import {useNavigate} from 'react-router-dom';
import {SignInSuccess} from '../redux/user/userSlice.js';
import {useDispatch, useSelector} from 'react-redux';
import { cartSetUp } from "../redux/cart/cartSlice";

export default function Google() {
  const auth=getAuth(app);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [animate, setAnimate] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  
    const handleGoogle=async ()=>{
        const provider=new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'});

        try{
            const googleResult=await signInWithPopup(auth,provider);
            const res=await fetch("/api/auth/google",{
                method:"POST",
                headers:{'Content-type':'application/json'},
                body:JSON.stringify({
                    name:googleResult.user.displayName,
                    email:googleResult.user.email,
                    photoURL:googleResult.user.photoURL
                })
            });
            const data=await res.json();

            if(data)
            {
                dispatch(SignInSuccess(data))
                navigate("/");
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }

  return (
    <Button type='button' className='w-full mt-5' gradientDuoTone='pinkToOrange' outline onClick={handleGoogle}>
        <AiFillGoogleCircle className='w-6 h-6 mx-2' />
            Continue with Google        
    </Button>
  )
}
