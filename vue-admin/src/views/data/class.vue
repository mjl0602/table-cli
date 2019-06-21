<template>
  <div class="app-container">
    <el-header>
      <el-button type="primary" @click="addData">
        新增
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="资料分类" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            {{ scope.row.index }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="delData(scope.row)">
              删除
            </el-button>
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
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="资料分类" prop="class">
          <el-input v-model="formData.name" place-holder="请输入资料分类" />
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input v-model="formData.index" place-holder="请输入排序" />
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
import Main from '../mixins'
export default {
  mixins: [Main],
  data() {
    return {
      defaultData: {
        id: '',
        name: '',
        index: ''

      },
      objStr: '资料分类',
      formData: {

      },
      rules: {
        id: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入资料分类', trigger: 'blur' }],
        index: [{ required: true, validator: this.validInteger, trigger: 'blur' }]

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
  mounted() {
    this.getData()
  },
  methods: {
    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'dataClass',
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
      this.del('dataClass/' + row.id)
    },
    submitForm() {
      this.submit('dataClass', this.formData)
    }
  }
}
</script>
