import React, { useEffect } from 'react'
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import OsIconCart from './icons/OsIconCart'
import OsCartPopup from './OsCartPopup';
import { useSelector } from 'react-redux';

const OsMinicart = () => {
  const anchor = 'right'
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const cartItems = useSelector(state => state.cartItems)
  let totalQty = 0

  cartItems.forEach(element => {
    totalQty += element.qty
  });


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
     <React.Fragment key={anchor}>
        <div className="os-minicart">
          <button className="os-minicart__button" onClick={toggleDrawer(anchor, true)}>
            <OsIconCart />
            <div className="os-minicart__itemcount">{totalQty}</div>
          </button>

          <Drawer
            className="os-minicart__drawer"
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <OsCartPopup closeDrawer={() => toggleDrawer(anchor, false)} />
          </Drawer>
        </div>
      </React.Fragment>
    </div>
  )
}

export default OsMinicart