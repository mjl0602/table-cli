<template>
  <div class="app-container">
   
    <el-button type="primary" @click="addData">
      新增
    </el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="ID" min-width="100">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      
      <!-- tabel-column insert -->

      <el-table-column
        align="center"
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="delData(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click='editData(scope.row)'>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="query.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 编辑 -->
    <el-dialog :visible.sync="addDialogVisible" :title="dialogTitle">
      <el-form
        :model="formData"
        :rules='rules'
        ref='ruleForm'
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
      
      <!-- form-item insert -->
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
  mixins:[Main],
  data(){
    return {
      formData: {
          //<!-- formData insert -->
      },
      defaultData:{

      },
      rules: {
        //<!-- rules insert -->
      }
    }
  },

  methods:{
      addData(){

      },
      editData(){

      },
      delData(){

      },
      submitForm(){
        
      }
  }
}
</script>
