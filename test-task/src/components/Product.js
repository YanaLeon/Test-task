import React from 'react';

import { useDispatch } from 'react-redux';
import './Product.css';

const Product = ({info, index}) => {

  const dispatch = useDispatch();

  return (
      <div className="Product">
        <p>Название: {info.product}</p>
        <p>Бренд: {info.brand || "отсутствует"}</p>
        <p>Цена: {info.price}&euro;</p>
      </div>
  )
}

export default React.memo(Product);