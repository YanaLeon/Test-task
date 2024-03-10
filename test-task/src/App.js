import React from 'react';
import { Provider } from 'react-redux';

import { store } from './redux/store'

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';

import { PagesRouter } from './routes/PagesRouter';


export function App() {

  return (
    <BrowserRouter>
          <Provider store={store}>
            <div className='wrapper'>
            <Header />
            <PagesRouter />
            <Footer />
            </div>
          </Provider>
    </BrowserRouter>
  );
}