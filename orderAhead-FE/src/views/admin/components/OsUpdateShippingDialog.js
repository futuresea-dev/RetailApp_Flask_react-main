import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Table, TableRow, TableCell } from '@mui/material';
import { Box, Select, MenuItem, Divider, Button } from '@mui/material';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types'
import { osServices } from '../../../controllers/_services/ordersystem.service';

const OsUpdateShippingDialog = (props) => {
  const {onDialogClosed, isOpen, methodInstanceId} = props

  const [title, setTitle] = useState(false)
  const [cost, setCost] = useState(false)


  const handleClose = () => {
    onDialogClosed(false)
  }

  const handleSaveClicked = (e) => {
    const updatedInstance = {
      title: title,
      cost: cost,
    }
    onDialogClosed(updatedInstance)
  }

  useEffect(() => {
    if (!methodInstanceId) return
    osServices.osLoadMethodInstance({instance_id: methodInstanceId}).then(response => {
      const instance = response.data
      setTitle(instance.title)
      setCost(instance.cost)
    })
  }, [methodInstanceId])

  const handleTitleChanged = (e) => {
    setTitle(e.target.value)
  }

  const handleCostChanged = (e) => {
    setCost(e.target.value)
  }

  return <Dialog onClose={handleClose} open={isOpen}>
        <DialogTitle>Shipping Method Settings</DialogTitle>
        <DialogContent>
          <Box class="p-2">
            <Table>
              <TableRow>
                <TableCell>Method title</TableCell>
                <TableCell><TextField variant="outlined" fullWidth value={title} data-field="title" onChange={handleTitleChanged} /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cost</TableCell>
                <TableCell><TextField  variant="outlined" fullWidth value={cost} data-field="cost" onChange={handleCostChanged} /></TableCell>
              </TableRow>
            </Table>

          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant={'contained'} onClick={handleSaveClicked}>Save changes</Button>
        </DialogActions>
      </Dialog>
}

OsUpdateShippingDialog.propTypes = {
  onDialogClosed: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default OsUpdateShippingDialog