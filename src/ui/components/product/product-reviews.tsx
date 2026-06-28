"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useAuth } from "@/ui/components/auth/auth-context";
import { getProductReviews, createReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/client";
import { BackendReview } from "@/lib/api/types";
import InlineNotification from "@/ui/components/notifications/inline-notification";
import { FormButton } from "@/ui/components/button";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={`w-6 h-6 ${n <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { accessToken, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<BackendReview[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getProductReviews(productId)
      .then((res) => {
        if (cancelled) return;
        setReviews(res.reviews);
        setCount(res.count);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    if (rating < 1) {
      setErrorMessage("Please select a star rating.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const review = await createReview(accessToken, productId, {
        rating,
        comment: comment.trim() || undefined,
      });
      setReviews((prev) => [review, ...prev]);
      setCount((prev) => prev + 1);
      setRating(0);
      setComment("");
      setSuccessMessage("Thanks! Your review has been posted.");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong while submitting your review. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 mt-12 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Reviews {count > 0 && <span className="text-gray-400 font-normal">({count})</span>}
      </h2>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 rounded-xl p-4 sm:p-5">
          <p className="text-sm font-semibold text-gray-900 mb-2">Write a review</p>
          <div className="mb-3">
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product (optional)"
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none mb-3"
          />
          {errorMessage && (
            <div className="mb-3">
              <InlineNotification type="error" message={errorMessage} />
            </div>
          )}
          {successMessage && (
            <div className="mb-3">
              <InlineNotification type="success" message={successMessage} />
            </div>
          )}
          <FormButton variant="submit" size="md" isLoading={isSubmitting} disabled={isSubmitting}>
            Submit Review
          </FormButton>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative">
                {review.user.profileImage ? (
                  <Image
                    src={review.user.profileImage}
                    alt={review.user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-600">
                    {review.user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{review.user.name}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
