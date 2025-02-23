// import { useState } from "react";
// import "./Rating.css";

// const Rating = () => {
//   const [rating, setRating] = useState(0);
//   const [employeeId, setEmployeeId] = useState("");

//   const handleClick = (rate) => {
//     setRating(rate);
//   };

//   return (
//     <div className="rating-container">
//       <h1>Diamond Cutters Limited</h1>
//       <h2>Rate your experience</h2>

//       <div className="emoji-rating">
//         {["😡", "😞", "😐", "😊", "😁"].map((emoji, index) => (
//           <span
//             key={index}
//             className={`emoji ${rating >= index + 1 ? "selected" : ""}`}
//             onClick={() => handleClick(index + 1)}
//           >
//             {emoji}
//           </span>
//         ))}
//       </div>

//       <p>Your rating: {rating}</p>

//       <label>Employee IC Number</label>
//       <input
//         type="text"
//         value={employeeId}
//         onChange={(e) => setEmployeeId(e.target.value)}
//         placeholder="Enter your IC number"
//       />

//       <button className="SubmitBtn">Submit</button>
//     </div>
//   );
// };

// export default Rating;


import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import "./Rating.css";

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [employeeId, setEmployeeId] = useState("");
  const [ratings, setRatings] = useState([]); // State to store fetched ratings
  const [averageRating, setAverageRating] = useState(0); // State to store average rating

  // Fetch all ratings when the component mounts
  useEffect(() => {
    fetchRatings();
    fetchAverageRating();
  }, []);

  // Fetch all ratings from the backend
  const fetchRatings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ratings");
      setRatings(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  // Fetch the average rating from the backend
  const fetchAverageRating = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ratings/average");
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  // Handle rating selection
  const handleClick = (rate) => {
    setRating(rate);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!employeeId || !rating) {
      alert("Please enter your IC number and select a rating.");
      return;
    }

    try {
      // Save the rating to the backend
      await axios.post("http://localhost:5000/api/ratings", {
        empId: employeeId,
        ratingScore: rating,
      });

      // Refresh the ratings and average rating
      fetchRatings();
      fetchAverageRating();

      // Reset the form
      setRating(0);
      setEmployeeId("");
      alert("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="rating-container">
      <h1>Diamond Cutters Limited</h1>
      <h2>Rate your experience</h2>

      {/* Emoji Rating */}
      <div className="emoji-rating">
        {["😡", "😞", "😐", "😊", "😁"].map((emoji, index) => (
          <span
            key={index}
            className={`emoji ${rating >= index + 1 ? "selected" : ""}`}
            onClick={() => handleClick(index + 1)}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Display Selected Rating */}
      <p>Your rating: {rating}</p>

      {/* Employee IC Number Input */}
      <label>Employee IC Number</label>
      <input
        type="text"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        placeholder="Enter your IC number"
      />

      {/* Submit Button */}
      <button className="SubmitBtn" onClick={handleSubmit}>
        Submit
      </button>

      {/* Display Average Rating */}
      <div className="average-rating">
        <h3>Average Rating: {averageRating.toFixed(2)}</h3>
      </div>

      {/* Display All Ratings */}
      <div className="ratings-list">
        <h3>All Ratings</h3>
        <ul>
          {ratings.map((rating, index) => (
            <li key={index}>
              Employee ID: {rating.empId}, Rating: {rating.ratingScore}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rating;