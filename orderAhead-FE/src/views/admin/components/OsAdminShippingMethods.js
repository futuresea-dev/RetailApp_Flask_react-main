import { Divider, Box, Button, TableCell, TableRow, Table, TableHead, TableBody, TableFooter, Switch } from '@mui/material';
import React, {useEffect, useState} from 'react';
import { osServices } from '../../../controllers/_services/ordersystem.service';
import OsAddShippingDialog from './OsAddShippingDialog'
import OsUpdateShippingDialog from './OsUpdateShippingDialog';
import { useHistory } from 'react-router-dom';
import OsIconRemove from '../../../components/order-system/icons/OsIconRemove'

const OsAdminShippingMethods = (props) => {
  const {zone, methods, onInstanceDeleted} = props
  const [open, setOpen] = React.useState(false);
  const [methodInstances, setMethodInstances] = React.useState(methods);
  const history = useHistory()
  const [isUpdating, setIsUpdating] = useState(false)

  const [updatedInstanceId, setUpdatedInstanceId] = useState(false)
  const [methodTitle, setMethodTitle] = useState('Shipping Method')

  const handleAddShippingMethodClicked = () => {
    setOpen(true)
  }

  useEffect(() => {
    setMethodInstances(methods)
  }, [methods])

  const handleDialogClosed = (value) => {
    console.log('handleDialogClosed')
    console.log(value)
    if (value) {
      const formData = new FormData()
      formData.append('method_id', value)
      formData.append('zone_id', zone)
      osServices.osShippingZoneAddMethod(formData).then(response => {
        const result = response.data
        const data = result.data
        console.log(data.zone_id)
        if (zone == 'new') {
          history.push({
            pathname: '/shipping_zone',
            search: '?zone_id=' + data.zone_id
          })
        } else {
          setMethodInstances([...methodInstances, data])
        }
      })
    }
    setOpen(false)
  }

  const handleInstanceEditClicked = (instanceId, e) => {
    //
    setIsUpdating(true)
    setUpdatedInstanceId(instanceId)
  }

  const handleEnableChanged = (instanceId, e) => {
    const isEnabled = e.target.checked

    osServices.osShippingZoneUpdateMethodStatus({instance_id: instanceId, is_enabled: isEnabled}).then(response => {
      const updateInstances = methodInstances.map(instance => {
        if (instance.id == instanceId) {
          instance.is_enabled = response.data.is_enabled
        }
        return instance
      })
      console.log(response.data)
      console.log(updateInstances)
      setMethodInstances([...updateInstances])
    })
  }

  const handleUpdateDialogClosed = (changes) => {
    if (!changes) {
      setIsUpdating(false)
      return
    }

    osServices.osUpdateMethodInstace({instance_id: updatedInstanceId, data: changes}).then(response => {
      const updateInstances = methodInstances.map(instance => {
        if (instance.id == updatedInstanceId) {
          instance = Object.assign({}, instance, changes)
        }
        return instance
      })
      setMethodInstances([...updateInstances])
      setIsUpdating(false)
    })
  }


  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Enable</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {methodInstances.length > 0 && methodInstances.map(
            methodInstance => {
              return <TableRow key={methodInstance.id}>
                <TableCell>
                  {methodInstance.title}<br/>
                  <Box
                    sx={{
                      display: 'flex',
                      marginTop: '15px',
                      alignItems: 'center',
                      '& hr': {
                        mx: 0.5,
                      },
                    }}
                  >
                    <Button variant="outlined" onClick={e => handleInstanceEditClicked(methodInstance.id, e)}>Edit</Button>
                    <Divider orientation="vertical" flexItem />
                    <Button color={'error'} variant="outlined" style={{color: 'white'}} data-instance={methodInstance.id} onClick={onInstanceDeleted}><OsIconRemove/></Button>
                  </Box>
                </TableCell>
                <TableCell><Switch checked={methodInstance.is_enabled} onChange={(e) => handleEnableChanged(methodInstance.id, e)} /></TableCell>
              </TableRow>
            })
          }
          {methodInstances.length==0 && <TableRow>
            <TableCell colSpan="2">You can add multiple shipping methods within this zone. Only customers within the zone will see them.</TableCell>
          </TableRow>}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell><Button onClick={handleAddShippingMethodClicked}>Add shipping method</Button></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <OsAddShippingDialog onDialogClosed={handleDialogClosed} isOpen={open} />
      <OsUpdateShippingDialog isOpen={isUpdating} onDialogClosed={handleUpdateDialogClosed} methodTitle={methodTitle} methodInstanceId={updatedInstanceId} />
    </div>
  );
};

export default OsAdminShippingMethods;