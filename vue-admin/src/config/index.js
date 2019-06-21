const ENV = process.env.NODE_ENV
// console.log(ENV)
const config = require(`./${ENV}.js`)
// console.log('config', config)
export default config
