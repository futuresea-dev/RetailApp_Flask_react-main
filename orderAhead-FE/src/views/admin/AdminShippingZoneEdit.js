import React, { useEffect, useState } from 'react';
import {Snackbar, Alert, Select, TextField, Button, Table, TableBody, TableHead, TableRow, TableCell, MenuItem} from '@mui/material'
import {osServices} from '../../controllers/_services/ordersystem.service'
import OsLoading from '../../components/order-system/OsLoading'
import { useSelector } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom';
import QueryString from 'query-string'
import {Country, State, City} from 'country-state-city'
import OsAdminShippingMethods  from './components/OsAdminShippingMethods'
import Formik from 'formik'

const AdminShippingZoneEdit = () => {
  const history = useHistory()
  const [zoneName, setZoneName] = useState('Everywhere')
  const [zoneLocations, setZoneLocations] = useState([])
  const [methodInstances, setMethodInstances] = useState([])

  const [isMessageShown, setMessageShown] = useState(false)
  const {search} = useLocation()

  const params = QueryString.parse(search)
  const zoneId = params['zone_id']
  const states = State.getStatesOfCountry('US')

  const title = (params.zone_id == 'new')?'Add shipping zone': 'Edit shipping zone'


  useEffect(() => {
    if (zoneId > 0) {
      osServices.osLoadShippingZone({zone_id: zoneId}).then(response => {
        const zone = response.data
        setZoneName(zone.name)
        setZoneLocations(zone.locations)
        setMethodInstances(zone.method_instances)
      })
    }
  }, [zoneId])

  const handleSaveClicked = (e) => {
    const formData = new FormData()
    formData.append('zone_id', zoneId)
    formData.append('zone_name', zoneName)
    zoneLocations.map(zoneLocation => formData.append('zone_locations', zoneLocation))

    osServices.osShippingZoneSaveChanges(formData).then(response => {
      const result = response.data
      const data = result.data
      if (zoneId == 'new') {
        history.push({
          pathname: '/shipping_zone',
          search: '?zone_id=' + data.id
        })
      }
      setMessageShown(true)
    })
  }

  const handleStateChanged = (e) => {
    setZoneLocations(e.target.value);
  }

  const handleDeleteClicked = (e) => {
    const instanceId = parseInt(e.currentTarget.dataset.instance)
    osServices.osShippingZoneInstanceDelete({instance_id: instanceId}).then(response => {
      const updateInstances = methodInstances.filter(instance => {
        return instance.id !== instanceId
      })
      setMethodInstances([...updateInstances])
    })
  }

  const handleZoneNameChanged = (e) => {
    setZoneName(e.target.value)
  }

  const handleCloseMessage = () => {
    setMessageShown(false)
  }

  return (
    <div>
      <h1>{title}</h1>

      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={220}>Zone name</TableCell>
            <TableCell><TextField value={zoneName} onChange={handleZoneNameChanged}></TextField></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>The United State Regions</TableCell>
            <TableCell>
              <Select style={{width:'300px'}} placeholder="Select a state" value={zoneLocations} multiple onChange={handleStateChanged}>
                <MenuItem disabled value="">
                  <em>Select a state</em>
                </MenuItem>
                {states.map(state => <MenuItem key={state.name} value={`${state.isoCode}`}>{state.name}</MenuItem>)}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Shipping method(s)</TableCell>
            <TableCell>
              <OsAdminShippingMethods zone={zoneId} methods={methodInstances} onInstanceDeleted={handleDeleteClicked} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Button onClick={handleSaveClicked} variant={'contained'}>Save</Button></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Snackbar open={isMessageShown} autoHideDuration={6000} onClose={handleCloseMessage}>
        <Alert onClose={handleCloseMessage} severity="success" sx={{ width: '100%' }}>
          Shipping zone has been saved!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminShippingZoneEdit;