"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import "../app/globals.css";

interface OrderItem {
  cartId: number;
  username: string;
  car_id: number;
  start_date: string;
  end_date: string;
  totalprice: number;
  manufacturers: string;
  model: string;
  yearsOfProduction: number;
  fuels: string;
  gear: string;
  location: string;
  status: string;
}

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState({ username: "", email: "", is_admin: false, points: 0,});
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersError, setOrdersError] = useState("");

  const date_now = new Date();

  const futureOrders = orders.filter(order => new Date(order.end_date) >= date_now && order.status === 'completed');
  const pastOrders = orders.filter(order => new Date(order.end_date) < date_now);
  const pendingOrders = orders.filter(order => order.status === 'pending');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:5000/profile?username=${username}`)
        .then((res) => setProfile(res.data))
        .catch(() => setMessage("Failed to load profile"));
    }
  }, [username]);

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:5000/profile", {
        username: profile.username,
        email: profile.email,
        newPassword: newPassword || undefined,
      });
      setMessage("Profile updated successfully");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.response?.data || "Error updating profile");
    }
  };

  useEffect(() => {
  if (username) {
    axios
      .get(`http://localhost:5000/full-cart/${username}`)
      .then((res) => setOrders(res.data))
      .catch(() => setOrdersError("Failed to load your orders"));
  }
}, [username]);


  if (!username) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="flex justify-center p-6 shadow-md">
        <Link href="/" className="hover:scale-105 transition">
          <Image src="/logo (1).svg" alt="Logo" width={160} height={40} />
        </Link>
      </header>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 py-12 font-sans text-left">
        
        {/* Left Column: User Info */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-10 text-left">Hi {profile.username}</h1>

        <div className="text-center text-gray-600 text-left mb-6">
            User Permission:{" "}
            <span className={`ml-2 font-semibold ${profile.is_admin ? "text-green-600" : "text-blue-600"}`}>
                {profile.is_admin ? "Admin" : "Regular User"}
            </span>
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; User Points:{" "}
            <span className={`ml-2 font-semibold ${profile.is_admin ? "text-green-600" : "text-blue-600"}`}>
                {profile.points}
            </span>
        </div>

        <div className="mb-6">
          <label className="block text-base font-medium text-gray-700 mb-2 text-left">Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-900 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>

          <div className="mb-8">
            <label className="block text-base font-medium text-gray-700 mb-2 text-left">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-900 text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleUpdate}
              className="bg-black text-white text-base px-6 py-2 rounded-full hover:bg-cyan-900 transition duration-200"
            >
              Save Changes
            </button>

            <Link href="/">
              <button className="bg-white border border-gray-400 text-black text-base px-6 py-2 rounded-full hover:bg-gray-100 transition duration-200">
                Back to Home
              </button>
            </Link>
          </div>

          {message && (
            <div className="mt-6 text-center text-blue-600 font-medium text-base">
              {message}
            </div>
          )}
        </div>

        {/* Right Column: Orders */}
        <div dir="ltr">
         <section className="mb-10">
            <h2 className="text-3xl font-bold text-yellow-500 mb-6 border-b-2 border-yellow-400 pb-2 tracking-wide">
              🕓 Pending Orders (Unpaid)
            </h2>
            {pendingOrders.length === 0 ? (
              <p className="text-gray-600">No pending orders.</p>
            ) : (
              pendingOrders.map(order => (
                <div key={order.cartId} className="border border-yellow-300 bg-yellow-50 p-4 rounded-lg mb-4">
                  <p><strong>Car:</strong> {order.manufacturers} - {order.model}</p>
                  <p><strong>From:</strong> {order.start_date.split("T")[0]} <strong>&nbsp;&nbsp;&nbsp; To: &nbsp;&nbsp;&nbsp;</strong> {order.end_date.split("T")[0]}</p>
                  <p><strong>Location:</strong> {order.location}</p>
                  <p><strong>Fuel:</strong> {order.fuels} &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; <strong>Gear:</strong> {order.gear}</p>
                  <p><strong>Total Price:</strong> {order.totalprice}₪</p>
                  <p className="text-yellow-600 font-semibold">⚠️ This order is not paid yet</p>

                  <Link
          href="/Cart"
          className="inline-block px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm rounded transition"
        >
          Continue to Checkout
        </Link>
                </div>
                
              ))
            )}
          </section>
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6 border-b-2 border-blue-300 pb-2 tracking-wide">
              🚗 Upcoming Orders
            </h2>
            {futureOrders.length === 0 ? (
          <p className="text-gray-600">No upcoming orders.</p>
        ) : (
          futureOrders.map(order => (
            <div key={order.cartId} className="border p-4 rounded-lg mb-4">
              <p><strong>Car:</strong> {order.manufacturers} - {order.model}</p>
              <p><strong>From:</strong> {order.start_date.split("T")[0]} <strong>&nbsp;&nbsp;&nbsp; To: &nbsp;&nbsp;&nbsp;</strong> {order.end_date.split("T")[0]}</p>
              <p><strong>Location:</strong> {order.location}</p>
              <p><strong>Fuel:</strong> {order.fuels} &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; <strong>Gear:</strong> {order.gear}</p>
              <p><strong>Total Price:</strong> {order.totalprice}₪</p>
            </div>
          ))
        )}
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-400 mb-6 border-b-2 border-gray-300 pb-2 tracking-wide">
              📜 Past Orders
            </h2>

            {pastOrders.length === 0 ? (
              <p className="text-gray-600">No past orders.</p>
            ) : (
              pastOrders.map(order => (
                <div key={order.cartId} className="border p-4 rounded-lg mb-4">
              <p><strong>Car:</strong> {order.manufacturers} - {order.model}</p>
              <p><strong>From:</strong> {order.start_date.split("T")[0]} <strong>&nbsp;&nbsp;&nbsp; To: &nbsp;&nbsp;&nbsp;</strong> {order.end_date.split("T")[0]}</p>
              <p><strong>Location:</strong> {order.location}</p>
              <p><strong>Fuel:</strong> {order.fuels} &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; <strong>Gear:</strong> {order.gear}</p>
              <p><strong>Total Price:</strong> {order.totalprice}₪</p>
            </div>
          ))
        )}
          </section>
        </div>
      </main>
    </div>
  );
}
