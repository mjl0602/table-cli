<template>
  <div class="app-container activity">
    <el-header>
      <el-header class="common-head">
        <el-input v-model="query.searchString" placeholder="活动编号/姓名" class="input-with-select" @keyup.enter.native="getData">
          <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索类型">
            <el-option label="活动编号" :value="0" />
            <el-option label="活动名称" :value="1" />
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
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="活动编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="活动名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">
            {{ scope.row.tel }}
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
        style="min-width: 400px; margin-left:50px;"
      >
        <el-form-item label="活动banner" prop="banners">
          <ttx-upload-img v-model="formData.banners" :limit="6" />
        </el-form-item>

        <el-form-item label="活动名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="formData.tel" minlength="11" maxlength="11" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="活动详情" prop="tel">
          <tinymce ref="detail" v-model="formData.detail" />
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
      objStr: '活动',
      defaultData: {
        banners: [],
        detail: '',
        name: '',
        tel: ''

      },
      formData: {

      },
      query: {
        filterType: 0,
        searchString: ''
      },
      rules: {
        banners: [{ required: false, message: '请输入活动banner', trigger: 'change' }],
        detail: [{ required: false, message: '请输入活动详情', trigger: 'blur' }],
        name: [{ required: false, message: '请输入活动名称', trigger: 'blur' }],
        tel: [{ required: false, validator: this.validTel, trigger: 'blur' }]

      }
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        this.formData = Object.assign({}, this.defaultData)
        this.$refs.ruleForm.resetFields()
      } else {
        if (this.$refs.detail) {
          this.$refs.detail.setContent(this.formData.detail)
        }
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
        url: 'enterpriseAdmin/activity',
        params: this.query,
        type
      })
    },
    async editData(row) {
      this.isNew = false
      const res = await this.$http.get('enterpriseAdmin/activity/' + row.id)
      if (row) {
        this.formData = res
        this.addDialogVisible = true
      }
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      this.addDialogVisible = true
    },
    delData(row) {
      this.del('enterpriseAdmin/activity/' + row.id)
    },
    submitForm() {
      this.submit('enterpriseAdmin/activity', this.formData)
    }
  }
}
</script>
<style lang="less" scoped>
  .activity{
    box-sizing: border-box;
    height: calc(100vh - 84px);
    display: flex;
    flex-direction: column;

    .el-main{
      flex:1;
    }

  }
</style>
