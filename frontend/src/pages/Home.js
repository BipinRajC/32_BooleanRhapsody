// src/pages/Home.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/meme.jpg"; // Background image path
import gitLogo from "../assets/git-logo.png"; // Git logo image path
import { useEmailContext } from "../context/EmailContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const { email, updateEmail } = useEmailContext();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    if (!email) {
      toast.error("Please enter your email!");
    } else if (!validateEmail(email)) {
      toast.error("Please enter a valid email!");
    } else {
      console.log("Email:", email);
      updateEmail(email);
      localStorage.setItem("email", email);
      navigate("/subscribe");
    }
  };

  const handleUnsubscribe = () => {
    if (!email) {
      toast.error("Please enter your email");
    } else {
      navigate("/unsubscribe");
    }
  };
  const handleCustomize = () => {
    if (!email) {
      toast.error("Please enter your email");
    } else {
      localStorage.setItem("email", email);
      navigate("/customize");
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center relative">
        <img
          src={gitLogo}
          alt="Git Logo"
          className="absolute top-4 left-4 w-12 h-12"
        />
        <h1 className="text-5xl font-bold mb-6">
          Decoding GPT-Generated Code Made Easy!
        </h1>
        <p className="text-lg mb-6">
          Ever found yourself lost in the labyrinth of GPT-written code? Fear
          not! Git Summarizer is here to rescue you from the depths of debugging
          despair. Our superpower lies in unraveling the mysteries of GitHub
          repositories, making code understanding as breezy as a summer day.
          Whether you're a seasoned manager, a curious peer developer, or an
          enthusiastic learner, Git Summarizer simplifies complexities with a
          touch of wit and wizardry.
        </p>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full p-3 mb-4 border border-gray-300 rounded text-center"
          value={email}
          onChange={(e) => updateEmail(e.target.value)} // Update the email in the context
        />
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleUnsubscribe}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Unsubscribe
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Subscribe
          </button>
          <button
            onClick={handleCustomize}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Customize
          </button>
          {/* <Link to="/customize" className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-700">Customize</Link> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
