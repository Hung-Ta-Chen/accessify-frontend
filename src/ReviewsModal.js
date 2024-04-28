import React from "react";
import ReactModal from "react-modal";

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
                <span className="username">{review.username}</span>
                <span className="ratings">
                  Wheelchair: {review.wheelchairRating} Stars
                </span>
                <span className="ratings">
                  Restroom: {review.restroomRating} Stars
                </span>
                <span className="ratings">
                  Overall: {review.overallRating} Stars
                </span>
              </div>
              <p className="comments">{review.comments}</p>
            </div>
          ))}
        </div>
        <button onClick={onRequestClose}>Close</button>
      </div>
    </ReactModal>
  );
}

export default ReviewsModal;
