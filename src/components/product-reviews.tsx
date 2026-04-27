"use client";

import { useState } from "react";
import { Star, User, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  productId: string;
}

export function ProductReviews({ reviews, averageRating, reviewCount, productId }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", rating.toString());
      formData.append("title", title);
      formData.append("comment", comment);

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit review");

      const newReview = await res.json();
      setLocalReviews([newReview, ...localReviews]);
      setShowForm(false);
      setRating(5);
      setTitle("");
      setComment("");
    } catch (error) {
      console.error("Review submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const starDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = localReviews.filter((r) => r.rating === star).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <Card className="bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30 border-violet-200 dark:border-violet-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {averageRating > 0 ? averageRating.toFixed(1) : "—"}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 transition-all duration-300 ${
                      i < Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Star Distribution */}
            <div className="md:col-span-2 space-y-2">
              {starDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3 group">
                  <span className="text-sm font-medium w-12">{star} star</span>
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-700 ease-out group-hover:from-violet-600 group-hover:to-pink-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
            >
              {showForm ? "Cancel" : "Write a Review"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <Card className="border-2 border-violet-300 dark:border-violet-700 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-all duration-200 hover:scale-125"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          i < (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-300 dark:fill-gray-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts and experience..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {localReviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Customer Reviews ({localReviews.length})</h3>
          {localReviews.map((review, index) => (
            <Card
              key={review.id}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-violet-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                      {review.user.name?.[0] || <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold">{review.user.name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                        {review.isVerified && (
                          <span className="ml-2 inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 transition-all duration-300 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-300 dark:fill-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <p className="font-semibold mb-2 text-lg">{review.title}</p>
                )}
                {review.comment && (
                  <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
}
