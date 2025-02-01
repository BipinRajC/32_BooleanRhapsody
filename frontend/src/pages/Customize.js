// src/pages/Customize.js
import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import techDoodles from "../assets/customize-background.jpg"; // Update the path as necessary
import { useEmailContext } from "../context/EmailContext";
import { ToastContainer , toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../api/url";
import axios from "axios";

function Customize() {
  const navigate=useNavigate()
  // const { email, updateEmail } = useEmailContext();
  const [repo, updateRepo] = useState("");
  const [prompt, updatePrompt] = useState("");
  const [branch,updateBranch] = useState("")
  const email=localStorage.getItem('email')

  const onSubmit = async () => {
    if(!repo||!prompt||!branch) toast.error("Please fill all the fields.")
    await axios.post(BASE_URL + "/subscription/addSubscription", {
      email: email,
      repository: repo,
      branch,
      subscriptionType: "Custom",
      customPrompt: prompt,
    });
    navigate("/confirmation")
  };
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${techDoodles})` }}
    >
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Customize Your Summary Prompt</h1>
        <div className="absolute top-4 right-4 bg-black text-white text-sm px-4 py-2 rounded-lg bg-opacity-75">
        {email}
      </div>
        <input
          type="text"
          placeholder="Enter the repository url"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={repo}
          onChange={(e) => updateRepo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter the branch"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={branch}
          onChange={(e) => updateBranch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your custom prompt"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={prompt}
          onChange={(e) => updatePrompt(e.target.value)}
        />
        {/* <Link to="/confirmation"> */}
          <button
            className="w-full p-3 bg-green-500 text-white rounded mb-4"
            onClick={onSubmit}
          >
            Submit Prompt
          </button>
        {/* </Link> */}
        <Link
          to="/"
          className="block w-full p-3 bg-gray-500 text-white rounded mb-2"
        >
          Return Home
        </Link>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Customize;
