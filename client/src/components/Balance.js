import React, {useContext} from 'react'
import {GlobalContext} from '../context/GlobalState';

export const Balance = (props)  => {
    const {transactions} = useContext(GlobalContext);
    let total = 0
    
    transactions.forEach(transaction => {
        total += (transaction.amount);
    });

    return (
        <>
            <h4>Total invested</h4>
            <h1 id="balance"> ${total.toFixed(2)} </h1>
        </>
    )
}




