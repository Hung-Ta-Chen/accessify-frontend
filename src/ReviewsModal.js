import React from "react";
import ReactModal from "react-modal";
import "./ReviewsModal.css";

function ReviewsModal({ isOpen, onRequestClose, reviews }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Reviews"
      overlayClassName="ReactModal__Overlay"
      className="ReactModal__Content"
    >
      <div className="reviews-modal-content">
        <h2>Reviews</h2>
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div className="review" key={index}>
              <div className="review-header">
                <p className="username">Username: {review.username}</p>
                <p className="ratings">
                  Wheelchair: {review.wheelchair_rating} Stars
                </p>
                <p className="ratings">
                  Restroom: {review.restroom_rating} Stars
                </p>
                <p className="ratings">
                  Overall: {review.overall_rating} Stars
                </p>
              </div>
              <p className="comments">Comment: {review.comment}</p>
            </div>
          ))}
        </div>
        <button onClick={onRequestClose}>Close</button>
      </div>
    </ReactModal>
  );
}

export default ReviewsModal;
