import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { GitBranch, Trash2 } from 'lucide-react';
import subscribeBg from "../assets/subscribe-background.jpeg";
import 'react-toastify/dist/ReactToastify.css';

const Unsubscribe = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    repoId: null,
  });
  const email = localStorage.getItem('email');

  const fetchRepositories = async () => {
    try {
      const response = await axios.get(`https://localhost:3000/subscriptions/${email}`);
      setRepositories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      toast.error('Failed to load subscriptions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const handleUnsubscribe = async (repoId) => {
    try {
      await axios.delete(`https://localhost:3000/unsubscribe/${email}/${repoId}`);
      setRepositories(repositories.filter(repo => repo.id !== repoId));
      toast.success('Successfully unsubscribed!');
      setConfirmModal({ show: false, repoId: null });
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      toast.error('Failed to unsubscribe. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${subscribeBg})` }}>
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Loading subscriptions...</h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${subscribeBg})` }}>
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center w-full max-w-lg">
      <div className="absolute top-4 right-4 bg-black text-white text-sm px-4 py-2 rounded-lg bg-opacity-75">
        {email}
      </div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Subscribed Repositories</h1>

        {repositories.length === 0 ? (
          <div className="text-xl text-gray-700">You haven't subscribed to any repositories yet.</div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-4">
            {repositories.map((repo) => (
              <div key={repo.id} className="bg-white bg-opacity-75 p-6 rounded-lg shadow-lg w-full max-w-md flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="font-medium text-lg text-gray-800 mb-2">{repo.repositoryUrl}</div>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <GitBranch size={16} />
                      {repo.branch}
                    </span>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-red-600 transition-colors"
                  onClick={() => setConfirmModal({ show: true, repoId: repo.id })}
                >
                  <Trash2 size={16} />
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>
        )}

        {confirmModal.show && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">Confirm Unsubscribe</h2>
              <p>Are you sure you want to unsubscribe from this repository?</p>
              <div className="flex justify-between gap-4 mt-6">
                <button
                  className="py-2 px-4 rounded text-white bg-gray-500 hover:bg-gray-600"
                  onClick={() => setConfirmModal({ show: false, repoId: null })}
                >
                  Cancel
                </button>
                <button
                  className="py-2 px-4 rounded text-white bg-blue-500 hover:bg-blue-600"
                  onClick={() => confirmModal.repoId && handleUnsubscribe(confirmModal.repoId)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Unsubscribe;
