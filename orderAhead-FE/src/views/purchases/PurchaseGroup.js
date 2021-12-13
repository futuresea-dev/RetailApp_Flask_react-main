import React, {useState} from 'react'
import PurchaseItem from './PurchaseItem'
import formatPrice from './_helper'


const PurchaseGroup = (props) => {
  const [isExpanded, setExpanded] = useState(false)
  const handleToggleClicked = (e) => {
    setExpanded(!isExpanded)
  }

  const defaults = {
    date: '8/27/2021',
    total: 0,
    employee: '<employee>',
    receipt_id: '<receipt_id>',
    items: [],
  }

  const purchase = {...defaults, ...props.data}

  return (
    <div className={'purchase-group'+ ((isExpanded)?' purchase-group--expanded':'')}>
      <div className="purchase-group__header d-flex justify-content-between" onClick={handleToggleClicked}>
        <div className="purchase-group__left d-flex align-items-center">
          <div className='purchase-group__toggle'>
            <i className="fas fa-chevron-up"></i><i className="fas fa-chevron-down"></i>
          </div>
          {/* /.purchase-group__toggle */}
          <div className="purchase-group__info">
            <div className="purchase-group__date">Purchase on <strong>{purchase.date}</strong> Total <strong>{formatPrice(purchase.total)}</strong></div>
            <div className="purchase-group__employee">Employee: <strong>{purchase.employee}</strong></div>
          </div>
          {/* /.purchase-group__info */}
        </div>
        {/* /.purchase-group__left */}
        <div className="purchase-group__right">
          Receipt ID:&nbsp;<strong>{purchase.receipt_id}</strong>
        </div>
        {/* /.purchase-group__right */}
      </div>
      {/* /.purchase-group__header */}

      {isExpanded && (
        <div className="purchase-group__content">
          {purchase.items.length > 0 && purchase.items.map((item) => <PurchaseItem data={item} />)}
          {purchase.items.length == 0 && <div>There is no items</div>}
        </div>
        // purchase-group__content
      )}
    </div>
  )
}

const styles = {
  group: {
    marginBottom: '5px',
  },
  group__header: {
    cursor: 'pointer',
    borderBottom: '1px solid #ebeff4',
    padding: '15px',
  },
  group__toggle: {
    fontSize: '16px',
    marginRight: '20px',
  },
  group__collapse: {
    padding: '15px',
  },
}
export default PurchaseGroup