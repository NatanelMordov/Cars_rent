"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;       // car_id
  cart_id: number;  // cart table ID
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  username: string;
  cartItems: CartItem[];
}

export default function PaymentModal({
  isOpen,
  onClose,
  total,
  username,
  cartItems,
}: PaymentModalProps) {
  const [userPoints, setUserPoints] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [appliedPoints, setAppliedPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isOpen && username) {
      fetch(`http://localhost:5000/users/points/${username}`)
        .then((res) => res.json())
        .then((data) => {
          setUserPoints(data.points || 0);
        })
        .catch((err) => console.error("Error fetching points:", err));
    }
  }, [isOpen, username]);

  if (!isOpen && !paymentSuccess) return null;

  const handleUsePoints = () => {
    const points = Math.min(pointsToUse, userPoints, total);
    setAppliedPoints(points);
  };

  const discountedTotal = Math.max(0, total - appliedPoints);

const handlePayment = async () => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:5000/cart/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartIds: cartItems.map((item) => item.cart_id),
        pointsUsed: appliedPoints,
        totalAmount: discountedTotal,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setTimeout(() => {
        setPaymentSuccess(true);
        setLoading(false);
      }, 1000);
    } else {
      throw new Error(data.message || "Failed to update cart status.");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("There was a problem processing the payment.");
    setLoading(false);
  }
};


  return (
    <>
      {/* Main */}
      {isOpen && !paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>

            <div className="mb-6">
              <p className="mb-2">
                You have <strong>{userPoints}</strong> points
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={userPoints}
                  value={pointsToUse}
                  onChange={(e) => setPointsToUse(Number(e.target.value))}
                  className="border border-gray-300 rounded-md p-2 w-24"
                  placeholder="0"
                />
                <button
                  onClick={handleUsePoints}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Use
                </button>
              </div>
              {appliedPoints > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  Applied {appliedPoints} points.
                </p>
              )}
            </div>

            <div className="mb-6">
              <p className="font-semibold text-lg">Payment Method</p>
              <p className="text-sm text-gray-500 mt-1">
                Credit Card (only method available)
              </p>
            </div>

            <div className="flex justify-between text-lg font-semibold mb-6">
              <span>Total to Pay:</span>
              <span>₪{discountedTotal}</span>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="bg-white border border-gray-300 text-black px-6 py-3 rounded-full hover:bg-gray-100 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h2>
            <p className="mb-6 text-gray-700">Thank you for your purchase.</p>
            <button
              onClick={() => {
                setPaymentSuccess(false);
                onClose();
                router.push("/");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      )}
    </>
  );
}
