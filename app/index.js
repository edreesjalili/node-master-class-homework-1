// Dependencies
const http = require('http'),
  https = require('https'),
  config = require('./config'),
  url = require('url'),
  {
    StringDecoder
  } = require('string_decoder')

/*
 * Primary API Server
 */

// Instantiate the server objects
const httpServer = http.createServer(unifiedServer),
  httpsServer = https.createServer({
    key: config.https.key,
    cert: config.https.cert
  }, unifiedServer)

// Start the servers, and listen on the given ports
httpServer.listen(config.http.port, () => console.log(`The server is listening on port ${config.http.port}`))
httpsServer.listen(config.https.port, () => console.log(`The server is listening on port ${config.https.port}`))

// Define the handlers
const handlers = {
  hello: (data, callback) => {
    callback(200, {
      message: `Hello ${data.query.name || 'World'}`
    })
  },
  notFound: (data, callback) => {
    callback(404, {
      error: '404 Page Not Found'
    })
  }
}

// Define a request router
const router = {
  hello: handlers.hello
}

// All the server logic for both the http and https server

function unifiedServer(req, res) {

  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true)

  // Get the path
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  const query = parsedUrl.query

  // Get the HTTP Method
  const method = req.method.toLowerCase()

  // Get the headers as an object
  const headers = req.headers

  // Get the payload, if any
  let buffer = '';
  const decoder = new StringDecoder('utf-8')

  req.on('data', data => buffer += decoder.write(data))
  req.on('end', () => {
    buffer += decoder.end()

    // Decide which handler the request should go to. If the handler is not found, route to the not found handler
    const routeHandler = typeof (router[path]) !== 'undefined' ? router[path] : handlers.notFound

    // Construct the data object to send to the handler
    const data = {
      path,
      query,
      method,
      headers,
      payload: buffer
    }

    // Route the request to the specified handler
    routeHandler(data, (statusCode, payload) => {
      // Validate the arguments
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200
      payload = typeof (payload) === 'object' ? payload : {}

      // Stringify the payload
      const payloadString = JSON.stringify(payload, null, 2)

      // Set the headers and send the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
    })
  })
}