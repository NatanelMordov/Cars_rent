"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../app/globals.css";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
}

const initialCars: Car[] = [
  { id: 1, make: "Toyota", model: "Corolla", year: 2020, pricePerDay: 180 },
  { id: 2, make: "Honda", model: "Civic", year: 2019, pricePerDay: 165 },
];

export default function AdminPanel() {  
    
    // added or changed to support only Admin can view this file
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [cars, setCars] = useState(initialCars);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [form, setForm] = useState({ make: "", model: "", year: "", pricePerDay: "" });


  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = JSON.parse(/*localStorage*/sessionStorage.getItem("isAdmin") || "false");
      console.log("User role from localStorage:", role);
      if (!role /*!== "true"*/) {
        alert("Access denied. Admins only.");
        router.push("/");
      } else {
        setIsAuthorized(true);
      }
      setIsCheckingAuth(false);
    }
  }, []);


  
/*  if (isCheckingAuth) {
    return <div className="p-4">Checking permissions...</div>;
  }

  if (!isAuthorized) {
    return null;
  }
    */
////////////////

/*
  const [cars, setCars] = useState(initialCars);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [form, setForm] = useState({ make: "", model: "", year: "", pricePerDay: "" });
*/
  const resetForm = () => {
    setForm({ make: "", model: "", year: "", pricePerDay: "" });
    setEditingCar(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setForm({
      make: car.make,
      model: car.model,
      year: car.year.toString(),
      pricePerDay: car.pricePerDay.toString(),
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const { make, model, year, pricePerDay } = form;
    if (!make || !model || !year || !pricePerDay) return;

    const newCar: Car = {
      id: editingCar ? editingCar.id : Date.now(),
      make,
      model,
      year: parseInt(year),
      pricePerDay: parseFloat(pricePerDay),
    };

    if (editingCar) {
      setCars(cars.map((c) => (c.id === editingCar.id ? newCar : c)));
    } else {
      setCars([...cars, newCar]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this car?")) {
      setCars(cars.filter((c) => c.id !== id));
    }
  };
  
  
 // added or changed to support only Admin can view this file
 
  if (isCheckingAuth) {
    return <div className="p-4">Checking permissions...</div>;
  }

  if (!isAuthorized) {
    return null;
  }
  
///////////////////////////////
  return (
    <div className="p-4">
    <button
    className="absolute top-0 right-0 m-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
    onClick={() => (window.location.href = '/')}
        >
  ⬅ Back to Home
      </button>
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Car Rentals</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={openAddModal}
      >
        Add New Car
      </button>
      

      <table className="mt-6 w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Make</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Year</th>
            <th className="border p-2">Price/Day</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td className="border p-2">{car.id}</td>
              <td className="border p-2">{car.make}</td>
              <td className="border p-2">{car.model}</td>
              <td className="border p-2">{car.year}</td>
              <td className="border p-2">{car.pricePerDay} NIS</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => openEditModal(car)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(car.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCar ? "Edit Car" : "Add New Car"}
            </h2>
            <div className="space-y-3">
              <input
                className="w-full p-2 border rounded"
                placeholder="Make"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Year"
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Price Per Day (NIS)"
                type="number"
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                {editingCar ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
