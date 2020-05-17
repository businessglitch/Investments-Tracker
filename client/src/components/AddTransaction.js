import React, {useState, useContext} from 'react'
import {GlobalContext} from '../context/GlobalState';

export const AddTransaction = () => {
    const {addTransaction} = useContext(GlobalContext);
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [symbol, setSymbol] = useState('');

    const onSubmit = (e) => {
        e.preventDefault()
        let transaction = {
            text: symbol.toUpperCase(),
            quantity: +quantity,
            amount: (+price)*(+quantity),
            price: +price
        }

        addTransaction(transaction);
    }
    return (
        <>
            <h3>Add new transactions</h3>
            <form onSubmit = {onSubmit}>
                <div className="form-control">
                    <label htmlFor="text">Stock Symbol</label>
                    <input type="text" value={symbol} onChange={(e) => {setSymbol(e.target.value)}} placeholder="Enter the stock symbol..." />
                </div>
                <div className="form-control">
                    <label htmlFor="Amount">Quantity</label>
                    <input type="number"  value={quantity} onChange={(e) => {setQuantity(e.target.value)}} placeholder={0} />

                    <label htmlFor="Amount">Price per share </label>
                    <input type="number"  value={price} onChange={(e) => {setPrice(e.target.value)}} placeholder={0} />
                </div>
                <button className="btn"> Add Transaction</button>
            </form>
        </>
    )
}
