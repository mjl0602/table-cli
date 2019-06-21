module.exports = {
  env: 'development',
  apiRoot: '/api/admin',
  imgPrefix: 'course/',
  fileUploadUrl: 'https://up-z0.qiniup.com',
  staticToken: '5wJokfZBh2PNKBijtCrbb1I-Fz5KiGutzdUcgu5y:nWlAtSFNOgJPuwU7H0WW03WxRQY=:eyJzY29wZSI6InRlc3QiLCJkZWFkbGluZSI6MTU1OTU1MzczOX0=',
  getImgPath: (val, t) => `http://testimg.deepmedical.net.cn/${val}${t ? ('-' + t) : ''}`
}
