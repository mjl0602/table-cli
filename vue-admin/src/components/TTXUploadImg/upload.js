
import axios from 'axios'

function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

export default function(obj) {
  const files = obj.fileArr
  const promiseArr = []
  for (let i = 0; i < files.length; i++) {
    const upload = new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('token', obj.token)
      formData.append('file', files[i].raw)
      formData.append('key', 'course/' + createUniqueString())
      axios({ method: 'post', url: obj.url, data: formData, withCredentials: false, headers: { 'Content-Type': 'multipart/form-data' }}).then(
        res => {
          files[i].status = 'success'
          files[i].key = res.data.key
          resolve()
        },
        err => {
          const data = {
            error: err,
            file: files[i]
          }
          console.error(err)
          reject(data)
        }
      )
    })
    promiseArr.push(upload)
  }
  return Promise.all(promiseArr)
}
