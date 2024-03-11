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
                if(!(priceName === "Not selected")) {
                    brand = brand.filter(element => {
                        return idPrice.includes(element)
                    })
                    if (brand.length === 0) {
                        dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                    } else {
                        dispatch( updateIDProductCheck(brand) );
                        setIDBrand(brand);
                    }
                } else {
                    dispatch( updateIDProductCheck([...data.result, ...idPrice, ...idName]) ); // рповерить надо указывать idPrice
                    setIDBrand(data.result);
                }

                if (!(name === "")) {
                    brand = brand.filter(element => {
                        return idName.includes(element)
                    })
                    if (brand.length === 0) {
                        dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                    } else {
                        dispatch( updateIDProductCheck(brand) );
                        setIDBrand(brand);
                    }
                } else {
                    dispatch( updateIDProductCheck([...data.result, ...idPrice, ...idName]) ); // рповерить надо указывать idPrice
                    setIDBrand(data.result);
                }
            })
            .catch( error => {
                setDataLoadState(3);
                setDataLoadError("HTTP error "+error.message);
            });
        } else {
            setIDBrand([]);
            dispatch( updateIDProductCheck([...idPrice, ...idName]) );
        }
        console.log(idBrand)
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
                setIDPrice(data.result)
                let price = data.result;
                if(!(brandName === "All")) {
                    price = price.filter(element => {
                        return idBrand.includes(element)
                    })
                    if (price.length === 0) {
                        dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                    } else {
                        dispatch( updateIDProductCheck(price) );
                        setIDPrice(price);
                    }
                } else {
                    dispatch( updateIDProductCheck([...data.result, ...idBrand, idName]) );
                    setIDPrice(data.result)
                }
                
                if (!(name === "")) {
                    price = price.filter(element => {
                        return idName.includes(element)
                    })
                    if (price.length === 0) {
                        dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                    } else {
                        dispatch( updateIDProductCheck(price) );
                        setIDPrice(price);
                    }
                } else {
                    dispatch( updateIDProductCheck([...data.result, ...idBrand, idName]) );
                    setIDPrice(data.result)
                }
            })
            .catch( error => {
                setDataLoadState(3);
                setDataLoadError("HTTP error "+error.message);
            });
        } else {
            console.log(idBrand, idPrice, [...idBrand, ...idName])
            setIDPrice([])
            dispatch( updateIDProductCheck([...idBrand, ...idName]) );
        }
        console.log(idPrice)
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
                 setIDName(data.result)
                 let name = data.result;
                 if(!(brandName === "All")) {
                      name = name.filter(element => {
                         return idBrand.includes(element)
                    })
                    if (name.length === 0) {
                        dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                    } else {
                        dispatch( updateIDProductCheck(name) );
                        setIDName(name);
                    }
                } else {
                    dispatch( updateIDProductCheck([...idBrand, ...idPrice, ...data.result]) );
                    setIDName(data.result)
                }
                
                if (!(priceName === "Not selected")) {
                    name = name.filter(element => {
                        return idPrice.includes(element)
                   })
                   if (name.length === 0) {
                       dispatch( updateIDProductCheck("Нет элементов, удовлетворяющих запросу") );
                   } else {
                       dispatch( updateIDProductCheck(name) );
                       setIDName(name);
                   }
                } else {
                    dispatch( updateIDProductCheck([...idBrand, ...idPrice, ...data.result]) );
                    setIDName(data.result)
                }
            })
            .catch( error => {
                setDataLoadState(3);
                setDataLoadError("HTTP error "+error.message);
            });
        } else {
            setIDName([])
            dispatch( updateIDProductCheck([...idBrand, ...idPrice]) );
        }
        console.log(idName)
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

// function filterBrand (eo) {
//     setBrandName(eo.target.value);
// 
//     if(!(eo.target.value === "All")) {
//         fetch("http://api.valantis.store:40000/",
//         { method: 'POST',
//           headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
//           body: JSON.stringify( { "action": "filter",
//                                   "params": {"brand": eo.target.value}} )
//         })
//         .then( response => {
//             if (!response.ok) {
//                 throw new Error("fetch error " + response.status);
//             } else
//                 return response.json();
//         })
//         .then(data => {
//             setIDBrand(data.result);
//             let brand = data.result;
//             if(!(priceName === "Not selected")) {
//                 return fetch("http://api.valantis.store:40000/",
//                             { method: 'POST',
//                             headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) },
//                             body: JSON.stringify( { "action": "filter",
//                                                     "params": {"price": Number(priceName)}} )
//                 })
//                 .then( response => {
//                     if (!response.ok) {
//                         throw new Error("fetch error " + response.status);
//                     } else
//                     return response.json();
//                 })
//                 .then(data => {
//                     data.result = data.result.filter(element => {
//                         console.log(brand.includes('91a4056d-462d-4469-b97d-1d442d1e2fbc'), element, brand)
//                         return brand.includes(element)
//                     })
//                     dispatch( updateIDProductCheck(data.result) );
//                 })
//                 .catch( error => {
//                     setDataLoadState(3);
//                     setDataLoadError("HTTP error "+error.message);
//                 });
//         } else {
//             dispatch( updateIDProductCheck([...data.result, ...idPrice]) );
//         }
//     })
//     .catch( error => {
//             setDataLoadState(3);
//             setDataLoadError("HTTP error "+error.message);
//     });
//     } else {
//         setIDBrand([]);
//         dispatch( updateIDProductCheck([null, ...idPrice]) );
//     }
//     
// };
// 
// function filterPrice (eo) {
//     // dispatch( checkPrice(eo.target.value) );
//     setPriceName(eo.target.value);
// 
//     if(!(eo.target.value === "Not selected")) {
//         fetch("http://api.valantis.store:40000/",
//         { method: 'POST', 
//         headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) }, 
//         body: JSON.stringify( { "action": "filter",
//                                 "params": {"price": Number(eo.target.value)}} ) 
//     })
//     .then( response => {
//             if (!response.ok) {
//                 throw new Error("fetch error " + response.status);
//             } else
//                 return response.json();
//     })
//     .then(data => {
//             setIDPrice(data.result)
//             // dispatch( updateIDProductCheck(data.result) );
//             let price = data.result;
//             if(!(brandName === "All")) {
//                 return fetch("http://api.valantis.store:40000/",
//                 { method: 'POST', 
//                 headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) }, 
//                 body: JSON.stringify( { "action": "filter",
//                                         "params": {"brand": brandName}} )
//                 })
//                 .then( response => {
//                     if (!response.ok) {
//                         throw new Error("fetch error " + response.status);
//                     } else
//                     return response.json();
//                 })
//                 .then(data => {
//                     data.result = data.result.filter(element => {
//                         return price.includes(element)
//                     })
//                     dispatch( updateIDProductCheck(data.result) );
//                 })
//                 .catch( error => {
//                     setDataLoadState(3);
//                     setDataLoadError("HTTP error "+error.message);
//         });
//         } else {
//             dispatch( updateIDProductCheck([...data.result, ...idBrand]) );
//         }
//     })
//     .catch( error => {
//             setDataLoadState(3);
//             setDataLoadError("HTTP error "+error.message);
//     });
//     } else {
//         setIDPrice([])
//         dispatch( updateIDProductCheck([...idBrand, null]) );
//     }
// };