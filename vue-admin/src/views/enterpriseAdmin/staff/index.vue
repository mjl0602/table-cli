<template>
  <div class="app-container">
    <el-header class="common-head">
      <el-input v-model="query.searchString" placeholder="员工编号/姓名" class="input-with-select" @keyup.enter.native="getData">
        <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索类型">
          <el-option label="员工编号" :value="0" />
          <el-option label="员工姓名" :value="1" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData" />
      </el-input>
      <el-select v-model="query.department" clearable placeholder="请选择所属部门" @change="getData">
        <el-option
          v-for="(item,i) in partList"
          :key="i"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-button type="primary" @click="addData">
        新 增
      </el-button>
      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="员工编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="员工姓名" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="员工手机号" align="center">
          <template slot-scope="scope">
            {{ scope.row.tel }}
          </template>
        </el-table-column>
        <el-table-column label="员工所属部门" align="center">
          <template slot-scope="scope">
            {{ scope.row.department }}
          </template>
        </el-table-column>
        <el-table-column label="累计学分" align="center">
          <template slot-scope="scope">
            {{ scope.row.credit || 0 }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <!-- <el-button type="danger" size="small" @click="delData(scope.row)">
              删除
            </el-button> -->
            <el-button type="primary" size="small" @click="editData(scope.row)">
              编辑
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
    <el-dialog :visible.sync="addDialogVisible" :before-close="handleClose" :title="dialogTitle">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="formData.name" place-holder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="员工手机号" prop="tel">
          <el-input v-model="formData.tel" place-holder="请输入员工手机号" minlength="11" maxlength="11" />
        </el-form-item>
        <el-form-item label="员工所属部门" prop="department">
          <el-select v-model="formData.department" clearable placeholder="请选择所属部门">
            <el-option
              v-for="(item,i) in partList"
              :key="i"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input value="123123" disabled="" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="info" @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import Main from '../../mixins'
export default {
  mixins: [Main],
  data() {
    return {
      objStr: '员工',
      options: [{}],
      defaultData: {
        name: '',
        tel: '',
        department: ''

      },
      partList: [{}],
      query: {
        filterType: 0,
        searchString: '',
        department: ''
      },
      formData: {

      },
      rules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        tel: [{ required: true, validator: this.validTel, trigger: 'blur' }],
        department: [{ required: true, message: '请输入员工所属部门', trigger: 'blur' }]

      }
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        this.formData = Object.assign({}, this.defaultData)

        this.$refs.ruleForm.resetFields()
      }
    }
  },
  async mounted() {
    await this.getAllDepartment()
    this.getData()
  },
  methods: {
    async getAllDepartment() {
      const res = await this.$http.get('enterpriseAdmin/department/enterprise/all')
      if (res) {
        this.partList = res
      }
    },
    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'enterpriseAdmin/employee',
        params: this.query,
        type
      })
    },
    editData(row) {
      this.isNew = false
      this.formData = Object.assign({}, row)
      this.addDialogVisible = true
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      this.addDialogVisible = true
    },
    delData(row) {
      this.del('enterpriseAdmin/employee/' + row.id)
    },
    submitForm() {
      this.submit('enterpriseAdmin/employee', this.formData)
    }
  }
}
</script>
