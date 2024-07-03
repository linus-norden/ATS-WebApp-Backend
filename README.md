# Node.js backend of ATS prototype

## Setup
Make sure to install the dependencies:
## npm
npm install

# Development Server
Configure your environment.
Default env is localhost and port 3000
(on `http://localhost:3000`)

## Backend (this project)
Clone the node.js based backend project and configure it.

Start the backend connecting to the database and providing a rest API at http://localhost:3001. 

Start the backend with

node ./index.js

Example request to test it: http://localhost:3001/api/raum_bereich/15

## Frontend (https://github.com/linus-norden/ATS-WebApp-Frontend)
Start is done with:

npm run dev

Default (see above) will be on `http://localhost:3000`

## All Repositories needed to build ATS:
https://github.com/linus-norden/mosquitto-UNIX-time

https://github.com/linus-norden/ATS-ESP32-BLEScan

https://github.com/linus-norden/ATS-ESP32-WiFiMesh

https://github.com/linus-norden/ATS-WebApp-Frontend

https://github.com/linus-norden/ATS-WebApp-Backend

https://github.com/linus-norden/ATS-Python-Microservice

https://github.com/linus-norden/ATS-SQL-DB
