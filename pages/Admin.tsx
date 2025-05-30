"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
//
import Link from "next/link";
import "../app/globals.css";

interface Car {
  id: number;
  manufacturers: string;
  model: string;
  yearsOfProduction: number;
  fuels: string;
  gear: string;
  priceperday: number;
  location: string;
  inventory: number;
}

export default function AdminPanel() {

  // added by Lina & roger
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [cars, setCars] = useState<Car[]>([]);
  useEffect(() => {
  fetch('http://localhost:5000/cars')
    .then((res) => res.json())
    .then((data) => setCars(data))
    .catch((err) => console.error("Failed to load cars:", err));
}, []);

  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [form, setForm] = useState({ manufacturers: "", model: "", yearsOfProduction: "", fuels: "", gear:"", priceperday: "", location:"", inventory:"" });


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


  const resetForm = () => {
    setForm({ manufacturers: "", model: "", yearsOfProduction: "", fuels: "", gear:"", priceperday: "", location:"", inventory:"" });
    setEditingCar(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setForm({
      manufacturers: car.manufacturers,
      model: car.model,
      yearsOfProduction: car.yearsOfProduction.toString(),
      fuels: car.fuels,
      gear: car.gear,
      priceperday: car.priceperday.toString(),
      location: car.location,
      inventory: car.inventory.toString(),
    });
    setShowModal(true);
  };


const handleSave = () => {
  const { manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory} = form;
  if (!manufacturers || !model || !yearsOfProduction || !fuels || !gear || !priceperday || !location || !inventory) return;

  const carData = {
    manufacturers,
    model,
    yearsOfProduction: parseInt(yearsOfProduction),
    fuels,
    gear,
    priceperday: parseFloat(priceperday),
    location,
    inventory: parseInt(inventory),
  };
/*if (editingCar) {
      setCars(cars.map((c) => (c.id === editingCar.id ? newCar : c)));
    }*/
  if (editingCar) {
    // update existing car
    fetch(`http://localhost:5000/cars/${editingCar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    })
      .then(() => {
        setCars(cars.map((c) => (c.id === editingCar.id ? { ...carData, id: editingCar.id } : c)));
        setShowModal(false);
        resetForm();
      })
      .catch(console.error);
  } else {
    // create new car
    fetch('http://localhost:5000/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    })
      .then((res) => res.json())
      .then((newCar) => {
        setCars([...cars, newCar]);
        setShowModal(false);
        resetForm();
      })
      .catch(console.error);
  }
};


  const handleDelete = (id: number) => {
  if (confirm("Are you sure you want to delete this car?")) {
    fetch(`http://localhost:5000/cars/${id}`, { method: 'DELETE' })
      .then(() => setCars(cars.filter((c) => c.id !== id)))
      .catch(console.error);
  }
};



    if (isCheckingAuth) {
    return <div className="p-4">Checking permissions...</div>;
  }

  if (!isAuthorized) {
    return null;
  }
  ///////////////

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
            <th className="border p-2">Id</th>
            <th className="border p-2">Manufacturer</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Years Of Production</th>
            <th className="border p-2">Fuels</th>
            <th className="border p-2">Gear</th>
            <th className="border p-2">Price / Day</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Inventory</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td className="border p-2">{car.id}</td>
              <td className="border p-2">{car.manufacturers}</td>
              <td className="border p-2">{car.model}</td>
              <td className="border p-2">{car.yearsOfProduction}</td>
              <td className="border p-2">{car.fuels}</td>
              <td className="border p-2">{car.gear}</td>
              <td className="border p-2">{car.priceperday} NIS</td>
              <td className="border p-2">{car.location}</td>
              <td className="border p-2">{car.inventory}</td>
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
                placeholder="Manufacturer"
                value={form.manufacturers}
                onChange={(e) => setForm({ ...form, manufacturers: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Years Of Production"
                type="number"
                value={form.yearsOfProduction}
                onChange={(e) => setForm({ ...form, yearsOfProduction: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Fuels"
                value={form.fuels}
                onChange={(e) => setForm({ ...form, fuels: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Gear"
                value={form.gear}
                onChange={(e) => setForm({ ...form, gear: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Price Per Day (NIS)"
                type="number"
                value={form.priceperday}
                onChange={(e) => setForm({ ...form, priceperday: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Inventory"
                type="number"
                value={form.inventory}
                onChange={(e) => setForm({ ...form, inventory: e.target.value })}
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
