# Mongolian LKC

Нутгийн Мэдлэгийн цөмийг олны хүчээр үүсгэх MnLKC систем

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

 - Almost everything

## Built With

* [Angular] - HTML enhanced for web apps!
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - server side javascript
* [Express] - fast node.js network app framework [@tjholowaychuk]


## Authors

* **Erdenebileg** - *Initial work* - [BrainyLark](https://github.com/BrainyLark)
* **Javkhlan Batsaikhan** - *Initial work* - [bjavkhlan](https://github.com/bjavkhlan)
* **Enkhsanaa Natsagdorj** - [enkhsanaa](https://github.com/enkhsanaa)


## License

This project is licensed under the MIT License

