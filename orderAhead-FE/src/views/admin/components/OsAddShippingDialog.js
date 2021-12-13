import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Select, MenuItem, Divider, Button } from '@mui/material';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types'
import { osServices } from '../../../controllers/_services/ordersystem.service';

const OsAddShippingDialog = (props) => {
  const {onDialogClosed, isOpen} = props
  const [predefinedShippingMethods, setShippingMethods] = useState([])
  const [shippingMethod, setShippingMethod] = useState(false)

  useEffect(() => {
    osServices.osGetShippingMethods({}).then(response => {
      setShippingMethods(response.data)
      setShippingMethod(response.data[0].id)
    })
  }, [])

  const handleShippingMethodChanged = (e) => {
    setShippingMethod(e.target.value)
  }

  const handleClose = () => {
    onDialogClosed(false)
  }

  const handleAddShippingClicked = (e) => {
    onDialogClosed(shippingMethod)
  }

  return <Dialog onClose={handleClose} open={isOpen}>
        <DialogTitle>Add shipping method</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose the shipping method you wish to add. Only shipping methods which support zones are listed.</DialogContentText>
          <Select fullWidth className="mt-2 mb-1" value={shippingMethod} onChange={handleShippingMethodChanged}>
            {predefinedShippingMethods.map(method => <MenuItem key={method.id} value={method.id}>{method.name}</MenuItem>)}
          </Select>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant={'contained'} onClick={handleAddShippingClicked}>Add shipping method</Button>
        </DialogActions>
      </Dialog>
}

OsAddShippingDialog.propTypes = {
  onDialogClosed: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default OsAddShippingDialog