
<template>
  <div class="app-container teacher">
    <el-header class="common-head">
      <el-input v-model="query.searchString" placeholder="老师编号/姓名" class="input-with-select" @keyup.enter.native="getData">
        <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索类型">
          <el-option label="老师编号" :value="0" />
          <el-option label="老师名称" :value="1" />
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
        <el-table-column label="老师编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="老师姓名" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="擅长行业" align="center">
          <template slot-scope="scope">
            {{ scope.row.goodAtIndustry }}
          </template>
        </el-table-column>
        <el-table-column label="擅长领域" align="center">
          <template slot-scope="scope">
            {{ scope.row.goodAtArea }}
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
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="delData(scope.row)">
              删除
            </el-button>
            <el-button type="primary" size="mini" @click="editData(scope.row)">
              编辑
            </el-button>
            <el-button type="info" size="mini" @click="scan(scope.row)">
              查看
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
    <el-dialog :visible.sync="addDialogVisible" width="60%" :before-close="handleClose" :title="dialogTitle">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="150px"
        style="min-width: 400px; margin-left:50px;"
      >
        <el-form-item label="老师姓名" prop="name">
          <span v-if="seeInfo">{{ formData.name }}</span>
          <el-input v-else v-model="formData.name" placeholder="请输入老师姓名" />
        </el-form-item>
        <el-form-item label="老师职称" prop="name">
          <span v-if="seeInfo">{{ formData.jobTitle }}</span>
          <el-input v-else v-model="formData.jobTitle" placeholder="请输入老师职称" />
        </el-form-item>
        <el-form-item label="常住地" prop="address">
          <span v-if="seeInfo">{{ formData.address }}</span>
          <el-input v-else v-model="formData.address" placeholder="请输入常住地" />
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <span v-if="seeInfo">{{ formData.tel }}</span>
          <el-input v-else v-model="formData.tel" placeholder="请输入联系方式" minlength="11" maxlength="11" />
        </el-form-item>
        <el-form-item label="擅长行业" prop="goodAtIndustry">
          <span v-if="seeInfo">{{ formData.goodAtIndustry }}</span>
          <el-input v-else v-model="formData.goodAtIndustry" placeholder="请输入擅长行业" />
        </el-form-item>
        <el-form-item label="擅长领域" prop="goodAtArea">
          <span v-if="seeInfo">{{ formData.goodAtArea }}</span>
          <el-input v-else v-model="formData.goodAtArea" placeholder="请输入擅长领域" />
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <span v-if="seeInfo">{{ formData.index }}</span>
          <el-input v-else v-model.number="formData.index" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="老师主页大图" prop="avatar">
          <ttx-upload-img ref="avatar" v-model="formData.avatar" :editable="!seeInfo" :limit="1" :auto-upload="false" />
        </el-form-item>
        <el-form-item label="老师列表图片" prop="banners">
          <ttx-upload-img ref="banners" v-model="formData.banners" :editable="!seeInfo" :limit="seeInfo?formData.banners.length:10" :auto-upload="false" />
        </el-form-item>
        <el-form-item label="老师简介" prop="introduction">
          <div v-if="seeInfo" v-html="formData.introduction" />
          <tinymce v-else ref="introduction" v-model="formData.introduction" />
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
import { validTel } from '@/utils/validate'

import Main from '../mixins'
export default {
  mixins: [Main],
  data() {
    return {
      objStr: '老师',
      query: {
        filterType: 0,
        searchString: ''
      },
      seeInfo: false,
      defaultData: {
        id: '',
        name: '',
        goodAtIndustry: '',
        goodAtArea: '',
        avatar: [],
        banners: [],
        introduction: '',
        tel: '',
        jobTitle: '',
        index: ''

      },
      formData: {

      },
      rules: {
        jobTitle: [{ required: false, message: '请输入老师职称', trigger: 'blur' }],
        name: [{ required: false, message: '请输入老师姓名', trigger: 'blur' }],
        address: [{ required: false, message: '请输入地址', trigger: 'blur' }],
        goodAtIndustry: [{ required: false, message: '请输入擅长行业', trigger: 'blur' }],
        goodAtArea: [{ required: false, message: '请输入擅长领域', trigger: 'blur' }],
        avatar: [{ required: false, message: '请输入老师主页大图', trigger: 'blur' }],
        banners: [{ required: false, message: '请输入老师列表图片', trigger: 'blur' }],
        introduction: [{ required: false, message: '请输入老师简介', trigger: 'blur' }],
        tel: [{ required: false, validator: validTel, trigger: 'blur' }],
        index: [{ required: false, validator: this.validInteger, trigger: 'blur' }]

      }
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        this.formData = Object.assign({}, this.defaultData)

        this.$refs.ruleForm.resetFields()
      } else {
        this.seeInfo = false
        if (this.$refs.introduction) {
          this.$refs.introduction.setContent(this.formData.introduction)
        }
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    changeIndex(row) {
      this.changeProp(row, {
        prop: 'index',
        tips: '请输入排序',
        errorMsg: '请输入整数',
        reg: /^[0-9]*[1-9][0-9]*$/,
        url: 'teacher'
      })
    },
    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'teacher',
        params: this.query,
        type
      })
    },
    async editData(row) {
      this.isNew = false
      // const data = Object.assign({}, row)
      const data = await this.$http.get('teacher/' + row.id)
      if (data) {
        data.avatar = [data.avatar]
        this.formData = data
        this.addDialogVisible = true
      }
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      console.log(this.formData)
      this.addDialogVisible = true
    },
    delData(row) {
      this.del('teacher/' + row.id)
    },
    async scan(row) {
      await this.editData(row)
      this.seeInfo = true
      console.log(this.formData.banners.length)
    },
    async submitForm() {
      await this.$refs.avatar.submitUpload()
      await this.$refs.banners.submitUpload()
      const data = Object.assign({}, this.formData)
      data.avatar = data.avatar[0]
      console.log('data', data)
      this.submit('teacher', data)
    }
  }
}
</script>

<style lang="less" scoped>
  .teacher{
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;

    .el-main{
      flex:1;
    }

  }
</style>
