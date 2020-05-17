# Investments Tracker
An investment tracker app built using MERN stack. The web-app allows you to keep track of your Quest Trade investment transactions and provide real time update on Profits/Loss.   {Place architecture diagram here}

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Built With
MERN Stack
![MERN Stack](https://mail.google.com/mail/?tab=im&authuser=0)

* [React](https://reactjs.org) - The web framework used
* [Node/Express](https://expressjs.com) - Backend framework
* [Mongo DB](https://www.mongodb.com) - Database
* [Quest Trade](https://www.questrade.com/home) - Quest Trade API used to provide real time stocks information


### Prerequisites
What things you need to install the software and how to install them


- All the `code` required to get started
- Images of what it should look like

#### Clone

- Clone this repo to your local machine using `https://github.com/businessglitch/Investments-Tracker.git`

#### Setup
> move in to the project directory

```shell
$ cd Investments-Tracker
```

> create config.env file in config folder

```shell
$ cd config
$ touch config.env
```
place the following content in your config.env file
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://{username}:{password}@{database}-e9zhx.mongodb.net/investments?retryWrites=true&w=majority
QT_ACCESSTOKEN=https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token={refreshToken}
```
> update all the packages

```shell
$ brew update
```

> install server side dependencies

```shell
$ npm install
```

> install client side dependencies

```shell
$ cd client
$ npm install
```

> run the application
In the root directory
```shell
$ npm run dev
```
---

## Support

Reach out to me at one of the following places!

- Instagram at <a href="https://www.instagram.com/fahoodii_h/" target="_blank">`@fahoodii_h`</a>
- LinkedIn at <a href="https://www.linkedin.com/in/fahdhayat/" target="_blank">`Fahad Hayat`</a>
---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2015 © <a href="http://fvcproductions.com" target="_blank">FVCproductions</a>.