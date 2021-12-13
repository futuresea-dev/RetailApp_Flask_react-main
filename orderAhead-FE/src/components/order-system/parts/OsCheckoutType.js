
import React, { useEffect, useState } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import OsLoading from '../OsLoading'
import { osServices } from '../../../controllers/_services/ordersystem.service'
import { useSelector } from 'react-redux'


const OsCheckoutType = () => {
  const [shippingMethods, setShippingMethods] = useState([])
  const [isLoading, setLoading] = useState(false)
  const user = useSelector(state => state.user)

  useEffect(() => {
    if (!user || !user.customer_id) return
    const params = {
      customer_id: user.customer_id,
      country: 'US',
      state: 'ME',
      city: 'City',
      zip: '10000',
    }
    setLoading(true)
    osServices.osGetShippingMethods(params).then(response => {
      setShippingMethods(response.data)
      setLoading(false)
    })
  }, [user])

  return (
    <div className="os-checkout-group">
      <div className="os-checkout-group__caption">Type</div>
      <div className="os-checkout-group__body">
        <div className="os-checkout-group__border">
          {isLoading && <OsLoading />}
          {!isLoading &&
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="gender"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {shippingMethods.map(shippingMethod => <FormControlLabel value={shippingMethod.id} control={<Radio />} label={shippingMethod.name} />)}
              </RadioGroup>

            </FormControl>
          }
        </div>
      </div>
    </div>
  )
}

export default OsCheckoutType