import React, {useContext} from 'react'
import {GlobalContext} from '../context/GlobalState';

export const Transaction = ({transaction}) => {
    const {deleteTransaction} = useContext(GlobalContext);

    const sign = (transaction.amount) < 0 ? '-' : '+';
    const transactionClass = (sign === '-') ? 'minus' : 'plus' 

    return (
        <li className={transactionClass}>
            {transaction.text} <span>{sign} ${Math.abs(transaction.amount)}</span><button onClick={() => deleteTransaction(transaction._id, transaction.text)} className="delete-btn">x</button>
        </li>
    )
}
