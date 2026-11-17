// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Layout from "../Layout/Layout";

// export default function HomePage() {
//   const navigate = useNavigate();

//   return (
//     <Layout>
//       <div className="flex flex-col items-center justify-center min-h-screen gap-6">
//         <h1 className="text-2xl font-bold">Welcome to Home Page</h1>

//         <button
//           onClick={() => navigate("/bike")}
//           className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-300"
//         >
//           🚴 Go to Bike Page
//         </button>
//       </div>
//     </Layout>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Layout from "../Layout/Layout";

export default function HomePage() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    price: "",
    sold: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBikeId, setSelectedBikeId] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setLoading(true); // Start loading
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/bikes/all`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setBikes(data.bikes);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch(() => {
        toast.error("Check Internet Connection");
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      sold: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEditing
      ? `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/bikes/${selectedBikeId}/update`
      : `${import.meta.env.VITE_REACT_APP_API_URL}/bikes/create`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();

      toast.success(
        isEditing ? "Bike updated successfully" : "Bike created successfully"
      );

      setIsModalOpen(false);
      setIsEditing(false);
      setSelectedBikeId(null);
      fetchBikes();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const fetchBikes = () => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/bikes/all`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setBikes(data.bikes));
  };

  const handleSold = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/bikes/${id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sold: true }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bike status");
      }

      toast.success("Bike marked as sold successfully!");
      fetchBikes();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/bikes/${id}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete bike");
      }

      toast.success("Bike deleted successfully!");
      fetchBikes();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const openModal = (bike = null) => {
    if (bike) {
      setIsEditing(true);
      setFormData({
        name: bike.name,
        model: bike.model,
        price: bike.price,
        sold: bike.sold,
      });
      setSelectedBikeId(bike._id);
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        model: "",
        price: "",
        sold: false,
      });
    }
    setIsModalOpen(true);
  };

  const availableBikes = bikes.filter((bike) => !bike.sold);
  const soldBikes = bikes.filter((bike) => bike.sold);

  // console.log(availableBikes.length);

  const totalAmount = availableBikes.reduce(
    (total, bike) => total + parseFloat(bike.price),
    0
  );

  return (
    <Layout>
      <section className="md:pb-10 pb-7 dark:bg-gray-900 text-white flex flex-col items-center justify-center min-h-[85vh]">
        {/* <img src="Bike.png" alt="Bike" className="mx-auto mt-4" /> */}

        <h1 className="md:text-4xl text-4xl font-semibold text-gray-900 dark:text-gray-200 text-center">
          Gausia Hoque Motors
        </h1>

        <p className="text-lg sm:text-xl mt-4 text-center text-gray-900 dark:text-gray-200">
          Total Price of Bikes :{" "}
          <span className="font-bold">
            {Math.floor(totalAmount).toLocaleString("en-IN")} ৳
          </span>
        </p>
        <p className="text-lg sm:text-xl mt-4 text-center text-gray-900 dark:text-gray-200">
          Total Bikes :{" "}
          <span className="font-bold">{availableBikes.length} </span>
        </p>

        <button
          onClick={() => openModal()}
          className="bg-red-600 text-white px-6 py-3 rounded-md mt-6 transition-all duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 md:w-auto w-full"
        >
          Add New Bike
        </button>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="spinner-border animate-spin w-10 h-10 border-4 border-t-4 dark:border-gray-100 border-gray-900 rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Available Bikes List */}
            <h2 className="text-2xl mt-10 text-center text-gray-900 dark:text-gray-200">
              Available Bikes
            </h2>
            <div className="bg-gray-100 dark:bg-gray-900 font-sans w-full ">
              <div className="space-y-6 mt-6 mx-auto">
                {availableBikes.map((bike, index) => (
                  <div
                    key={bike._id}
                    className="flex flex-col md:flex-row md:justify-between md:items-center p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:gap-8  md:mb-0 w-full md:w-auto">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
                        {`${index + 1}. ${bike.name}`}
                      </h2>

                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 justify-between">
                        <p className="text-sm md:text-base">{bike.model}</p>
                        <p className="font-semibold text-sm md:text-base">
                          ৳ {Math.floor(bike.price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 md:ml-auto w-full md:w-auto">
                      <div className="flex flex-row gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleSold(bike._id)}
                          className="bg-green-500 px-6 py-2 text-white rounded-lg transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-auto font-medium shadow-md"
                        >
                          Sold
                        </button>
                        <button
                          onClick={() => openModal(bike)}
                          className="bg-blue-500 px-4 py-2 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto font-medium shadow-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bike._id)}
                          className="bg-red-500 px-4 py-2 text-white rounded-lg transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-auto font-medium shadow-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Sold Bikes List */}
        <h2 className="text-2xl mt-10 text-center text-gray-900 dark:text-gray-200">
          Sold Bikes
        </h2>
        <div className="space-y-6 mt-6 w-full">
          {soldBikes.map((bike, index) => (
            <div
              key={bike._id}
              className="flex flex-col md:flex-row md:justify-between md:items-center p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 opacity-60"
            >
              <div className="flex flex-col md:flex-row md:items-center md:gap-8  md:mb-0 w-full md:w-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
                  {`${index + 1}. ${bike.name}`}
                </h2>

                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 justify-between">
                  <p className="text-sm md:text-base">{bike.model}</p>
                  <p className="font-semibold text-sm md:text-base">
                    ৳ {Math.floor(bike.price).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 md:ml-auto w-full md:w-auto">
                <p className="text-green-500 font-semibold">Sold</p>

                <div className="flex flex-row gap-4 w-full md:w-auto">
                  <button
                    onClick={() => openModal(bike)}
                    className="bg-blue-500 px-6 py-3 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto font-medium shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bike._id)}
                    className="bg-red-500 px-6 py-3 text-white rounded-lg transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-auto font-medium shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for creating/editing bike */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-md w-full sm:w-96 m-2">
              <h2 className="text-xl mb-4 text-gray-900 dark:text-white">
                {isEditing ? "Edit Bike" : "Add New Bike"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-gray-900 dark:text-white"
                  >
                    Bike Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="model"
                    className="text-gray-900 dark:text-white"
                  >
                    Number
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 w-full sm:w-auto"
                  >
                    {isEditing ? "Update Bike" : "Add Bike"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full sm:w-auto mt-4 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
