export default (state, action) => {
    switch(action.type) {
        case 'DELETE_STOCK':
            console.log('payload', action.payload)
            console.log('filtered', state.stocks.filter(stock => stock.symbol !== action.payload))
            return {
                ...state,
                stocks: state.stocks.filter(stock => stock.symbol !== action.payload)
            }

        case 'GET_STOCKS':
            return {
                ...state,
                stocks: action.payload
            }
        case 'TRANSACTIONS_ERROR':
            return {
                ...state,
                error: action.payload

            }

        case 'GET_TRANSACTIONS':
            return {
                ...state,
                transactions: action.payload,
                loading: false
            }

        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
            }
        case 'ADD_TRANSACTION':
            console.log(action.payload)
            return {
                ...state,
                transactions: [...state.transactions, action.payload]
            }
        default:
            return state
    }
}