import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import subscribeBg from "../assets/subscribe-background.jpeg";
import { GitBranch, Trash2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Unsubscribe = () => {
  const email = localStorage.getItem('email') 
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    repoId: null,
  });

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
      const selectedRepo = repositories.find((repo) => repo.id === repoId);
      if (!selectedRepo) {
        toast.error("Repository not found.");
        return;
      }
      const { repositoryUrl, branch } = selectedRepo;
      setRepositories(repositories.filter((repo) => repo.id !== repoId));
      toast.success("Successfully unsubscribed!");
      setConfirmModal({ show: false, repoId: null });
      const response = await axios.post(`https://localhost:3000/unsubscribe`, {
        email,
        repositoryUrl,
        branch,
      });
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      toast.error("Failed to unsubscribe. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${subscribeBg})` }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Subscribed Repositories</h1>

        {loading ? (
          <p className="text-gray-600">Loading subscriptions...</p>
        ) : repositories.length === 0 ? (
          <p className="text-gray-600">You haven't subscribed to any repositories yet.</p>
        ) : (
          <div className="space-y-4">
            {repositories.map((repo) => (
              <div key={repo.id} className="p-4 border rounded-lg shadow-md flex justify-between items-center bg-gray-100">
                <div>
                  <p className="text-lg font-medium text-gray-900">{repo.repositoryUrl}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <GitBranch size={16} />
                    {repo.branch}
                  </p>
                </div>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-red-600 transition shadow-md"
                  onClick={() => setConfirmModal({ show: true, repoId: repo.id })}
                >
                  <Trash2 size={16} />
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmModal.show && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Confirm Unsubscribe</h2>
            <p>Are you sure you want to unsubscribe from this repository?</p>
            <div className="flex justify-between gap-4 mt-6">
              <button
                className="py-2 px-4 rounded text-white bg-gray-500 hover:bg-gray-600 transition"
                onClick={() => setConfirmModal({ show: false, repoId: null })}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 rounded text-white bg-blue-500 hover:bg-blue-600 transition"
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
  );
};

export default Unsubscribe;
