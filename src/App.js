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

// Bind the modals to the app
ReactModal.setAppElement("#root");

function App() {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(initialCenter);
  const [markers, setMarkers] = useState([]);

  const [addReviewModalIsOpen, setAddReviewModalIsOpen] = useState(false);
  const [reviewsModalIsOpen, setReviewsModalIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleOpenAddReviewModal = (marker) => {
    setAddReviewModalIsOpen(true);
  };

  const handleOpenReviewsModal = (marker) => {
    // Fetch or set reviews for the selected marker here
    // Communicate with backend
    setReviewsModalIsOpen(true);
  };

  const handleCloseAddReviewModal = () => {
    setAddReviewModalIsOpen(false);
  };

  const handleCloseReviewsModal = () => {
    setReviewsModalIsOpen(false);
  };

  const handleAddReviewSubmit = (reviewData) => {
    // Submit your review data to your backend or state management
    // Communicate with backend
    // Close the modal
    handleCloseAddReviewModal();
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
