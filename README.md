# Loomo Mqtt Publisher

A nodejs server, enabling communication between the Loomo applications and the mobile applications.  
**Project for - CMP490/491 - Senior Design I/II**  
**Project Duration - September 2018-May 2019**  
**Collaborators - [Gehad Aboarab](https://github.com/gehad-aboarab), [Omar Sobhy](https://github.com/Svitkona/), [Mohammad Atallah](https://github.com/mhdatallah/)**  
### What is Loomo

[![Loomo Image](https://shop.segway.com/uk-en/347-large_default/segway-loomo.jpg)](https://loomo.com)

Loomo is a robot manufactured by Segway Robotics. It hosts a wide variety of sensors, such as ultrasonic, IR, camera, and motion sensors. It also contains an in-built Grid-Based navigation system, to allow it to move from one destination to another. Our senior capstone project aims to build an indoor autonomous navigation system, to allow the robot to guide users to their destinations, at the same time avoiding hitting any obstacles it may encounter on its journey. People can also ride the robot to their destination, if they do not feel like walking. Once the user has used the robot, they can dismiss it, and the robot will navigate back to its home autonomously.

### Significance of the project

The project was sponsored by a local company, and required us to implement the system for them. Certain use-cases of the system include:
* Guiding people in malls and metro stations to their destinations
* Guiding people in large offices to their destinations
* Giving tours and acting as a tour guide, in locations such as museums, conventions and exhibitions
* Guiding blind people to their destinations, by acting as a beacon and moving in such a way as to avoid obstacles from the person's path

## Sister Applications
This project is just one component of the system. To check out the entire system, other components must also be involved.

Github links to the other components:
* [Loomo Application](https://github.com/gehad-aboarab/LoomoApp)
* [Mobile Application](https://github.com/gehad-aboarab/MobileApp)
* [RPi Application (Not updated)](https://github.com/mhdatallah/cse491-rpi) : A script running on an external raspberry pi attached to the robot. We attached additional ultrasonic sensors on the robot to allow it to detect obstacles more accurately.

## Requirements

* [Node.js](https://nodejs.org/en/download/)
* An online mqtt broker 
> Note: [CloudMQTT](https://cloudmqtt.com/) was tested for this project
* [MongoDB](https://mongodb.com/)

## Installation
### Nodejs Project
1. Clone the repo by using the following command
``` bash
$ git clone https://github.com/hussu97/loomo-mqtt-publisher.git
$ cd loomo-mqtt-publisher
```
2. Install all the npm packages
``` bash
$ npm install
```
3. Start the nodejs server using
``` bash
$ npm start
```

### MongoDB Server
We used a local mongodb server for our project. If you would like to use our sample tables in your project, follow these steps:
1. Create a folder in the workspace directory called data. Create another folder inside that called db
``` bash
$ mkdir data
$ mkdir db
```
2. Type the following command to start the mongodb server, running on port **27017**
``` bash
$ mongod --dbpath=./data/db
```
3. Build the database from the previously saved instance in the dump folder
``` bash
$ mongorestore --dir=./dump/backup
```

## License
[GNUv3](https://github.com/hussu97/loomo-mqtt-publisher/blob/master/LICENSE)


