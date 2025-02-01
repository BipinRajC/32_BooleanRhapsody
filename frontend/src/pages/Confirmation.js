// src/pages/Confirmation.js
import React from 'react';
import { Link } from 'react-router-dom';
import confirmationBg from '../assets/dicaprio.jpg'; // Background image path

function Confirmation() {
  localStorage.removeItem('email')
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${confirmationBg})` }}
    >
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Congrats! You're one step closer to being a better developer!</h1>
        <p className="text-lg mb-6">Keep sailing with Git Summarizer!</p>
        <Link to="/" className="block w-full p-3 bg-gray-500 text-white rounded">Return Home</Link>
      </div>
    </div>
  );
}

export default Confirmation;
