import React from 'react';
import {Rating, Button, Table, TableBody, TableHead, TableRow, TableCell} from '@mui/material'

const OsProductReviews = (props) => {
  let reviews = props.data
  if (!reviews) {
    reviews = []
  }
  let total = 0


  let average_rating = 0
  reviews.map(review => total += review.rating)
  if (reviews.length > 0) {
    average_rating = (total / reviews.length)
  }

  return (
    <div>
      <div class="review-summary">
        <div class="review-summary__heading">Customer Reviews ({reviews.length})</div>
      </div>

      <div class="product-review-listing">
        {reviews && reviews.map(review => <>
          <div class="product-review">
            <div class="product-review__rating">
              <Rating value={review.rating} precision={0.5} size="small" readOnly></Rating>
            </div>
            <div class="product-review__content">
              {review.content}
            </div>
            <div class="product-review__customer">
              Review by <strong>{review.customer_name}</strong>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
};

export default OsProductReviews;