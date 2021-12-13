import React, { useEffect, useState } from 'react';
import {Box, Divider, Rating, Button, Table, TableBody, TableHead, TableRow, TableCell} from '@mui/material'
import {osServices} from '../../controllers/_services/ordersystem.service'
import OsLoading from '../../components/order-system/OsLoading'
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import OsIconRemove from '../../components/order-system/icons/OsIconRemove'
import {Country, State, City} from 'country-state-city'

// const states = State.getStatesOfCountry('US')


const AdminShippingManage = () => {
  const [shippingZones, setShippingZones] = useState([])
  const [isLoading, setLoading] = useState(false)
  const history = useHistory()

  const handleAddShippingZoneClicked = (e) => {
    history.push('/shipping_zone?zone_id=new')
  }


  useEffect(() => {
    setLoading(true)
    osServices.osLoadShippingZones().then(response => {
      setShippingZones(response.data)
      setLoading(false)
    })
  }, [])

  const handleDeleteClicked = (e) => {
    const deletedZoneId = e.currentTarget.dataset.zone
    osServices.osShippingZoneDelete({zone_id: deletedZoneId}).then(response => {
      const updatedZones = shippingZones.filter(zone => zone.id != deletedZoneId)
      setShippingZones(updatedZones)
    })
  }

  const handleEditClicked = (e) => {
    const zoneId = e.currentTarget.dataset.zone
    history.push({
      pathname: '/shipping_zone',
      search: '?zone_id=' + zoneId
    })
  }

  const convertCodesToNames = (stateCodesText) => {
    if (stateCodesText == 'Everywhere' || stateCodesText === undefined)
      return stateCodesText
    console.log('stateCodesText')
    console.log(stateCodesText)
    let stateCodes = stateCodesText.split(',')
    stateCodes = stateCodes.map(stateCode => {
      const state = State.getStateByCode(stateCode.trim())
      return state.name
    })

    return stateCodes.join(', ')
  }

  return (
    <div>
      <Box class="d-flex">
        <h1>Shipping zones</h1>
        <Button onClick={handleAddShippingZoneClicked} class="ml-2">Add shipping zone</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="20%">Zone name</TableCell>
            <TableCell width="auto">The United State Regions</TableCell>
            <TableCell width="40%">Shipping method(s)</TableCell>
            <TableCell width="5%"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <OsLoading />}
          {!isLoading && shippingZones.map(zone =>
            <TableRow>
              <TableCell>{zone.name}</TableCell>
              <TableCell>{convertCodesToNames(zone.regions)}</TableCell>
              <TableCell>{zone.shipping_methods}</TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& hr': {
                      mx: 0.5,
                    },
                  }}
                >
                  <Button color={'error'} variant="contained"  style={{color: 'white'}} data-zone={zone.id} onClick={handleDeleteClicked}><OsIconRemove/></Button>
                  <Divider orientation="vertical" flexItem />
                  <Button variant="contained" data-zone={zone.id} onClick={handleEditClicked}>Edit</Button>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminShippingManage;