import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import md5 from "md5";

import Product from "./Product.js";
import './Main.css';
import {PagesLinks} from "./PagesLinks.js";
import {useParams} from "react-router-dom";
// import Filter from './Filter.js';

import { updateID} from "../redux/productsSlice.js";

const Main = (props) => {

    const dispatch = useDispatch();

    let params = useParams();
    let num;
    if(Object.keys(params).length) {
        params = [...params.clid];
        num = parseInt(params[1]);
    }

    const [products, setProducts] = useState(null);
    const [dataLoadState, setDataLoadState] = useState(0); // 0 - not loaded, 1 - is loading, 2 - loaded, 3 - error
    const [dataLoadError, setDataLoadError] = useState(null);
    
    const idProductsCheck = useSelector( state => state.products.idProcductCheck);

    let productsJSX;

    useEffect(
        ()=>{
            if (idProductsCheck === "Нет элементов, удовлетворяющих запросу") {
                setProducts(idProductsCheck)
            } else {
                fetch("http://api.valantis.store:40000/",
            { method: 'POST',
            headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
            body: JSON.stringify( {"action": "get_ids",
                                   "params": {"offset": num, "limit": 51}} )
            })
            .then( response => {
                if (!response.ok) {
                    throw new Error("fetch error " + response.status);
                } else
                    return response.json();
            })
            .then( data => {
                // dispatch( updateID(data.result) );
                return fetch("http://api.valantis.store:40000/",
                       { method: 'POST',
                       headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
                       body: JSON.stringify( {"action": "get_items",
                                              "params": {"ids": idProductsCheck.length > 0 ? idProductsCheck : data.result}} )
                        });
            })
            .then( response => {
                if (!response.ok) {
                    throw new Error("fetch error " + response.status);
                } else
                    return response.json();
            })
            .then(data => {
                setDataLoadState(2);
                setDataLoadError(null);
                let productsData = data.result.reduce((accumulator, current) => {
                    if (accumulator.findIndex(object => object.id === current.id) === -1) {
                        accumulator.push(current);
                    }
                    return accumulator;
                }, []);
                setProducts(productsData);
            })
            .catch( error => {
                setDataLoadState(3);
                setDataLoadError("HTTP error "+error.message);
            });
            }
        }, [num, idProductsCheck]);

        
        if(!(products === "Нет элементов, удовлетворяющих запросу") && products) {
            productsJSX = products.map((element, index) => {
                return <Product key = {element.id}
                                info = {element}/>
            })
        } else if (products === "Нет элементов, удовлетворяющих запросу") {
            productsJSX = <div>{products}</div>
        }

    return (
        <div>
            <div>{productsJSX}</div>
            <PagesLinks />
        </div>
    );
  };
  
  export default Main;