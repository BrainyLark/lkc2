# LKC Crowdsourcing platform

This is a crowdsourcing system dedicated to the LKC.

## Getting Started

### Prerequisities

All the installers can be found on official websites
1) PostgreSQL
2) MongoDB
3) NodeJS
```sh
$ sudo apt-get -y update
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

### Installing

1. Clone the repository
```sh
$ git clone https://github.com/BrainyLark/lkc2.git
```

2. Install the main components with global flag
```sh
$ npm install -g angular-cli, nodemon
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
```
$ ng serve
```

5. Run server by typing (in root folder)
```
$ nodemon
```
## Todos

 - Multilingual adapter
 - Multilingual task generation
 - Language discriminated task runs
 - Dynamic way of solving task run	
 - Shift GUI into angular material
 - Remove unnecessary static resources
 - Modification GUI design
 - Validation GUI design

## Possible considerations
 - Vertice run update
 - Modification generation might be scheduled

## Built With

* [Angular] - HTML enhanced for web apps!
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - server side javascript
* [Express] - fast node.js network app framework [@tjholowaychuk]


## Authors

* **Erdenebileg Byambadorj** - *Back&Front* - [BrainyLark](https://github.com/BrainyLark)
* **Javkhlan Batsaikhan** - *Front* - [bjavkhlan](https://github.com/bjavkhlan)
* **Enkhsanaa Natsagdorj** - *Back&Front* [enkhsanaa](https://github.com/enkhsanaa)
* **Amarsanaa Ganbold** - *Front* [amarsanaa](https://github.com/amarsanaag)


## License

This project is licensed under the MIT License

