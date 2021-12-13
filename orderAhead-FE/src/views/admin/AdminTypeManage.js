import React, { useEffect, useState } from 'react';
import OsLoading from '../../components/order-system/OsLoading';
import { osServices } from '../../controllers/_services/ordersystem.service';
import {Table, TableBody, TableHead, TableRow, TableCell, Button} from '@mui/material'
import { useHistory, Link } from 'react-router-dom';
import { formatPrice } from '../../components/order-system/ultility';

const AdminTypeManage = () => {
  const [productTypes, setProductTypes] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [isCalculating, setCalculating] = useState(false)
  useEffect(() => {
    setLoading(true)
    osServices.osLoadTypes({}).then(response => {
      setProductTypes(response.data)
      setLoading(false)
    })
  }, [])

  const history = useHistory()

  const handleEditClicked = (e) => {
    const target = e.currentTarget.getAttribute('target')
    history.push('/type?name=' + target)
  }

  const DEFAULT_TEXT = 'Recalculate price from / to for all'
  const [calculateText, setCalculateText] = useState(DEFAULT_TEXT)
  const handleRecalculateClicked = (e) => {
    setCalculateText('Calculating...')
    setCalculating(true)
    osServices.osRecalculatePrice().then(response => {
      setCalculateText(DEFAULT_TEXT)
      setCalculating(false)
      alert('Done')
    })
  }

  return (
    <div>
        <>
          <div class="d-flex justify-content-between">
            <h1>Product Type Management</h1>
            <Button variant={'contained'} onClick={handleRecalculateClicked}>{isCalculating && <OsLoading />} {calculateText}</Button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="100">Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price From</TableCell>
                <TableCell>Price To</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && <OsLoading />}
              {!isLoading && productTypes.map(productType =>
                <TableRow>
                  <TableCell style={{cursor: 'pointer'}} target={productType.name} onClick={handleEditClicked}><img src={productType.thumbnail} width="50"/></TableCell>
                  <TableCell style={{cursor: 'pointer'}} target={productType.name} onClick={handleEditClicked}>{productType.name}</TableCell>
                  <TableCell>{formatPrice(productType.price_range.from)}</TableCell>
                  <TableCell>{formatPrice(productType.price_range.to)}</TableCell>
                  <TableCell align="right"><Button variant="text" target={productType.name} onClick={handleEditClicked}>Edit</Button></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>

    </div>
  );
};

export default AdminTypeManage;