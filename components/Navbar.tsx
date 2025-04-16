"use client"
import Link from "next/link";
import Image from "next/image";
import { CustomButton } from ".";
import { useState } from "react";
import LoginPopup from "@/pages/LoginPopup";

const Navbar = () => {

  const [showLogin,setShowLogin]=useState(false);

  return (
    <>
     {showLogin?<LoginPopup setShowLogin={setShowLogin} />: <></>}
    <header>
         <nav className='max-w-[1440px] mx-auto flex justify-between items-center sm:px-5 px-6 py-4 bg-transparent'>
      <Link href='/' className='flex justify-center items-center'>
        <Image
          src='/logo (1).svg'
          alt='logo'
          width={150}
          height={20}
          className='object-contain'
        />
      </Link>
      <Link href='/LoginPopup' className='text-center text-white rounded-full bg-black min-w-[150px] min-h-[30px] hover:bg-cyan-900 focus-within:shadow-lg'>
        Sign In</Link>
      </nav>
    </header>
    </>
  )
}

export default Navbar