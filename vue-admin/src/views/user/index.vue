<template>
  <div class="app-container user">
    <el-form :model="detail" class="main" label-width="150px">
      <el-form-item label="企业编号：">
        {{ detail.id }}
      </el-form-item>
      <el-form-item label="企业名称：">
        {{ detail.name }}
      </el-form-item>
      <el-form-item label="注册人数：">
        {{ detail.registeredPeopleNum }}
      </el-form-item>
      <el-form-item label="企业绑定联系人：">
        {{ detail.contactName }}
      </el-form-item>
      <el-form-item label="企业绑定联系号码：">
        {{ detail.contactTel }}
      </el-form-item>
      <el-form-item label="账号有效期：">
        {{ detail.expiredAt?parseTime(detail.expiredAt):"暂未设置" }}
      </el-form-item>
      <el-form-item label="企业营业执照：">
        <img v-preview :src="$cfg.getImgPath(detail.license)" width="80" height="80">
      </el-form-item>
      <el-form-item label="备注：" style="color: red">
        续费请联系客服 400-000-000
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      detail: {}
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    parseTime,
    async getData() {
      try {
        const res = await this.$http.get('enterpriseAdmin/self')
        this.detail = res
      } catch {
        console.log('user error')
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .user{
    margin-left: 100px;
  }
</style>
