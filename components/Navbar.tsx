"use client"
import Link from "next/link";
import Image from "next/image";
import { CustomButton } from ".";
import { useState, useEffect } from "react";
import LoginPopup from "@/pages/LoginPopup";

const Navbar = () => {

  const [showLogin,setShowLogin]=useState(false);
  const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
    // check if user logged in by sessionStorage
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

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
         {username ? (
          <div className="flex items-center gap-4">
            <Link href="/Profile">
            <button
              className="text-black font-medium border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
            >
              Hi, {username}
            </button>
            </Link>
            <Link href="/Cart">
              <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
                <Image
                  src="/cart.svg"
                  alt="Cart"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </button>
            </Link>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
               onClick={() => {
                  sessionStorage.clear(); 
                  window.location.href = "/";
                }}>
                <Image
                  src="/logout.svg"
                  alt="Logout"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                
              </button>
          </div>
        ) : (
           <Link
            href="/LoginPopup"
            className='text-center text-white rounded-full bg-black min-w-[150px] min-h-[30px] flex items-center justify-center hover:bg-cyan-900 focus-within:shadow-lg'
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
    </>
  )
}

export default Navbar