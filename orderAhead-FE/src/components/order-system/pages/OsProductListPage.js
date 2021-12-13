import React, { useEffect, useState } from 'react';
import OsProductItem from '../loop/OsProductItem';
import OsProductList from '../OsProductList';
import OsSidebar from '../OsSidebar';
import OsContentHeader from '../OsContentHeader';
import OsWidgetCategories from '../widgets/OsWidgetCategories';
import OsLoading from '../OsLoading';
import { osServices } from '../../../controllers/_services/ordersystem.service';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import QueryString from 'query-string'
import {Box, FormControl, Select, MenuItem, InputLabel} from '@mui/material'

const OsProductListPage = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [isLoading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [priceOrdering, setPriceOrdering] = useState('asc')

  const {search} = useLocation();
  const params = QueryString.parse(search)

  let queryList = []
  let title = []
  if (params.category) {
    title.push(params.category)
    queryList.push(`category=${params.category}`)
  }

  if (params.brand) {
    title.push(params.brand)
    queryList.push(`brand=${params.brand}`)
  }

  if (params.type) {
    title.push(params.type)
    queryList.push(`type=${params.type}`)
  }

  title = title.join(' > ')

  const handlePriceSort = (e) => {
    setPriceOrdering(e.target.value)
    const newQueryList = [...queryList, `ordering=${e.target.value}`]
    const queryPart = newQueryList.join('&')
    const url = `/order/products?${queryPart}`
    history.push(url)
  }

  useEffect(() => {
    setLoading(true)

    osServices.osLoadProducts(params).then((response) => {
      setProducts(response.data)
      setLoading(false)
    })
  }, [search])

  // console.log(category)

  return (
    <>
      <div className="os-container">
        <div className="os-layout os-layout--2columns-left">
          <div className="os-layout__sidebar">
            <OsSidebar />
          </div>
          <div className="os-layout__main">
            <div class="d-flex justify-content-between">
              <OsContentHeader data={{title: title}} baseUrl={''} />
              <Box sx={{ minWidth: 150 }}>
                <FormControl fullWidth>
                  <InputLabel>Sort by price</InputLabel>
                  <Select onChange={handlePriceSort} value={priceOrdering}>
                    <MenuItem value="desc">High to low</MenuItem>
                    <MenuItem value="asc">Low to high</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
            {isLoading && <OsLoading />}
            {!isLoading &&
            <OsProductList>
              {products.length == 0 && <div className="mt-3">There is no product.</div>}
              {products.map(product => <OsProductItem key={product.sku} data={product} />)}
            </OsProductList>}
          </div>
        </div>
      </div>
      <div className="os-layout">
        <OsWidgetCategories />
      </div>
    </>
  );
};

export default OsProductListPage;