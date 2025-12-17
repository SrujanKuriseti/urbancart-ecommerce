import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { catalogAPI } from '../services/api';
import { cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { reviewAPI } from '../services/api';
import { Rating } from 'react-simple-star-rating';

const placeholder = "https://via.placeholder.com/400x260?text=No+Image";

const ProductDetails = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myText, setMyText] = useState('');

  useEffect(() => {
    catalogAPI.getItemById(itemId).then(res => setProduct(res.data));
  }, [itemId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewAPI.getItemReviews(itemId);
        setReviews(res.data.reviews);
        setAverageRating(res.data.averageRating);
        setReviewCount(res.data.reviewCount);
      } catch (err) {
        console.error('Error loading reviews', err);
      }
    };
    fetchReviews();
  }, [itemId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !isAuthenticated()) {
      alert('Please log in to write a review.');
      navigate('/login');
      return;
    }

    if (!myRating) {
      alert('Please select a rating.');
      return;
    }

    try {
      await reviewAPI.submitReview(itemId, {
        rating: myRating,
        reviewText: myText,
      });
      setMyText('');
      const res = await reviewAPI.getItemReviews(itemId);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setReviewCount(res.data.reviewCount);
      alert('Review submitted!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await cartAPI.addToCart(product.id, 1);
      alert('Added to cart!');
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to add to cart';
      alert(msg);
      if (error.response?.status === 401 && isAuthenticated && !isAuthenticated()) {
        navigate('/login');
      }
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '80vh',
      background: '#f5f5f5'
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(60,60,100,0.1)',
        width: '450px',
        marginTop: '2rem'
      }}>
        <img
          src={product.image_url || placeholder}
          alt={product.name}
          style={{
            width: '100%',
            height: 260,
            objectFit: 'cover',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}
        />
        <h2 style={{ marginBottom: 5 }}>{product.name}</h2>
        <div style={{ color: '#555', marginBottom: 12 }}>{product.brand} &middot; {product.category}</div>
        <div style={{ fontSize: '1.5rem', color: '#27ae60', fontWeight: 'bold', marginBottom: 20 }}>
          ₹{parseFloat(product.price).toLocaleString('en-IN')}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <b>Description:</b><br />{product.description || "No description."}
        </div>

        {/* Average rating */}
        <div style={{ marginBottom: '1rem' }}>
          <b>Rating:</b>{' '}
          {reviewCount === 0 ? (
            <span style={{ color: '#7f8c8d' }}>No reviews yet</span>
          ) : (
            <>
              <Rating
                readonly
                size={20}
                initialValue={averageRating}
                allowFraction
              />
              <span style={{ marginLeft: 8 }}>
                {averageRating.toFixed(1)} / 5 ({reviewCount} review{reviewCount > 1 ? 's' : ''})
              </span>
            </>
          )}
        </div>

        {/* Reviews list */}
        {reviews.length > 0 && (
          <div style={{ marginBottom: '1rem', maxHeight: 200, overflowY: 'auto' }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                <div style={{ fontWeight: 'bold' }}>
                  {r.firstname} {r.lastname}
                </div>
                <Rating readonly size={18} initialValue={r.rating} />
                {r.reviewtext && (
                  <div style={{ fontSize: '0.95rem', color: '#555', marginTop: 4 }}>
                    {r.reviewtext}
                  </div>
                )}
                <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: 2 }}>
                  {new Date(r.createdat).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review form for logged in users */}
        <form onSubmit={handleSubmitReview} style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: 8 }}>
            <b>Your rating:</b>
            <div>
              <Rating
                size={24}
                initialValue={myRating}
                onClick={(value) => setMyRating(value)}
              />
            </div>
          </div>
          <textarea
            value={myText}
            onChange={(e) => setMyText(e.target.value)}
            placeholder="Write your review (optional)"
            rows={3}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: 6,
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              marginBottom: 8,
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 20px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '1rem',
              marginRight: '0.5rem'
            }}
          >
            Submit Review
          </button>
        </form>

        <button
          style={{
            background: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 32px',
            fontSize: '1.07rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
