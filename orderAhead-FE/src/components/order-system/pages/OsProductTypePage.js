import React, { useEffect, useState } from 'react';
import OsProductItem from '../loop/OsProductItem';
import OsProductList from '../OsProductList';
import OsSidebar from '../OsSidebar';
import OsContentHeader from '../OsContentHeader';
import OsWidgetCategories from '../widgets/OsWidgetCategories';
import OsLoading from '../OsLoading';
import { osServices } from '../../../controllers/_services/ordersystem.service';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const OsProductTypePage = (props) => {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [typeData, setType] = useState({})
  let { type } = useParams();


  useEffect(() => {
    setLoading(true)
    const params = {
      type: type,
    }

    setType({title: type})

    osServices.osLoadProducts(params).then((response) => {
      setProducts(response.data)
      setLoading(false)
    })
  }, [type])

  console.log(type)


  return (
    <>
      <div className="os-container">
        <div className="os-layout os-layout--2columns-left">
          <div className="os-layout__sidebar">
            <OsSidebar />
          </div>
          <div className="os-layout__main">
            <OsContentHeader data={typeData} />
            {isLoading && <OsLoading />}
            {!isLoading &&
            <OsProductList>
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

export default OsProductTypePage;