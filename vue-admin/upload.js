// 上传build代码到服务器
const path = require('path')
const fs = require('fs')
const NodeSsh = require('node-ssh')
const ssh = new NodeSsh()
var archiver = require('archiver')

const pkg = require('./package.json')
const ora = require('ora')
const chalk = require('chalk')
const projectName = pkg.name
console.log(projectName)

function archiveDirectory(src = 'dist/', dest = `${__dirname}/${projectName}.zip`, format = 'zip', { archiverOptions = { zlib: { level: 9 }}, directoryData, directoryDestPath = false } = {}) {
  return new Promise((resolve, reject) => {
    const archive = archiver(format, archiverOptions)
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest) // 是指定文件，则删除
      console.log(chalk.green('删除本地压缩包') + '\n')
    }
    const output = fs.createWriteStream(dest)
    const spinner = ora('打包中...')
    spinner.start()
    archive.pipe(output)
    archive.directory(src, directoryDestPath, directoryData)
    archive.finalize()

    output.on('close', () => {
      console.log(chalk.green('打包成功') + '\n')
      spinner.stop()
      resolve(archive)
    })
    archive.on('error', (err) => {
      console.log(chalk.green('打包成功') + '\n')
      spinner.stop()
      reject(err)
    })
  })
}

const sshConfig = {
  host: '118.89.56.228',
  port: 6000,
  username: 'ubuntu',
  privateKey: 'id_rsa'
  // password: ''
}
const baseCwd = '/home/ubuntu/projects/www'

archiveDirectory().then(async() => {
  const spinner = ora('上传中...')
  spinner.start()
  await ssh.connect(sshConfig)
  console.log(chalk.green('连接成功'))
  await ssh.execCommand(`rm -rf ${projectName}*`, { cwd: baseCwd })
  console.log(chalk.green('删除服务器项目成功'))
  await ssh.putFile(path.join(__dirname, `${projectName}.zip`), `${baseCwd}/${projectName}.zip`)
  console.log(chalk.green('上传成功'))
  await ssh.execCommand(`mkdir ${projectName} && unzip ${projectName}.zip -d ./${projectName} && rm -rf ${projectName}.zip`, { cwd: baseCwd })
  console.log(chalk.green('解压并删除压缩包'))
  spinner.stop()
  process.exit(0)
})
