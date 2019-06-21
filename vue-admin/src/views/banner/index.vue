<template>
  <div class="app-container banner">
    <el-header>
      <el-button type="primary" @click="addData">
        新 增
      </el-button>
      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="banner种类" align="center">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column label="上传图片" align="center">
          <template slot-scope="scope">
            <img :src="$cfg.getImgPath(scope.row.image)" width="80" height="80" alt="">
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <el-tag style="cursor:pointer" @click="changeIndex(scope.row)">
              {{ scope.row.index }}
            </el-tag>
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
        <el-form-item label="上传图片" prop="image">
          <ttx-upload-img v-model="formData.image" :limit="1" />
        </el-form-item>
        <el-form-item label="banner种类" prop="type">
          <el-select v-model="formData.type" style="width:100%" placeholder="请选择搜索类型">
            <el-option label="url" value="url" />
            <el-option label="page" value="page" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input v-model="formData.index" place-holder="请输入排序" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="formData.url" place-holder="请输入URL" />
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
      objStr: 'banner',
      defaultData: {
        id: '',
        type: 'url',
        image: [],
        index: '',
        url: ''

      },
      formData: {

      },
      query: {
        filterType: 0,
        searchString: ''
      },
      rules: {
        id: [{ required: false, message: '请输入编号', trigger: 'blur' }],
        type: [{ required: false, message: '请输入banner种类', trigger: 'blur' }],
        image: [{ required: false, message: '请输入上传图片', trigger: 'change' }],
        index: [{ required: false, validator: this.validInteger, trigger: 'blur' }],
        url: [{ required: false, message: '请输入URL', trigger: 'blur' }]

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
        url: 'enterpriseAdmin/banner',
        params: this.query
      })
    },
    editData(row) {
      this.isNew = false
      const data = Object.assign({}, row)
      data.image = [data.image]
      this.formData = data
      this.addDialogVisible = true
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      this.addDialogVisible = true
    },
    delData(row) {
      this.del('enterpriseAdmin/banner/' + row.id)
    },
    changeIndex(row) {
      this.changeProp(row, {
        prop: 'index',
        tips: '请输入排序',
        errorMsg: '请输入整数',
        reg: /^[0-9]*[1-9][0-9]*$/,
        url: 'enterpriseAdmin/banner'
      })
    },
    submitForm() {
      const data = Object.assign({}, this.formData)
      data.image = data.image[0]
      this.submit('enterpriseAdmin/banner', data)
    }
  }
}
</script>
<style lang="less" scoped>
  .banner{
    box-sizing: border-box;
    height: calc(100vh - 84px);
    display: flex;
    flex-direction: column;

    .el-main{
      flex:1;
    }

  }
</style>
