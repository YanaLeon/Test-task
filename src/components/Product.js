import React from 'react';

import { useDispatch } from 'react-redux';
import './Product.css';

const Product = ({info, index}) => {

  const dispatch = useDispatch();

  return (
      <div className="Product">
        <p><span className="text">Название:</span> {info.product}</p>
        <p><span className="text">Бренд:</span> {info.brand || "отсутствует"}</p>
        <p><span className="text">Цена:</span> {info.price}&euro;</p>
      </div>
  )
}

export default React.memo(Product);