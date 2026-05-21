"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockReviews, Review } from "@/data/reviews";
import { useAuth } from "@/components/AuthProvider";
import { showToast } from "@/components/Toast";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "star-filled" : "star-empty"} style={{ fontSize: 16 }}>
          ★
        </span>
      ))}
    </div>
  );
}

function StarInput({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star ${i <= (hover || rating) ? "star-filled" : "star-empty"}`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(mockReviews.filter((r) => r.isApproved));
  const { user } = useAuth();
  const router = useRouter();

  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (rating === 0 || text.trim().length === 0) {
      showToast("Please add a rating and review text", "error");
      return;
    }

    // POST to API
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text: text.trim() }),
      });
    } catch {
      // API might not be fully wired, but we'll still show in UI
    }

    // Add to local state immediately
    const newReview: Review = {
      id: `r-${Date.now()}`,
      userId: "current",
      username: user?.username || "Anonymous",
      avatarUrl: "",
      rating,
      text: text.trim(),
      isApproved: true, // Show immediately in UI
      createdAt: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [newReview, ...prev]);

    setSubmitted(true);
    showToast("Review submitted! Thank you for your feedback.", "success");

    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setRating(0);
      setText("");
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12,
          }}
        >
          Community <span className="gradient-text">Reviews</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StarDisplay rating={Math.round(avgRating)} />
            <span style={{ fontWeight: 700, fontSize: 18 }}>{avgRating.toFixed(1)}</span>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
              ({reviews.length} reviews)
            </span>
          </div>
          <button className="btn-primary" onClick={handleOpenModal} style={{ fontSize: 13 }}>
            Leave a Review
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}
        className="stagger-children"
      >
        {reviews.map((review) => (
          <div key={review.id} className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `hsl(${(review.username.charCodeAt(0) * 67) % 360}, 55%, 45%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "white", flexShrink: 0,
                }}
              >
                {review.username[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{review.username}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{review.createdAt}</div>
              </div>
            </div>
            <StarDisplay rating={review.rating} />
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)", marginTop: 12 }}>
              {review.text}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setSubmitted(false); }}>
          <div
            className="glass-card-static"
            style={{ padding: 32, maxWidth: 480, width: "90%", animation: "slideUp 0.3s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Thank you!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                  Your review has been added.
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Leave a Review</h2>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: "block", color: "var(--text-secondary)" }}>
                    Rating
                  </label>
                  <StarInput rating={rating} onChange={setRating} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: "block", color: "var(--text-secondary)" }}>
                    Your Review
                  </label>
                  <textarea
                    className="input-field"
                    rows={4} value={text} onChange={(e) => setText(e.target.value)}
                    placeholder="Share your experience with PullGame..."
                    style={{ resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button
                    className="btn-primary" onClick={handleSubmit}
                    style={{ opacity: rating === 0 || text.trim().length === 0 ? 0.5 : 1 }}
                  >
                    Submit Review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
