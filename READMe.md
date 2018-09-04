# Building a RESTful API Homework 1

A simple REST server implementation.

## Setup

A cert.pem and key.pem are required in the `app/https/` folder for the application to run.
Configure the `app/config.js` folder for your needs otherwise it is fine the way it is.

## Starting the applcation

From the `app/` directory execute

`node index.js`

to get the application running. Different environment configration can be set by prepending

`NODE_ENV=<environment>`

to the execution command

i.e `NODE_ENV=production node index.js`

## Valid Environment Configrations

1. `production`
2. `development`

## Routes

1. /hello
   - Returns a JSON Object containing a message
   - **Valid Query Parameters**
     - name: Customizes the returned hello message
2. All other routes lead to a 404 page