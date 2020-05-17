import React from 'react';
import {Header}from './components/Header.js';
import {Balance} from './components/Balance.js';
import {IncomeExpense} from './components/IncomeExpense';
import {TransactionList} from './components/TransactionList';
import {AddTransaction} from './components/AddTransaction';

import {GlobalProvider} from './context/GlobalState'


import './App.css';


function App() {
  return (
    <GlobalProvider >
      <Header/>
      <div className="container">
        <TransactionList/>
      </div>
      <div className="container">
        <Balance />
        <IncomeExpense/>
       
        <AddTransaction />
      </div>
    </GlobalProvider>
  );
}

export default App;
