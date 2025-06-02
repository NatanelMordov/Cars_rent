"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState({ username: "", email: "", is_admin: false});
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

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

  if (!username) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-right font-sans">
      <h1 className="text-4xl font-bold text-black mb-10 text-center">
        Hi {profile.username}
      </h1>

      <div className="mb-6">
        <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-900 text-base"
        />
      </div>

      <div className="mb-8">
        <label className="block text-base font-medium text-gray-700 mb-2">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-900 text-base"
        />
      </div>

      <div className="text-center text-gray-600 text-base mb-6">
        User Permission:{" "}
        <span className={`ml-2 font-semibold ${profile.is_admin ? "text-green-600" : "text-blue-600"}`}>
            {profile.is_admin ? "Admin" : "Regular User"}
        </span>
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
  );
}
