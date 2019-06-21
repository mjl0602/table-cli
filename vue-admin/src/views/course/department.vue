<template>
  <div class="app-container department">
    <el-header style="text-align:right">
      <el-button type="primary" @click="addData">
        新增
      </el-button>
      <el-button type="success" @click="getData">
        刷新
      </el-button>
    </el-header>

    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="岗位名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
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
    <el-dialog :visible.sync="addDialogVisible" :title="dialogTitle" :before-close="handleClose">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入岗位名称" />
        </el-form-item>
        <!-- <el-form-item label="排序" prop="index">
          <el-input v-model="formData.index" placeholder="请输入排序" />
        </el-form-item> -->
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
      objStr: '岗位',
      defaultData: {
        id: '',
        name: ''
        // index:''

      },
      formData: {

      },
      rules: {

        name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
        // index: [{ required: true, validator: this.validInteger, trigger: 'blur' }]

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
        url: 'department',
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
      this.del('department/' + row.id)
    },
    submitForm() {
      this.submit('department', this.formData)
    }
  }
}
</script>
<style lang="less" scoped>
  .department{
    box-sizing: border-box;
    height: calc(100vh - 84px);
    display: flex;
    flex-direction: column;

    .el-main{
      flex:1;
    }

  }
</style>
