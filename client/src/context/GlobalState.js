import React, {createContext, useReducer} from 'react';
import AppReducer from './AppReducer';

const initialState = {
    transactions: [],
    error: null,
    loading: true,
    stocks: []
}


// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({children}) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    console.log('state', state)

    // Actions
    const getStocksInfo =  async (symbolIds) => {
        console.log('symbolIDs', symbolIds)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(symbolIds)
        };

       await  fetch('/api/v1/stocks', requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                dispatch({
                    type:'GET_STOCKS',
                    payload:data.data
                }); 
            }
        });
           
      
    }

    const  getTransactions = async () => {
        try {
            fetch('/api/v1/transactions')
                .then(res => res.json())
                .then(data => {
                    if(data.success) {
                        dispatch({
                            type:'GET_TRANSACTIONS',
                            payload:data.data
                        });
                    }
                });

        } catch (error) {
            dispatch({
                type:'TRANSACTIONS_ERROR',
                payload: error.response.data.error
            });
        }
    }

    const deleteTransaction = async (id, symbol) => {
        try {
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id})
            };

            fetch(`/api/v1/transactions/${id}`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const count = state.transactions.filter((obj) => obj.text === symbol).length;
                        if(count <= 1) {
                            dispatch({
                                type:'DELETE_STOCK',
                                payload:symbol
                            });
                        }

                        dispatch({
                            type:'DELETE_TRANSACTION',
                            payload:id
                        });
                    }
                });
        } catch (error) {
            
        }
       
    }
    const addTransaction = async (payload) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            };

            fetch('/api/v1/transactions', requestOptions)
                .then(res => res.json())
                .then(data => {

                    if (data.success) {
                        dispatch({
                            type:'ADD_TRANSACTION',
                            payload: data.data
                        });
                    } else {
                        alert(data.error);
                    }
                });

        } catch (error) {
            dispatch({
                type:'TRANSACTIONS_ERROR',
                payload: error.response.data.error
            });
        }
    }

    return (
        <GlobalContext.Provider value={{
            transactions: state.transactions,
            error: state.error,
            loading:state.loading,
            stocks: state.stocks,
            deleteTransaction,
            addTransaction,
            getTransactions,
            getStocksInfo
            }}>
            {children}
        </GlobalContext.Provider>
    );
}