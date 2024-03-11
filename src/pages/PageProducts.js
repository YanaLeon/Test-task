import React, { useEffect } from 'react';

import Main from '../components/Main';
import Filter from '../components/Filter';


import { useNavigate } from "react-router-dom";

export const PageProducts = () => {
    let navigate = useNavigate();
    let uri = "/Test-task/";

    useEffect(() => {

        navigate(uri);
        navigate("/:1");

    }, []);

          
  return (
    <Filter/>
  );
    
};