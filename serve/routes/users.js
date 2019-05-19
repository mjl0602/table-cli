const router = require('koa-router')({
  prefix: '/admin'
})

router.post('/login', function (ctx, next) {
  console.log('====登陆====')
  ctx.session.uid = parseInt(Math.random()*10)
  return ctx.success({msg:'登陆成功！',data:{
    username: 'admin',
    token:'admin-token'
  }})
})

router.get('/userInfo', function (ctx, next) {
  console.log('====info====',ctx.session.uid)
  return ctx.success({
    msg:'登陆成功！',
    data:{
      username: '超级管理员',
      roles: ['admin'],
      uid: ctx.session.uid
    }
  })
})

module.exports = router
