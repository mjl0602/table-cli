<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="add">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- 内容 -->
      <el-table-column label="id" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
<el-table-column label="内容" align="center">
        <template slot-scope="scope">
          {{scope.row.content}}
        </template>
      </el-table-column>
<el-table-column label="阅读数" align="center">
        <template slot-scope="scope">
          {{scope.row.readCount}}
        </template>
      </el-table-column>
<el-table-column label="医生姓名" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
<el-table-column label="医生电话" align="center">
        <template slot-scope="scope">
          {{scope.row.tel}}
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column class-name="status-col" label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" @click="edit(scope.row)" size="mini">修改</el-button>
            <el-button type="danger" @click="deleteRow(scope.row)" size="mini">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 翻页 -->
    <div class="pagination-container" v-if="query.total">
      <el-pagination
        :current-page="query.pageNum"
        :page-sizes="[5,10,20,30,50]"
        :page-size="query.pageSize"
        :total="query.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :visible.sync="addDialogVisible" :title="dialogTitle">
      <el-form
        :model="row"
        :rules="rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="标题" prop="title">
        <el-input v-model="row.title" placeHolder="请输入标题"/>
      </el-form-item>
<el-form-item label="内容" prop="content">
        <el-input v-model="row.content" placeHolder="请输入内容"/>
      </el-form-item>
<el-form-item label="阅读数" prop="readCount">
        <el-input v-model="row.readCount" placeHolder="请输入阅读数"/>
      </el-form-item>
<el-form-item label="医生姓名" prop="name">
        <el-input v-model="row.name" placeHolder="请输入医生姓名"/>
      </el-form-item>
<el-form-item label="医生电话" prop="tel">
        <el-input v-model="row.tel" placeHolder="请输入医生电话"/>
      </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AdminTableMixin from "./basic/admin_mixin";
import AdminObject from "./basic/adminobject";

export default {
  filters: {},
  mixins: [
    // 混入表格Mixin
    AdminTableMixin
  ],
  data() {
    return {
      // 本页查看的对象名称
      objStr: "article",
      // 数据源
      source: DataSource
    };
  },
  methods: {}
};

/**
 * 增删查改等处理
 */

class DataSource extends AdminObject {
  // 默认的内容
  static defaultObject = {
    title:"",
    content:"",
    readCount:"",
    name:"",
    tel:"",
    
  };

  // 表单规则
  static rules = {
    title:[{ required: true, message: "必填", trigger: "blur" }],
    content:[{ required: true, message: "必填", trigger: "blur" }],
    readCount:[{ required: true, message: "必填", trigger: "blur" }],
    name:[{ required: true, message: "必填", trigger: "blur" }],
    tel:[{ required: true, message: "必填", trigger: "blur" }],
    
  };

  /**
   * 【查询全部】
   * 如果返回数组对象，则页面不翻页，
   * 如果返回{total:88,data:[]}对象，
   * 则页面出现翻页标签。
   *
   * */
  // static async all(query) {
  // }

  // // 上传修改
  // static async edit(obj) {
  // }

  // // 添加
  // static async add(obj) {
  // }

  // // 删除
  // static async deleteObj(obj) {
  // }
}
</script>
<style>
</style>
