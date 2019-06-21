<template>
  <div class="app-container">
    <el-header class="common-head">
      <el-input v-model="query.searchString" placeholder="资料编号/名称" class="input-with-select" @keyup.enter.native="getData">
        <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索类型">
          <el-option label="资料编号" :value="0" />
          <el-option label="资料名称" :value="1" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData" />
      </el-input>
      <el-select v-model="query.dClass" clearable placeholder="请选择资料分类" @change="getData">
        <el-option
          v-for="(item,i) in options"
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
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="资料名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="资料分类" align="center">
          <template slot-scope="scope">
            {{ scope.row.class }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="资料文件" min-width="100">
          <template slot-scope="scope">
            <a style="color:#67C23A" :href="`${$cfg.getImgPath(scope.row.url)}?attname=${scope.row.name}.${scope.row.ext}`" target="_blank">下载</a>
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
        <el-form-item label="资料名称" prop="name">
          <el-input v-model="formData.name" place-holder="请输入资料名称" />
        </el-form-item>
        <el-form-item label="资料分类" prop="class">
          <el-select v-model="formData.class" style="width:100%" placeholder="请选择资料分类">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input v-model="formData.index" place-holder="请输入排序" />
        </el-form-item>
        <el-form-item label="上传资料文件" prop="file">
          <el-upload
            class="upload-demo"
            :action="$cfg.fileUploadUrl"
            :limit="1"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :before-upload="beforeVideoUpload"
            :data="upData"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">
              点击上传
            </el-button>
          </el-upload>
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
import { createUniqueString } from '@/utils'

import Main from '../mixins'
export default {
  mixins: [Main],
  data() {
    return {
      defaultData: {
        id: '',
        name: '',
        dClass: '',
        index: ''
      },
      fileList: [],
      upData: {

      },
      options: [{}], // 所有分类
      formData: {

      },
      objStr: '资料',
      query: {
        filterType: 0,
        searchString: '',
        dClass: ''
      },
      rules: {
        name: [{ required: true, message: '请输入资料名称', trigger: 'blur' }],
        class: [{ required: true, message: '请输入资料分类', trigger: 'blur' }],
        index: [{ required: true, message: '请输入排序', trigger: 'blur' }]

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
    await this.getDataClassAll()
    this.getData()
  },
  methods: {
    changeIndex(row) {
      this.changeProp(row, {
        prop: 'index',
        tips: '请输入排序',
        errorMsg: '请输入整数',
        reg: /^[0-9]*[1-9][0-9]*$/,
        url: 'data'
      })
    },
    async getDataClassAll() {
      const res = await this.$http.get('dataClass/all')
      if (res) {
        this.options = res
      }
    },
    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'data',
        params: this.query,
        type
      })
    },
    editData(row) {
      this.isNew = false
      const data = Object.assign({}, row)
      const { size, fileName, url } = data
      this.fileList = [{ size, name: fileName, url }]
      this.formData = data
      console.log('data', data)
      this.addDialogVisible = true
    },
    addData() {
      this.isNew = true

      this.formData = Object.assign({}, this.defaultData)
      this.fileList = []

      this.addDialogVisible = true
    },
    delData(row) {
      this.del('data/' + row.id)
    },
    submitForm() {
      console.log(',,,,,', this.fileList)
      if (this.fileList.length < 1) {
        this.$notify.error('上传资料不能为空！')
        return
      }
      const { size, name, url, ext } = this.fileList[0]

      const data = Object.assign({}, this.formData, { size, fileName: name, url, ext })
      this.submit('data', data)
    },

    // el-upload
    handleExceed(files, fileList) {
      this.$message.warning(`当前只能上传一个文件，若要修改请删除原来的文件`)
    },
    handleRemove(file, fileList) {

    },

    async handleSuccess(res, file) {
      console.log('res', res)
      console.log('file', file)
      const obj = {}
      obj.size = file.size
      obj.fileName = file.name
      obj.ext = file.name.split('.').pop()
      obj.url = res.key
      obj.name = file.name
      this.fileList = [obj]
    },
    async beforeVideoUpload() {
      let token
      try {
        token = await this.$http.get('upToken')
        console.log(token)
      } catch (error) {
        console.log('******')
        token = this.$cfg.staticToken
      }
      const key = 'course/' + createUniqueString()
      this.upData = {
        token,
        key
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .hidden{
    display: block;
    position: absolute;
    border: 1px solid red;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
</style>

