"use client"
import React, { useState } from 'react';
import "../app/globals.css";
import '../public/close.svg';
import Link from 'next/link';
import router from 'next/router';

const LoginPopup = ({}) => {
  const [currState, setCurrState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // only for sing up
  const [errorMessage, setErrorMessage] = useState('');
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  ////
    const showMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  // Function to send a request to Login
  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json(); // get username and is_admin

      sessionStorage.setItem('username', data.username);
      sessionStorage.setItem('isAdmin', JSON.stringify(data.isAdmin));

      if (data.isAdmin) {
        router.push('/Admin'); // move to admin page
      } else {
        router.push('/'); // back tho the main page
      }
        // Redirect or handle success here
      } else {
        const errorText = await response.text();
        alert('Login failed: ' + response.statusText);
      }
    } catch (err) {
      console.error('Error during login:', err);
      showMessage("An error occurred during login");
    }
  };



  // Function to send a request to -sign up
  const handleSignUp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

      if (!email || !password || !name) {
      showMessage("Please fill in all fields!");
      return;
  }

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address");
    return;
  }

    const signUpData = { email, password, name };

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      if (response.ok) {
        showMessage("Welcome! Your account was created successfully and you received 150 welcome points 🎉");
        setCurrState("Login"); // After sign up -> move to log in 
      } else {
        const text = await response.text();
        showMessage("Sign-up failed: " + text);
      }
    } catch (err) {
      console.error('Error during sign up:', err);
      showMessage("An error occurred during sign-up");
    }
  };

  return (

    <div className='absolute z-1 w-full h-full bg-login bg-cover grid cursor-pointer place-content-center '>
          <form onSubmit={handleLogin} className='flex flex-col gap-6 p-[25px] rounded-[8px] text-[14px] max-w-96 max-h-[400px] backdrop-blur-3xl'>
            <div className='flex justify-between items-center text-[black]'>
              <h2 className='font-bold'>{currState}</h2>
              <Link href='/'><img src='./close.svg ' /></Link>
            </div>
            <div className='flex flex-col gap-[20px]'>
              {currState === "Login" ? null : (
                <input
                  className='outline-[none] border-[1px] border-[solid] border-[#c9c9c9] p-[10px] rounded-[4px]'
                  type='text'
                  placeholder='Your Name'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <input
                className='outline-[none] border-[1px] border-[solid] border-[#c9c9c9] p-[10px] rounded-[4px]'
                type='email'
                placeholder='Your Email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className='outline-[none] border-[1px] border-[solid] border-[#c9c9c9] p-[10px] rounded-[4px]'
                type='password'
                placeholder='Password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type='submit'
              className='border-[none] p-[10px] rounded-[4px] text-[whitesmoke] bg-black text-[15px] cursor-pointer hover:bg-[rgb(36,53,85)]'
              onClick={currState === "Sign Up" ? handleSignUp : handleLogin}
            >
              {currState === "Sign Up" ? "Create account" : "Login"}
            </button>
            <div className='flex gap-[8px] -mt-[15px]'>
              <input className='mt-[5px]' type='checkbox' required />
              <p className='font-semibold'>I agree to the terms of use & privacy policy</p>
            </div>
            {currState === "Login" ? (
              <p className='font-semibold'>Create a new account?
                <span className='text-blue-950 cursor-pointer' onClick={() => setCurrState("Sign Up")}> Click Here</span>
              </p>
            ) : (
              <p className='font-semibold'>Already have an account?
                <span className='text-blue-950 cursor-pointer' onClick={() => setCurrState("Login")}> Login Here</span>
              </p>
            )}
          </form>
        {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <p className="mb-4 text-gray-800">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
        </div>
       )
}

export default LoginPopup;
