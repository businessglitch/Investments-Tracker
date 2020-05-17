const RFToken = require('../models/Token');
const request=require('request');

class RefreshToken {
    constructor(token) {
        this.token = token
    }

    __str__() {
        return this.token
    }

    __repr__() { 
        return `<RefreshToken ${this.token}>`
    }

    load = async () => {
        try {
            const refresh_tokens = await RFToken.find()

            return refresh_tokens[0].value

        } catch (error) {
            console.log(error)
        }
    }
      
    dump = async (refresh_token) => {
        try {
            const current_token = await RFToken.find()
            const query = { _id: current_token[0]._id };

            await RFToken.updateOne(query, { value: refresh_token }, (err) => {
                if(err) {
                    console.log('Database Error: ', err)
                    return false;
                } 
                return true
            })
        } catch (error) {
            console.log('Server Error: ', error)
            return false
        }
    }     
}

class AccessToken {

    constructor(api_server, token, token_type, refresh_token, expires=1800) {
        this.api_server = api_server
        this.token = token
        this.type = token_type
        this.refresh_token = new RefreshToken(refresh_token)
        this.expires = Date.now() + expires*1000
    }

    __str__(){
        return `${this.type} ${this.token}`
    }

    __repr__() {
        const value = (this.is_expires()) ? 'invalid' : 'valid'
        return `<AccessToken ${this.token}: ${value}>`;
    }
  
    is_expired = () => {
        return (this.expires > (Date.now() + 60*1000)) ? false : true
    }
}

class QuestradeWrapper {
    api_version = 'v1'
    auth_endpoint_template = 'https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token='
    access_token = undefined

    constructor() {
        this.rt = new RefreshToken()
        this.setRefreshToken().then( async () => {
            await this._auth()
        })
    }
   
    setRefreshToken = async () => {
        this.refresh_token =  await this.rt.load()
    }

    _auth = () => {
        console.log('Auth - Exchanging refresh token for new access token')
        const auth_endpoint = this.auth_endpoint_template + this.refresh_token
        
        return new Promise((resolve, reject) => { 
            request.get(auth_endpoint, (err,res,body) => {
                console.log('response Code',  res.statusCode)
                if(err || res.statusCode === 400) {
                    console.log(err)
                    reject(false)
                }

                if(res.statusCode === 200 ) {
                    const data = JSON.parse(body);

                    this.access_token = new AccessToken(data['api_server'], data['access_token'], data['token_type'], data['refresh_token'], data['expires_in'])
                    this.refresh_token = this.access_token.refresh_token
                    this.rt.dump(this.refresh_token.token)
                    resolve(true)
                }
            });
        });
    }
    
    // Get's current user's account information
    accounts = async () => {
        console.log('API Request - Accounts')
        const endpoint = this._generate_endpoint('/accounts')
        const content = await this._make_request(endpoint)

        return content["accounts"]

    }

    market_quotes = async (symbols) => {
        console.log('API Request - Market Quotes')
        const endpoint = this._generate_endpoint('/markets/quotes?')
        const content = await this._make_request(`${endpoint}ids=${symbols.join(',')}`)
        
        return content
    }

    symbols = async (symbols) => {
        console.log('API Request - Symbols')
        const endpoint = this._generate_endpoint('/symbols?')
        const content = await this._make_request(`${endpoint}names=${symbols.join(',')}`)
        
        return content
    }
   

    // Helper function to make requests
    //@endpoint = url
    _make_request = async (endpoint) =>  {
        if (!this._is_access_token_valid()) {
            await this._auth()
        }
    
        return new Promise((resolve, reject) => {
            request.get({ url: endpoint,  headers:{'Authorization': (this.access_token).__str__() }}, function (err, res, body) {
                if (res.statusCode!= 200) {
                    console.log(res.statusCode, res.content)
                    console.log('error', err)
                    reject(false)
                }

                return resolve(JSON.parse(body))
            });
        
        });
       
    }
        
    _generate_endpoint = (path) => {

        if (!this._is_access_token_valid()) {
            this._auth().then(() => {
                return `${this.access_token.api_server}${this.api_version}${path}` 
            });
        } else {
            return `${this.access_token.api_server}${this.api_version}${path}` 
        }
    }
    
    _is_access_token_valid = () => {
        if (this.access_token === undefined) {
            return false
        }    
        else {
            return (this.access_token.is_expired()) ? false : true
        }
    }
}

// module.exports = QuestradeWrapper
const QTW = new QuestradeWrapper()
exports.QTW  = QTW;