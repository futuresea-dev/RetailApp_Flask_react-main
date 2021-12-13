import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import QueryString from 'query-string'
import { osServices } from '../../controllers/_services/ordersystem.service';
import OsLoading from '../../components/order-system/OsLoading';
import { Radio, RadioGroup, FormControlLabel, Button, Table, TableRow, TableCell, TextField } from '@mui/material';
import OsAdminProductMediaManage from './components/OsAdminProductMediaManage';

const AdminProductEdit = () => {
  const {search} = useLocation()
  const params = QueryString.parse(search)
  const [product, setProduct] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [productName, setProductName] = useState('')
  const [visibility, setVisibility] = useState(true)

  useEffect(() => {
    setLoading(true)
    osServices.osLoadProduct({sku: params.sku}).then(response => {
      setProduct(response.data)
      setProductName(response.data.name)
      setVisibility(response.data.visibility)
      setLoading(false)
    })

  }, [])

  const handleUpdate = (e) => {
    const formData = new FormData()
    formData.append('sku', product.sku)
    formData.append('product_name', productName)
    formData.append('visibility', visibility)
    osServices.osUpdateProduct(formData).then(response => {

    })
  }

  const handleNameChanged = (e) => {
    setProductName(e.target.value)
  }

  const handleVisibilityChanged = (e) => {
    setVisibility(e.target.value)
  }

  return (
    <div>
      {isLoading && <OsLoading />}
      {!isLoading && product && <>
        <div class="d-flex align-items-center"><h2 class="mr-3">Media management for product </h2><Link to={`/order/product/${product.sku}`}>{product.name}</Link></div>
        <OsAdminProductMediaManage sku={params.sku} data={product.images} />

        <div class="d-flex align-items-center mt-5"><h3 class="mr-3">Detail information</h3></div>
        <Table>
          <TableRow>
            <TableCell>Visibility</TableCell>
            <TableCell>
              <RadioGroup defaultValue={visibility} onChange={handleVisibilityChanged} name="radio-buttons-group">
                <FormControlLabel value={true} control={<Radio />} label="Show" />
                <FormControlLabel value={false} control={<Radio />} label="Hide" />
              </RadioGroup>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell><TextField fullWidth onChange={handleNameChanged} value={productName}></TextField></TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell><Button variant={'contained'} onClick={handleUpdate}>Update</Button></TableCell>
          </TableRow>
        </Table>
      </>}
    </div>
  );
};

export default AdminProductEdit;