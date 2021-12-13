import React, { useEffect, useState } from 'react';
import {Rating, Button, Table, TableBody, TableHead, TableRow, TableCell} from '@mui/material'
import {osServices} from '../../controllers/_services/ordersystem.service'
import OsLoading from '../../components/order-system/OsLoading'
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

const AdminProductReviews = () => {
  const [productReviews, setProductReviews] = useState([])
  const [isLoading, setLoading] = useState(false)
  const user = useSelector(state => state.user)

  useEffect(() => {
    setLoading(true)
    if (user.med_id) {
      const params = {customer_id: user.customer_id}
      osServices.osGetBoughtProductReviews(params).then(response => {
        setProductReviews(response.data)
        setLoading(false)
      })
    }
  }, [user])

  const history = useHistory()
  const handleReviewEdit = (e) => {
    const sku = e.target.getAttribute('data-sku')
    history.push(`/review?sku=${sku}`)
  }

  return (
    <>
      <h1 class="mb-5">Reviews for Bought Products</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="5%"></TableCell>
            <TableCell width="5%">SKU</TableCell>
            <TableCell width="20%">Product Name</TableCell>
            <TableCell width="15%">Rating</TableCell>
            <TableCell width="auto">Content</TableCell>
            <TableCell width="5%"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <OsLoading />}
          {!isLoading && productReviews.map(review =>
            <TableRow>
              <TableCell><img src={review.img_url} width="100" height="100" /></TableCell>
              <TableCell><Link to={`/order/product/${review.sku}`}>{review.sku}</Link></TableCell>
              <TableCell><Link to={`/order/product/${review.sku}`}>{review.name}</Link></TableCell>
              <TableCell><Rating value={review.rating} precision={0.5} size="large" readOnly></Rating></TableCell>
              <TableCell>{review.content}</TableCell>
              <TableCell><Button data-sku={review.sku} data-customer={user.customer_id} onClick={handleReviewEdit}>Edit</Button></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default AdminProductReviews;