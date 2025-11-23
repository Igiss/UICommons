import { useState } from "react";
import "./rating-modal.scss";

interface RatingModalProps {
  submissionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RatingModal = ({ submissionId, onClose, onSuccess }: RatingModalProps) => {
  console.log("🎬 RatingModal rendered with submissionId:", submissionId);

  const [rating, setRating] = useState({
    creativity: 5,
    execution: 5,
    adherence: 5,
    feedback: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:3000/challenges/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          submissionId,
          ...rating,
        }),
      });

      if (res.ok) {
        alert("Rating submitted successfully!");
        onSuccess();
        onClose();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const totalScore = rating.creativity + rating.execution + rating.adherence;

  return (
    <div className="rating-modal-overlay" onClick={onClose}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rating-modal__header">
          <h2>Rate Submission</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rating-criteria">
            {/* Creativity */}
            <div className="rating-item">
              <div className="rating-item__header">
                <label>🎨 Creativity</label>
                <span className="rating-value">{rating.creativity}/10</span>
              </div>
              <p className="rating-description">
                How creative and original is the design?
              </p>
              <input
                type="range"
                min="1"
                max="10"
                value={rating.creativity}
                onChange={(e) =>
                  setRating({ ...rating, creativity: parseInt(e.target.value) })
                }
                className="rating-slider"
              />
              <div className="rating-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Execution */}
            <div className="rating-item">
              <div className="rating-item__header">
                <label>⚙️ Execution</label>
                <span className="rating-value">{rating.execution}/10</span>
              </div>
              <p className="rating-description">
                Code quality, implementation, and attention to detail
              </p>
              <input
                type="range"
                min="1"
                max="10"
                value={rating.execution}
                onChange={(e) =>
                  setRating({ ...rating, execution: parseInt(e.target.value) })
                }
                className="rating-slider"
              />
              <div className="rating-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Adherence */}
            <div className="rating-item">
              <div className="rating-item__header">
                <label>📋 Adherence to Rules</label>
                <span className="rating-value">{rating.adherence}/10</span>
              </div>
              <p className="rating-description">
                How well does it follow the challenge requirements?
              </p>
              <input
                type="range"
                min="1"
                max="10"
                value={rating.adherence}
                onChange={(e) =>
                  setRating({ ...rating, adherence: parseInt(e.target.value) })
                }
                className="rating-slider"
              />
              <div className="rating-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Total Score Display */}
          <div className="total-score">
            <span className="total-score__label">Total Score</span>
            <span className="total-score__value">{totalScore}/30</span>
          </div>

          {/* Feedback */}
          <div className="feedback-section">
            <label>💬 Feedback (Optional)</label>
            <textarea
              value={rating.feedback}
              onChange={(e) => setRating({ ...rating, feedback: e.target.value })}
              placeholder="Share your thoughts on this submission..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="rating-modal__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
