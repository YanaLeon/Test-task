import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Main from '../components/Main';
import { PageProducts } from '../pages/PageProducts';
import Filter from '../components/Filter';

export const PagesRouter = () => {
          
    return (
          <Routes>
            <Route path="/" element={<PageProducts/>} >
                <Route path="/:clid" element={<Main/>}/>
            </Route>
          </Routes>
    );
    
};