<template>
  <div class="app-container">
    <el-header class="common-head">
      <el-input v-model="query.searchString" placeholder="请输入内容" class="input-with-select" @keyup.enter.native="getData">
        <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索类型">
          <el-option label="企业编号" :value="0" />
          <el-option label="企业名称" :value="1" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData" />
      </el-input>
      <el-button type="primary" @click="addData">
        新 增
      </el-button>
      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="企业编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="企业名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="企业账户" align="center">
          <template slot-scope="scope">
            {{ scope.row.user?scope.row.user.tel:'' }}
          </template>
        </el-table-column>
        <el-table-column label="注册人数" align="center">
          <template slot-scope="scope">
            {{ scope.row.registeredPeopleNum }}
          </template>
        </el-table-column>
        <el-table-column label="联系人(电话)" align="center">
          <template slot-scope="scope">
            {{ `${scope.row.contactName} (${scope.row.contactTel})` }}
          </template>
        </el-table-column>
        <el-table-column label="账号有效期" align="center">
          <template slot-scope="scope">
            {{ scope.row.expiredAt?parseTime(scope.row.expiredAt,'date'):"暂未设置" }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <!-- <el-button type="danger" size="mini" @click="delData(scope.row)">
              删 除
            </el-button> -->
            <el-button type="primary" size="mini" @click="editData(scope.row)">
              编 辑
            </el-button>
            <el-button type="info" size="mini" @click="scan(scope.row)">
              查 看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>

    <!-- 编辑 -->
    <el-dialog :visible.sync="addDialogVisible" :title="title" :before-close="handleClose">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="150px"
        style="width:80%; min-width:400px; margin-left:50px;"
      >
        <el-form-item v-if="seeInfo" label="企业编号">
          <span>{{ formData.id }}</span>
          <!-- <el-input v-model="formData.id" placeholder="请输入企业编号" minlength="11" maxlength="11" /> -->
        </el-form-item>
        <el-form-item v-else label="企业手机登录号" prop="tel">
          <el-input v-model="formData.tel" placeholder="请输入手机登录号" minlength="11" maxlength="11" />
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <span v-if="seeInfo">{{ formData.name }}</span>
          <el-input v-else v-model="formData.name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="注册人数" prop="registeredPeopleNum">
          <span v-if="seeInfo">{{ formData.registeredPeopleNum }}</span>

          <el-input v-else v-model="formData.registeredPeopleNum" placeholder="请输入注册人数" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <span v-if="seeInfo">{{ formData.contactName }}</span>

          <el-input v-else v-model="formData.contactName" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="电话">
          <span v-if="seeInfo">{{ formData.contactTel }}</span>

          <el-input v-else v-model="formData.contactTel" placeholder="请输入电话" minlength="11" maxlength="11" />
        </el-form-item>
        <el-form-item label="账号有效期" prop="expiredAt">
          <span v-if="seeInfo">{{ parseTime(formData.expiredAt) }}</span>
          <el-date-picker
            v-else
            v-model="formData.expiredAt"
            style="width:250px"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="企业执照图片" prop="license">
          <ttx-upload-img ref="license" v-model="formData.license" :editable="!seeInfo" :limit="1" :auto-upload="false" />
        </el-form-item>
        <div class="tip">
          注：默认密码为 123123
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="info" @click="addDialogVisible = false">取消</el-button>

      </span>
    </el-dialog>
  </div>
</template>
<script>
import { validTel } from '@/utils/validate'
import { parseTime } from '@/utils'
import Main from '../mixins'
export default {
  mixins: [Main],
  data() {
    return {
      title: '',
      seeInfo: false, // 是否为查看
      query: {
        filterType: 0,
        searchString: ''
      },
      objStr: '企业管理员',
      defaultData: {
        id: '',
        tel: '',
        name: '',
        registeredPeopleNum: '',
        contactTel: '',
        contactName: '',
        expiredAt: '',
        license: []
      },
      formData: {

      },
      rules: {
        tel: [{ required: true, validator: validTel, trigger: 'blur' }],
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        registeredPeopleNum: [{ required: true, validator: this.validInteger, trigger: 'blur' }],
        // contactTel: [{ required: true, validator: validTel, trigger: 'blur' }],
        contactName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        expiredAt: [{ required: true, message: '请输入账号有效期', trigger: 'blur' }],
        license: [{ required: true, message: '请上传企业执照图片', trigger: 'change' }]
      }
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        if (this.$refs.ruleForm) {
          this.formData = Object.assign({}, this.defaultData)
          this.$refs.ruleForm.resetFields()
        }
        this.seeInfo = false
      }
    }
  },
  mounted() {
    this.formData = Object.assign({}, this.defaultData)
    console.log(this.formData)
    this.getData()
  },
  methods: {
    parseTime,
    getData(type) {
      this.get({
        url: 'enterprise',
        params: this.query
      })
    },
    editData(row) {
      const { name, id, expiredAt, contactTel, contactName, registeredPeopleNum, license, user } = Object.assign({}, row)
      this.isNew = false
      this.title = '编辑企业管理员'
      this.addDialogVisible = true
      this.seeInfo = false
      this.formData = { name, id, expiredAt, contactTel, contactName, registeredPeopleNum, license: [license], tel: user ? user.tel : '' }
    },
    addData() {
      // console.log(validTel)
      this.isNew = true
      this.title = '新增企业管理员'
      this.addDialogVisible = true
      this.seeInfo = false
      this.formData = Object.assign({}, this.defaultData)
    },
    scan(row) {
      this.seeInfo = true
      const { name, id, expiredAt, contactTel, contactName, registeredPeopleNum, license, user } = Object.assign({}, row)
      this.title = '查看企业管理员'
      this.addDialogVisible = true
      this.formData = { name, id, expiredAt, contactTel, contactName, registeredPeopleNum, license: [license], tel: user ? user.tel : '' }
    },
    // delData(row) {
    //   this.del('enterprise/' + row.id)
    // },
    async submitForm() {
      await this.$refs.license.submitUpload()
      const data = Object.assign({}, this.formData)
      data.license = data.license[0]
      this.submit('enterprise', data)
    }
  }
}
</script>
<style lang="less" scoped>

.tip{
  color:red;
}

</style>
