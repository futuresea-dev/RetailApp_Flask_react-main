import React from 'react';
import { useHistory } from 'react-router-dom';

const OsCategoryItem = (props) => {
  const photoUrl = props.data.thumbnail
  const categoryName = props.data.name
  const history = useHistory()
  const categoryLink = props.data.link
  return (
    <div className="os-category-item" onClick={() => history.push(categoryLink)}>
      <div className="os-category-item__info">
        <div className="os-category-item__shop">Shop</div>
        <div className="os-category-item__name">{categoryName}</div>
      </div>
      <div className="os-category-item__photo">
        <img className="os-category-item__img" src={photoUrl} />
      </div>
    </div>
  );
};

export default OsCategoryItem;