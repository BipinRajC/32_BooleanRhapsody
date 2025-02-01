import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import subscribeBg from "../assets/subscribe-background.jpeg";
import subscribeImage from "../assets/jacksparrow.jpg";
import { ToastContainer , toast } from "react-toastify";
import { BASE_URL } from "../api/url";
import axios from "axios";

function Subscribe() {
  const [role, setRole] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleRoleChange = (e) => setRole(e.target.value);
  const handleRepoUrlChange = (e) => setRepoUrl(e.target.value);
  const handleBranchChange = (e) => setBranch(e.target.value);

  const handleSubmit = async () => {
    if(!role||!repoUrl||!branch) return toast.error("Please fill all the fields")
    await axios.post(BASE_URL + "/subscription/addSubscription", {
      email,
      repository: repoUrl,
      branch,
      subscriptionType: role,
    });
    navigate("/confirmation");
  };

  return (
    <div
      className="min-h-screen w-screen bg-cover bg-center flex items-center justify-center overflow-y-auto"
      style={{ backgroundImage: `url(${subscribeBg})` }}
    >
      <div className="absolute top-4 right-4 bg-black text-white text-sm px-4 py-2 rounded-lg bg-opacity-75">
        {email}
      </div>
  
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center max-w-full">
        <h1 className="text-3xl font-bold mb-6">
          Does any GitHub repository make you feel like this?
          <br />
          Send it our way, we gotchu! Savvy?
        </h1>
        <img
          src={subscribeImage}
          alt="Subscribe"
          className="mb-6 w-1/2 mx-auto rounded-lg"
        />
  
        {/* Input Fields */}
        <input
          type="text"
          placeholder="Enter GitHub repo URL"
          value={repoUrl}
          onChange={handleRepoUrlChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter the Branch name"
          value={branch}
          onChange={handleBranchChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your role</option>
          <option value="Manager">Manager</option>
          <option value="Peer Developer">Peer Developer</option>
          <option value="Learner">Learner</option>
        </select>
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600 transition duration-200"
        >
          Subscribe
        </button>
        <Link
          to="/"
          className="block w-full p-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
        >
          Return Home
        </Link>
      </div>
      <ToastContainer/>
    </div>
  );
  
}

export default Subscribe;
