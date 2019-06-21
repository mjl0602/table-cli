import router from '@/router'
import { getToken, setToken, removeToken, setTel, getTel } from '@/utils/auth'

import axios from '@/utils/axios'

const user = {
  state: {
    user: '',
    tel: getTel(),
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      if (token) {
        setToken(token)
      } else {
        removeToken()
      }
      state.token = token
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_TEL: (state, tel) => {
      state.tel = tel
      setTel(tel)
    }
  },

  actions: {
    // 用户名登录
    Login({ commit }, userInfo) {
      const tel = userInfo.tel.trim()
      return new Promise((resolve, reject) => {
        axios.post('login', { tel, password: userInfo.password }).then(data => {
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    async GetUserInfo({ commit }) {
      // 如果需要获取用户信息时用这个
      return new Promise((resolve, reject) => {
        axios.get('userInfo').then(res => {
          commit('SET_TEL', res.user ? res.user.tel : '')
          // res.roles = [res.role] || ['admin'][]
          const { role = 'admin' } = res.user
          commit('SET_ROLES', [role])
          resolve({ roles: [role] })
        }, err => {
          reject(err)
        })
      })
      // commit('SET_ROLES', ['enterprise'])
      // return Promise.resolve({ roles: ['enterprise'] })
      // commit('SET_ROLES', ['admin'])
      // return Promise.resolve({ roles: ['admin'] })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    LogOut({ commit }, { redirect } = {}) {
      console.log('redirect', redirect)
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        // commit('SET_ROLES', [])
        console.log()
        router.push({ path: '/login', query: { redirect }})
        // location.reload()
        resolve()
      })
    }
  }
}

export default user
