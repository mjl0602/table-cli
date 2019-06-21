module.exports = {
  env: 'sit',
  apiRoot: '/api/admin', // 'https://test.deepmedical.net.cn/huoshi/api/admin',
  fileUploadUrl: 'https://upload-z0.qiniup.com',
  imgPrefix: 'course/',
  staticToken: '',
  getImgPath: (val, t) => `http://testimg.deepmedical.net.cn/${val}${t ? ('-' + t) : ''}`
}

