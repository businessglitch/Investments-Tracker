import React, {useContext, useEffect, useState} from 'react'
import {GlobalContext} from '../context/GlobalState';


export const  IncomeExpense =  (props) => {
    const {transactions, getStocksInfo, stocks} = useContext(GlobalContext);
    let all_items = {}

    useEffect(() => {
        getInfo()
    }, [transactions, stocks])

    useEffect(() => {
        console.log('called render')
        _render_total()
    }, [stocks])

    const calculateTotal = () => {
        let total = 0
        if(stocks.length > 0) {
            stocks.forEach(s => {
                const arr = transactions.filter(t => (s.symbolId === t.symbolID))
                let acc = 0
                arr.forEach(t => {
                    acc += (s.lastTradePrice * t.quantity) - t.amount
                })
                all_items[s.symbolId] = acc;
            })
            
            for(var key in all_items) {
                total += all_items[key];
            }
        }
        return Number(total.toFixed(2));
    }

    const getInfo = async () => {
        if(transactions.length > 0 && stocks.length < 1) {
            const symbols = [...new Set(transactions.map(x => x.symbolID))]
            getStocksInfo(symbols)
        }
        calculateTotal()
        
    }
    const _render_total = () => {
       const total = calculateTotal()
        if(total >= 0) {
            return (
                <div>
                    <h4>Profit</h4>
                    <p id='money-plus' className="money plus">+${total}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <h4>Loss</h4>
                    <p id='money-minus' className="money minus">-${total}</p>
                </div>
            );
        }
    }
    
    return (
        <div className='inc-exp-container'>
            {_render_total()}
        </div>
    )
}

