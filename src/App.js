import React, { useState } from "react";
import "./App.css";
import MapContainer from "./MapContainer";
import Header from "./Header";
import MapContext from "./MapContext";
import ReactModal from "react-modal";
import AddReviewModal from "./AddReviewModal";
import ReviewsModal from "./ReviewsModal";

const initialCenter = {
  lat: -34.397,
  lng: 150.644,
};

const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

// Bind the modals to the app
ReactModal.setAppElement("#root");

function App() {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(initialCenter);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [addReviewModalIsOpen, setAddReviewModalIsOpen] = useState(false);
  const [reviewsModalIsOpen, setReviewsModalIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleOpenAddReviewModal = (marker) => {
    setAddReviewModalIsOpen(true);
  };

  const handleOpenReviewsModal = async (marker) => {
    // Fetch or set reviews for the selected marker here
    // Communicate with backend

    try {
      // Fetch the place by place_id to get the database ID
      const placeResponse = await fetch(
        `${SERVER_URL}/api/places/?place_id=${marker.id}`
      );
      if (!placeResponse.ok) {
        setReviews([]);
      }

      const places = await placeResponse.json();
      if (places.length === 0) {
        alert("No review found");
        setReviews([]); // Exit if no place is found
      } else {
        // Assuming the first result is the correct one
        const placeId = places[0].id;

        // Fetch reviews for the found place ID
        const reviewResponse = await fetch(
          `${SERVER_URL}/api/reviews/?place=${placeId}`
        );
        if (!reviewResponse.ok) throw new Error("Failed to fetch reviews");

        const reviewsData = await reviewResponse.json();
        setReviews(reviewsData); // Set the fetched reviews into state
      }

      setReviewsModalIsOpen(true); // Open the reviews modal
    } catch (error) {
      console.error("Error fetching place or reviews:", error);
      alert("Error fetching place or reviews");
    }
  };

  const handleCloseAddReviewModal = () => {
    setAddReviewModalIsOpen(false);
  };

  const handleCloseReviewsModal = () => {
    setReviewsModalIsOpen(false);
  };

  // Function for posting reviews to DB
  const handleAddReviewSubmit = async (reviewData) => {
    try {
      // Check if the place exists or add it
      let placeResponse = await fetch(
        SERVER_URL + `/api/places/?place_id=${selectedMarker.id}`
      );

      let places = await placeResponse.json();

      let placeId;
      if (places.length === 0) {
        // Place does not exist, create it
        console.log(
          JSON.stringify({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              name: selectedMarker.title,
              lat: selectedMarker.lat,
              lng: selectedMarker.lng,
              place_id: selectedMarker.id,
              place_type: selectedMarker.type,
            },
          })
        );
        placeResponse = await fetch(SERVER_URL + "/api/places/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: selectedMarker.title,
            lat: selectedMarker.lat,
            lng: selectedMarker.lng,
            place_id: selectedMarker.id,
            place_type: selectedMarker.type,
          }),
        });

        if (!placeResponse.ok) throw new Error("Failed to create place");
        const newPlace = await placeResponse.json();
        placeId = newPlace.id;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        // Place exists
        placeId = places[0].id;
      }

      // Submit the review
      const reviewResponse = await fetch(SERVER_URL + "/api/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          place: placeId,
          username: reviewData.username,
          wheelchair_rating: reviewData.wheelchairRating,
          restroom_rating: reviewData.restroomRating,
          overall_rating: reviewData.overallRating,
          comment: reviewData.comments,
        }),
      });
      if (reviewResponse.ok) {
        alert("Review successfully added!");
        handleCloseAddReviewModal();
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Failed to handle review submission:", error);
      alert("Error handling review submission");
    }
  };

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        markers,
        setMarkers,
        center,
        setCenter,
        selectedMarker,
        setSelectedMarker,
      }}
    >
      <div className="App">
        <Header />
        <MapContainer
          onAddReview={handleOpenAddReviewModal}
          onDisplayReviews={handleOpenReviewsModal}
        />
        <ReviewsModal
          isOpen={reviewsModalIsOpen}
          onRequestClose={handleCloseReviewsModal}
          reviews={reviews} // Pass the reviews for the selected marker
        />
        <AddReviewModal
          isOpen={addReviewModalIsOpen}
          onRequestClose={handleCloseAddReviewModal}
          onReviewSubmit={handleAddReviewSubmit}
        />
      </div>
    </MapContext.Provider>
  );
}

export default App;
