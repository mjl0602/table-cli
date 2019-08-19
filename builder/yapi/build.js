const { createfile} = require('./assets/utils/operate-file.js')

function onCommand(mockPath,projectPath){
  createfile(mockPath,projectPath)
}
module.exports = {
  onCommand,
};