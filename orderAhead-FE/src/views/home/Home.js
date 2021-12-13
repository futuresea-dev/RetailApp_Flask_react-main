import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PurchaseByDates from '../purchases/Main'

import { useFullwidthUpdate } from '../../contexts/ThemeContext';

const Home = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: true})

  const user = useSelector(state => state.user)

  if (!localStorage.getItem('userId') || !user) {
    dispatch({type: 'set', darkMode: true})
    history.push('/signin')
  }
  else if (user.is_superuser === 1) history.push('/users')


  const setFullwidth = useFullwidthUpdate()
  // setFullwidth(true)

  return (
    <>
      {user && user.role == 'Customer' &&
        <PurchaseByDates />
      }
    </>
  )
}

export default Home
