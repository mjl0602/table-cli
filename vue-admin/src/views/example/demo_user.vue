<template>
  <div class="app-container">
   <el-header class='head'>
     <el-button type="primary" @click="addData">
      新增
    </el-button>
   </el-header>
    <el-main class='body'>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="ID" min-width="100">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      
      <el-table-column label="医生编号" align="center">
    <template slot-scope="scope">
        {{ scope.row.id }}
    </template>
</el-table-column>
<el-table-column label="医生姓名" align="center">
    <template slot-scope="scope">
        {{ scope.row.name }}
    </template>
</el-table-column>
<el-table-column label="医生电话" align="center">
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
          <el-button type="danger" size="small" @click="delData(scope.row)">删除</el-button>
          <el-button type="primary" size="small" @click='editData(scope.row)'>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-main>
    <el-footer class='foot'>
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
        :model="formData"
        :rules='rules'
        ref='ruleForm'
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
      
      <el-form-item label="医生编号" prop="id">
    <el-input v-model="formData.id" placeholder="请输入医生编号"/>
  </el-form-item>
  <el-form-item label="医生姓名" prop="name">
    <el-input v-model="formData.name" placeholder="请输入医生姓名"/>
  </el-form-item>
  <el-form-item label="医生电话" prop="tel">
    <el-input v-model="formData.tel" placeholder="请输入医生电话"/>
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
import Main from '@/mixins/auto_mixin'
export default {
  mixins:[Main],
  data(){
    return {
      defaultData: {
          id: '', 
  name: '', 
  tel: '', 
  
      },
      formData:{

      },
      query:{
        filterType: 0,
        searchString: ''
      },
      rules: {
        id:[{ required: true, message: "请输入医生编号", trigger: "blur" }], 
name:[{ required: true, message: "请输入医生姓名", trigger: "blur" }], 
tel:[{ required: true, message: "请输入医生电话", trigger: "blur" }], 

      }
    }
  },
   watch: {
    addDialogVisible(val) {
      if (!val) {
        this.$refs.ruleForm.resetFields()
      }
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      this.formData = Object.assign({},this.defaultData)
      this.get('enterprise')
    },
      editData(row){
          this.isNew = false
          this.formData = Object.assign({},row)
          this.addDialogVisible = true

        },
        addData(){
          this.isNew = true
          this.formData = Object.assign({},this.defaultData)
          this.addDialogVisible = true
        },
      delData(){

      },
      submitForm(){
        
      }
  }
}
</script>
