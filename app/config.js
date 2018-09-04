const path = require('path'),
  {
    readFileSync
  } = require('fs')

/*
 *  Create and export configuration variables
 */

// Read SSL cert files
const key = readFileSync(path.join(__dirname, 'https', 'key.pem')),
  cert = readFileSync(path.join(__dirname, 'https', 'cert.pem'))

// Valid environment configurations
const environments = {
  development: {
    http: {
      port: 3000,
    },
    https: {
      port: 3001,
      key,
      cert
    },
    envName: 'Development'
  },
  production: {
    http: {
      port: 5000,
    },
    https: {
      port: 5001,
      key,
      cert
    },
    envName: 'Production'
  }
}

// Determine which environment was passed as a command line argument
const env = process.env.NODE_ENV
const currentEnv = typeof (env) === 'string' ? environments[env.toLowerCase()] : environments.development

// Export the environment if valid otherwise export the development environment
module.exports = currentEnv !== undefined ? currentEnv : environments.development