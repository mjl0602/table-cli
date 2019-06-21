<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="换肤" effect="dark" placement="bottom">
          <theme-picker class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <svg-icon icon-class="admin" style="width:30px;height:30px;" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span v-popover:popover style="display:block;" @click="changePass">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码 -->
    <el-popover

      ref="popover"
      v-model="changeVisible"
      placement="right"
      width="300"
    >
      <el-form ref="changePass" :rules="rules" :model="user" auto-complete="on" label-width="80px" label-position="left">
        <el-form-item prop="tel" label="账号">
          <el-input
            v-model="user.tel"
            prefix-icon="el-icon-user"
            placeholder="用户名"
            name="tel"
            type="text"
            disabled
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item label="旧密码" prop="password">
          <el-input
            v-model="user.password"
            prefix-icon="el-icon-password"
            type="password"
            placeholder="请输入旧密码"
            name="password"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="user.newPassword"
            prefix-icon="el-icon-password"
            type="password"
            placeholder="请输入新密码"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleChange"
          />
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click="handleChange">
          修改
        </el-button>
      </el-form>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import ThemePicker from '@/components/ThemePicker'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    ThemePicker,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device',
      'tel'
    ])
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    return {
      changeVisible: false,
      loading: false,
      user: {
        tel: '',
        password: '',
        newPassword: ''
      },
      rules: {
        password: [{ required: true, message: '请输入旧密码', triggle: 'blur' }],
        newPassword: [{ required: true, validator: validatePassword, triggle: 'blur' }]
      }
    }
  },
  watch: {
    changeVisible(val) {
      if (!val) {
        this.user = {
          tel: '',
          password: '',
          newPassword: ''
        }
        this.$refs.changePass.resetFields()
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut', { redirect: this.$route.fullPath }).then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    changePass() {
      this.user.tel = this.tel
    },

    handleChange() {
      this.$refs.changePass.validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await this.$http.post('modify', this.user)
          this.loading = false
          if (res) {
            this.loading = false
            this.$notify.success('修改成功！')
            this.changeVisible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
