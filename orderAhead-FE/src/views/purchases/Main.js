import React, {useEffect, useState} from 'react'
import PurchaseGroup from './PurchaseGroup'
import { userService } from '../../controllers/_services';

const Main = () => {
  const [isLoading, setLoading] = useState(false)
  const userId = localStorage.getItem('userId')
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    userService.getLastPurchasesByDate(userId).then(result => {
      if (!result.data || result.data.length == 0) {
        setLoading(false)
        return
      }

      setGroups(result.data)
      setLoading(false)
    })
  }, [])

  return (
    <div style={styles.main}>
      <h1 style={styles.main__heading}>Pass Purchases by Date</h1>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (<>
        {groups.length > 0 && groups.map(group => <PurchaseGroup data={group} />)}
        {groups.length == 0 && <div>There is no items</div>}
      </>)}
    </div>
  )
}

const styles = {
  main: {
    color: '#000000',
  },
  main__heading: {
    fontSize: '20px',
    paddingTop: '20px',
    marginBottom: '30px',
  },
}

export default Main