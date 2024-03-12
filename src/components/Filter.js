import React, { useEffect, useState } from 'react';
import md5 from "md5";

import { useDispatch, useSelector } from 'react-redux';
import {useParams} from "react-router-dom";

import Main from '../components/Main';
import './Filter.css';


import { updateIDProductCheck } from "../redux/productsSlice.js";

export default function Filter() {

    const dispatch = useDispatch();

    let params = useParams();
    let num;
    if(Object.keys(params).length) {
        params = [...params.clid];
        num = parseInt(params[1]);
    }

    const [brand, setBrand] = useState();
    const [price, setPrice] = useState();
    const [brandName, setBrandName] = useState("All");
    const [priceName, setPriceName] = useState("Not selected");
    const [name, setName] = useState("");
    const [dataLoadState, setDataLoadState] = useState(0); // 0 - not loaded, 1 - is loading, 2 - loaded, 3 - error
    const [dataLoadError, setDataLoadError] = useState(null);
    const [idBrand, setIDBrand] = useState([]);
    const [idPrice, setIDPrice] = useState([]);
    const [idName, setIDName] = useState([]);
    const [copyIDBrand, setCopyIDBrand] = useState([]);
    const [copyIDPrice, setCopyIDPrice] = useState([]);
    const [copyIDName, setCopyIDName] = useState([]);

    useEffect(() => {

            fetch("https://api.valantis.store:41000/",
            { method: 'POST',
            headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
            body: JSON.stringify( {"action": "get_fields",
                                   "params": {"field": "brand", "offset": num, "limit": 51}} ) 
            })
            .then( response => {
                if (!response.ok) {
                    throw new Error("fetch error " + response.status);
                } else
                    return response.json();
            })
            .then(data => {
                setBrand(data.result)
                return fetch("https://api.valantis.store:41000/",
                       { method: 'POST',
                         headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
                         body: JSON.stringify( {"action": "get_fields",
                                                "params": {"field": "price", "offset": num, "limit": 51}})
                        });
            })
            .then( response => {
                if (!response.ok) {
                    throw new Error("fetch error " + response.status);
                } else
                    return response.json();
            })
            .then(data => {
                setPrice(data.result);
            })
            .catch( error => {
                setDataLoadState(3);
                setDataLoadError("HTTP error "+error.message);
            });
        
    }, []);

    let brandJSX = [<option value = "All" key = {Math.random()}>All</option>];
    let priceJSX = [<option value = "Not selected" key = {Math.random()}>Not selected</option>];

    if(brand) {
        for (let i = 0; i < brand.length; i++) {
            if(brand[i]) {
                brandJSX.push(<option value = {brand[i]} key = {Math.random()}>{brand[i]}</option>)
             }
        }
    };  

    if(price) {
        for (let i = 0; i < price.length; i++) {
            if(price[i]) {
                priceJSX.push(<option value = {price[i]} key = {Math.random()}>{price[i]}</option>)
             }
        }
    };

    function filterBrand (eo) {
        setBrandName(eo.target.value);

        if(!(eo.target.value === "All")) {
            fetch("https://api.valantis.store:41000/",
            { method: 'POST',
              headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
              body: JSON.stringify( { "action": "filter",
                                      "params": {"brand": eo.target.value}} )
            })
            .then( response => {
                if (!response.ok) {
                    throw new Error("fetch error " + response.status);
                } else
                    return response.json();
            })
            .then(data => {
                // setIDBrand(data.result);
                let brand = data.result;
                if((!(priceName === "Not selected")) || (!(name === ""))) {
                    let id = [...idPrice, ...idName]
                    brand = brand.filter(element => {
                        return id.includes(element)
                    })
                    if (brand.length === 0) {
                        dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                    } else {
                        dispatch( updateIDProductCheck(brand) );
                        setIDBrand(brand);
                        setIDPrice(brand);
                        setIDName(brand);
                    }
                } else {
                    dispatch( updateIDProductCheck(data.result) ); // рповерить надо указывать idPrice
                    setCopyIDBrand(data.result);
                    setIDBrand(data.result)
                }
            })
            .catch( error => {
                setDataLoadState(3);
                setDataLoadError("HTTP error "+error.message);
            });
        } else {
            setIDBrand([]);
            dispatch( updateIDProductCheck([...copyIDPrice, ...copyIDName]) );
        }
    };

    function filterPrice (eo) {
        setPriceName(eo.target.value);

        if(!(eo.target.value === "Not selected")) {
            fetch("https://api.valantis.store:41000/",
            { method: 'POST',
              headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
              body: JSON.stringify( { "action": "filter",
                                      "params": {"price": Number(eo.target.value)}} )
            })
            .then( response => {
                if (!response.ok) {
                    throw new Error("fetch error " + response.status);
                } else
                    return response.json();
            })
            .then(data => {
                // setIDPrice(data.result)
                let price = data.result;
                if((!(brandName === "All")) || (!(name === ""))) {
                    let id = [...idBrand, ...idName]
                    price = price.filter(element => {
                        return id.includes(element)
                    })
                    if (price.length === 0) {
                        dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                    } else {
                        dispatch( updateIDProductCheck(price) );
                        setIDBrand(price);
                        setIDPrice(price);
                        setIDName(price);
                    }
                } else {
                    dispatch( updateIDProductCheck(data.result) );
                    setCopyIDPrice(data.result)
                    setIDPrice(data.result)
                }
            })
            .catch( error => {
                setDataLoadState(3);
                setDataLoadError("HTTP error "+error.message);
            });
        } else {
            setIDPrice([])
            dispatch( updateIDProductCheck([...copyIDBrand, ...copyIDName]) );
        }
    };

    function filterName (eo) {
        setName(eo.target.value);

        if(!(eo.target.value === "")) {
            fetch("https://api.valantis.store:41000/",
            { method: 'POST',
              headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
              body: JSON.stringify( { "action": "filter",
                                      "params": {"product": eo.target.value}} )
            })
            .then( response => {
                if (!response.ok) {
                    throw new Error("fetch error " + response.status);
                } else
                    return response.json();
            })
            .then(data => {
                 let name = data.result;
                 if((!(brandName === "All")) || (!(priceName === "Not selected"))) {
                    let id = [...idBrand, ...idName];
                    name = name.filter(element => {
                         return id.includes(element)
                    })
                    if (name.length === 0) {
                        dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                    } else {
                        dispatch( updateIDProductCheck(name) );
                        setIDBrand(name);
                        setIDPrice(name);
                        setIDName(name);
                    }
                } else {
                    dispatch( updateIDProductCheck(data.result) );
                    setCopyIDName(data.result)
                    setIDName(data.result)
                }
            })
            .catch( error => {
                setDataLoadState(3);
                setDataLoadError("HTTP error "+error.message);
            });
        } else {
            setIDName([])
            dispatch( updateIDProductCheck([...copyIDBrand, ...idPrice]) );
        }
    };


  return (
    <div>
    <div className="filter">
        <span>See only:</span>
        <label htmlFor="name">Name:
            <input type="text" id="name" className = "custom-select" onChange={filterName}></input>
        </label>
        <label htmlFor="category">Brand:
            <select id="category" className = "custom-select" value={brandName} onChange={filterBrand}>
                {brandJSX}
            </select>
        </label>
        <label htmlFor="price">Price:
            <select id="price" className = "custom-select" value={priceName} onChange={filterPrice}>
                {priceJSX}
            </select>
        </label>
    </div>
    <div>
        <Main />
    </div>
    </div>
  )
}