import React from 'react';
import md5 from "md5";

import Main from './Main';
import { withDataLoad } from './withDataLoad';

const password = 'Valantis';
const stamp = new Date().toISOString().slice(0,10).replace(/-/g,"");
const hash = md5(`${password}_${stamp }`);


class ProductsRoot extends React.PureComponent {

  fetchConfig = {
    headers: {"X-Auth": hash},
    URL: "http://api.valantis.store:40000/",
    method: 'POST',
    // headers: {
    //     "Accept": "application/json",
    // },
  };

  // HOF возвращает каждый раз НОВЫЙ, обёрнутый компонент
  // поэтому получать HOC лучше не внутри render, чтобы не рендерить каждый раз НОВЫЙ компонент
  ProductsWithData = withDataLoad(this.fetchConfig,"productData")(Main);

  render() {

    let ProductsWithData = this.ProductsWithData;
    return <ProductsWithData /> ;

  }

}

export default ProductsRoot;