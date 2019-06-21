module.exports = {
  env: 'production',
  apiRoot: '/api/admin',
  fileUploadUrl: 'https://up-z2.qiniup.com',
  imgPrefix: 'course/',
  staticToken: '5wJokfZBh2PNKBijtCrbb1I-Fz5KiGutzdUcgu5y:ivdvA6Q-r-H8ONh4ZeBr0myiYHY=:eyJzY29wZSI6InRlc3QiLCJkZWFkbGluZSI6MTU1OTg4NzUxN30=',
  getImgPath: (val, t) => `https://static.deepmedical.net.cn/${val}${t ? ('-' + t) : ''}`
}
