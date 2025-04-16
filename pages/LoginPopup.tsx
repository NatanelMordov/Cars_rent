"use client"
import React, { useState } from 'react'
import "../app/globals.css";
import '../public/close.svg'
import Link from 'next/link';


const LoginPopup = ({setShowLogin}) => {

    const[currState,setCurrState]=useState("Sign Up");
  
  return (

    <div className='absolute z-1 w-full h-full bg-login bg-cover grid cursor-pointer place-content-center '>
        <form className=' flex flex-col  gap-6 p-[25px] rounded-[8px] text-[14px] max-w-96 max-h-[400px] backdrop-blur-3xl  '>
            <div className='flex justify-between items-center text-[black]'>
                <h2 className='font-bold'>{currState}</h2>
              <Link href='/'><img src='./close.svg ' /></Link> 
            </div>
            <div className='flex flex-col gap-[20px]'>
              {currState==="Login"?<></>:<input className='outline-[none] border-[1px] border-[solid] border-[#c9c9c9] p-[10px] rounded-[4px]' type='text' placeholder='Your Name' required />} 
              <input className='outline-[none] border-[1px] border-[solid] border-[#c9c9c9] p-[10px] rounded-[4px]' type='email' placeholder='Your Email' required /> 
              <input className='outline-[none] border-[1px] border-[solid] border-[#c9c9c9] p-[10px] rounded-[4px]' type='password' placeholder='Password' required /> 
            </div>
            <button className='border-[none] p-[10px] rounded-[4px] text-[whitesmoke] bg-black text-[15px] cursor-pointer hover:bg-[rgb(36,53,85)]'
            >{currState==="Sign Up"?"Create account":"Login"}</button>
          <div className='flex gap-[8px] -mt-[15px]'>
              <input className='mt-[5px]' type='checkbox' required />
              <p className='font-semibold'>I agree to the terms of use & privacy policy</p>
          </div>
          {currState==="Login"
          ?<p className='font-semibold'>Create a new account?<span className='text-blue-950 cursor-pointer'  onClick={()=>setCurrState("Sign Up")}> Click Here</span></p>
          :<p className='font-semibold'>Allready have an account?<span className='text-blue-950 cursor-pointer' onClick={()=>setCurrState("Login")}> Login Here</span></p>
          }
          
        </form>
        </div>
   )
}

export default LoginPopup