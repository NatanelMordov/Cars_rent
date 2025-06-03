"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentModal from "@/components/PaymentModal";
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
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [username, setUsername] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchCart = () => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      fetch(`http://localhost:5000/cart/${storedUsername}`)
        .then((res) => res.json())
        .then((data: OrderItem[]) => setCartItems(data))
        .catch((err) => console.error("Error loading cart:", err));
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = sessionStorage.getItem("username");
      if (user) setUsername(user);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveFromCart = (cartId: number) => {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      fetch(`http://localhost:5000/cart/${cartId}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete item");
          fetchCart();
        })
        .catch((err) => console.error(err));
    }
  };

  const totalSum = cartItems.reduce((sum, item) => sum + item.totalprice, 0);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="flex items-center justify-start p-6 shadow-md">
        <Link href="/" className="hover:scale-105 transition">
          <Image src="/logo (1).svg" alt="Logo" width={160} height={40} />
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold border-b pb-4 mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <Link
              href="/"
              className="inline-block mt-6 bg-gray-100 text-black px-6 py-3 rounded-full hover:bg-gray-200 transition"
            >
              ← Back to Home
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li
                  key={item.cartId}
                  className="p-5 rounded-lg shadow border border-gray-200"
                >
                  <div className="flex justify-between w-full items-start">
                    <h3 className="text-xl font-semibold">
                      {item.manufacturers} {item.model}
                    </h3>
                    <button
                      onClick={() => handleRemoveFromCart(item.cartId)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="text-sm text-gray-600">
                    Fuel: {item.fuels} &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; Gear: {item.gear} &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; Location: {item.location}
                  </p>
                  <div className="text-sm text-gray-600 mt-1">
                    Dates: {item.start_date.split("T")[0]} &nbsp;&nbsp;&nbsp; to &nbsp;&nbsp;&nbsp; {item.end_date.split("T")[0]}
                  </div>
                  <p className="text-black font-bold mt-2">₪{item.totalprice}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t pt-6 flex justify-between items-center">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold">₪{totalSum}</span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
              <Link
                href="/"
                className="bg-white border border-gray-300 text-black px-6 py-3 rounded-full hover:bg-gray-100 transition"
              >
                ← Continue Shopping
              </Link>

              <button
                onClick={() => setModalOpen(true)}
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        total={totalSum}
        username={username}
        cartItems={cartItems.map((item) => ({
            id: item.car_id,
            cart_id: item.cartId,
        }))}
        />
    </div>
  );
}
