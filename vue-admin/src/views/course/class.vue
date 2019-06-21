<template>
  <div class="app-container class">
    <el-header class="common-head">
      <el-input v-model="query.searchString" placeholder="分类编号/名称" class="input-with-select" @keyup.enter.native="getData">
        <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索条件">
          <el-option label="分类编号" :value="0" />
          <el-option label="分类名称" :value="1" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData" />
      </el-input>
      <el-button type="primary" @click="addData">
        新增
      </el-button>
      <el-button type="success" @click="getData">
        刷新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="分类编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="分类图标" align="center">
          <template slot-scope="scope">
            <img :src="$cfg.getImgPath(scope.row.icon)" width="80" height="80" alt="" srcset="">
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
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
    <el-dialog :visible.sync="addDialogVisible" :title="dialogTitle" :before-close="handleClose">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="100px"
        style="min-width: 400px; margin-left:50px;"
      >
        <el-form-item label="分类icon" prop="name">
          <ttx-upload-img v-model="formData.icon" :limit="1" />
        </el-form-item>
        <el-form-item label="分类banner" prop="name">
          <ttx-upload-img v-model="formData.banners" :limit="6" />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input v-model="formData.index" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="分类简介">
          <el-input
            v-model="formData.introduction"
            type="textarea"
            :autosize="{ minRows: 6}"
            placeholder="请输入分类简介内容"
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
import { validInteger } from '@/utils/validate'

import Main from '../mixins'
export default {
  mixins: [Main],
  data() {
    return {
      defaultData: {
        id: '',
        name: '',
        index: '',
        icon: [],
        banners: [],
        introduction: ''
      },
      objStr: '分类',
      formData: {

      },
      query: {
        filterType: 0,
        searchString: ''
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        index: [{ required: true, validator: validInteger, trigger: 'blur' }]

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
        url: 'courseClass',
        params: this.query,
        type
      })
    },
    editData(row) {
      this.isNew = false
      const data = Object.assign({}, row)
      data.icon = [data.icon]
      this.formData = data
      this.addDialogVisible = true
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      this.addDialogVisible = true
    },
    delData(row) {
      this.del('courseClass/' + row.id)
    },
    submitForm() {
      const data = Object.assign({}, this.formData)
      data.icon = data.icon.toString()
      this.submit('courseClass', data)
    }
  }
}
</script>
<style lang="less" scoped>
  .class{
    box-sizing: border-box;
    height: calc(100vh - 84px);
    display: flex;
    flex-direction: column;

    .el-main{
      flex:1;
    }

  }
</style>
