<template>
  <div class="app-container">
    <el-header class="common-head">
      <el-button type="primary" @click="addData">
        发布消息
      </el-button>
      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="消息编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="消息内容" align="center">
          <template slot-scope="scope">
            <pre class="pre">{{ scope.row.content }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">
            {{ $assist.dateFormatter(scope.row.updatedAt) }}
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
        label-width="150px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="消息内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :autosize="{ minRows: 10}"
            placeholder="请输入消息内容"
          />
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
      objStr: '消息',
      options: [{}],
      defaultData: {
        content: ''

      },
      partList: [{}],
      formData: {
        content: ''
      },
      rules: {

        content: [
          { required: false, message: '请输入消息内容', trigger: 'blur' },
          { max: 500, message: '不能超过500字' }
        ]

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
    this.getData()
  },
  methods: {

    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'enterpriseAdmin/information',
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
      this.del('enterpriseAdmin/information/' + row.id)
    },
    submitForm() {
      this.submit('enterpriseAdmin/information', this.formData)
    }
  }
}
</script>
<style lang="less" scoped>
  .pre{
    white-space: pre-wrap;
  }
</style>

