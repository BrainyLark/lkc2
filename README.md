# LKC Crowdsourcing platform

This document provides installation instructions and other additional information about a crowdsourcing system dedicated to the Local Knowledge Core (LKC). 

## Getting Started

### Prerequisities

All the installers can be found on official websites and follow separate installation guide for your server environment. Following shell commands give you a very quick overview as example installation in Ubuntu 16.04 LTS.

1. MongoDB (community edition)
```sh
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
```

2. NodeJS

```sh
$ sudo apt-get -y update
$ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

3. PostgreSQL
```sh
$ sudo apt-get update
$ sudo apt-get install postgresql postgresql-contrib
```

### Installation guideline

1. Clone the repository
```sh
$ git clone https://github.com/BrainyLark/lkc2.git
```

2. Install the main components with global flag
```sh
$ npm install -g @angular/cli, nodemon
```

3. Install the dependencies

```sh
$ npm install
$ cd angular-src
$ npm install
```

or in short~
```sh
$ npm i && cd angular-src && npm i
```

4. Run client by typing (in angular-src folder)
For development purposes, please run the following command. This will create an Angular instance at localhost:4200.
```sh
$ ng serve
```
For production purposes, please run the following command. This command will build angular application in `angular-src/dist` folder.
```sh
$ ng build -prod
```

5. Run server by typing (in root folder)
```sh
$ nodemon
```
or 

If you run the application as a service, you can install [`forever`](https://www.npmjs.com/package/forever) module which is a simple CLI tool for ensuring that a given script runs continuously. 
```sh
$ [sudo] npm install forever -g
$ cd /path/to/your/project
$ [sudo] npm install forever-monitor
$ forever start app.js
```

### Running application in port 80
If you run application in HTTP port 80, you can easily configure it with the command below.
```sh
$ sudo apt-get install libcap2-bin
$ sudo setcap cap_net_bind_service=+ep /path/to/node
```

### Configure API host
Angular app uses API host configuration named `apiRoot` in [`angular-src/src/app/config.ts`](angular-src/src/app/config.ts). This must be a URL of the LKC API running on a server. If the Angular app runs in the same server of LKC API, this host could be configured as its domain name/IP address. If the app is served from a different server, please set the correct host name for the configuration to resolve potential domain name issues as well as CORS headers following next optional step.

#### [optional] Allow Cross-Origin Resource Sharing (CORS)
If your LKC API works (`api` folder) in other domain add additional HTTP header that allows CORS. In [`app.js`](app.js), uncomment/edit/add relevant lines in the code as the following example.
```javascript
res.setHeader('Access-Control-Allow-Origin', 'http://lkc.num.edu.mn/')
```

## Built With

* [Angular] - front end web application
* [Angular Material] - UI components for modern web apps
* [NodeJS] - server side javascript application
* [Express] - fast node.js web app framework


## Credits

* **Erdenebileg Byambadorj** - Full stack - [BrainyLark](https://github.com/BrainyLark)
* **Javkhlan Batsaikhan** - Front end - [bjavkhlan](https://github.com/bjavkhlan)
* **Enkhsanaa Natsagdorj** - Full stack - [enkhsanaa](https://github.com/enkhsanaa)
* **Amarsanaa Ganbold** - Full stack - [amarsanaa](https://github.com/amarsanaag)


## License

This project is licensed under the MIT License
