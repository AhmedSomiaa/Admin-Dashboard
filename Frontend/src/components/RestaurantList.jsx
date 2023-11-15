import React, { useState, useEffect } from "react";
import "./RestaurantList.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import customAxios from "../services/axiosInterceptor";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const[reviews,setReviews]=useState([]);


  const getRestaurants = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/restaurants");
      setRestaurants(data);
  

      const restaurantsWithOwners = await Promise.all(
        Array.isArray(data)
          ? data.map(async (restaurant) => {
              const ownerResponse = await axios.get(`http://localhost:3000/api/owners/${restaurant.ownerId}`);
              const owner = ownerResponse.data;
              return { ...restaurant, owner };
            })
          : []
      );
      
  
      setRestaurants(restaurantsWithOwners);
    } catch (error) {
      console.log(error);
  
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.clear();
       
      }
    }
  };
  const handleBanRestaurant = async (id) => {
    try {

      const response = await customAxios.post(`http://localhost:3000/api/restaurants/ban/${id}`);
      console.log(response.data);
    if(response.status===200)
    {
      getRestaurants();
    }
    } catch (error) {

      console.error(error);
    }
  };


  const handleSeeReviews = async (id) => {
    try {
  
      const response = await axios.get(`http://localhost:3000/api/reviews/${id}`);
    
      
      if (response.status === 200) { 
        const fetchedReviews = response.data.reviews;
        console.log('Response:', response);
  
        if (fetchedReviews.length === 0) {
         
          console.log('No reviews found.');
          
        } else {
        
          setReviews(fetchedReviews);
          console.log(fetchedReviews)
        }
      } else {
       
        console.error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    
    }
  };
  
  

  
  useEffect(() => {
    getRestaurants();

  }, []);


  return (
    <>
      <Navbar />
      <div className="mb-4">
        <label className="block text-gray-700 font-bold">
          Filter by Rating:
        </label>
        <input
          type="range"
          id="ratingFilter"
          name="ratingFilter"
          min="1"
          max="5"
          step="1"
          className="w-80 mt-2 appearance-none bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-1 outline-none"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Restaurant Name</th>
            <th>Owner Name</th>
            <th>Owner Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td className="restaurant-cell">
                <span className="restaurant-name">{restaurant.name}</span>
                <Link className="custom-link"  onClick={handleSeeReviews} >See Reviews</Link>
              </td>
              <td>{restaurant.owner ? restaurant.owner.fullname : "N/A"}</td>
              <td>{restaurant.owner ? restaurant.owner.email : "N/A"}</td>
              <td className="text-center">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full border-none cursor-pointer"
                onClick={() => handleBanRestaurant(restaurant.id)}
              >
                Ban
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default RestaurantList;
