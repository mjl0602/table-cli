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
      
    <el-table-column label="角色" align="center">
      <template slot-scope="scope">
        {{scope.row.roles}}
      </template>
    </el-table-column>
    <el-table-column label="更新日期" align="center">
      <template slot-scope="scope">
        {{scope.row.update}}
      </template>
    </el-table-column>
    <el-table-column label="NNNNN" align="center">
      <template slot-scope="scope">
        {{scope.row.name}}
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
        :rules="source.rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        
    <el-form-item label="角色" prop="roles">
      <el-input v-model="row.roles" placeHolder="请输入角色"/>
    </el-form-item>
    <el-date-picker
      v-model="row.update"
      align="right"
      type="date"
      placeholder="选择更新日期"
      :picker-options="datePickOption"
      ></el-date-picker>
    <el-date-picker
      v-model="row.name"
      align="right"
      type="date"
      placeholder="选择NNNNN"
      :picker-options="datePickOption"
      ></el-date-picker>
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
      objStr: "admin",
      // 数据源
      source: new DataSource(),
      // rules: this.source.rules,
    };
  },
  methods: {}
};

const tableName = "admin";

/**
 * 增删查改等处理
 */

class DataSource {
  // 默认的内容
  defaultObject = {
    undefined
  };

  // 表单规则
  rules = {
    roles:[{ required: true, message: "必填", trigger: "blur" }],
    update:[{ required: true, message: "必填", trigger: "blur" }],
    name:[{ required: true, message: "必填", trigger: "blur" }],
    
  };
  /**
   * 【查询全部】
   * 如果返回数组对象，则页面不翻页，
   * 如果返回{total:88,data:[]}对象，
   * 则页面出现翻页标签。
   *
   * */
  async all(q) {
    let query = Bmob.Query(tableName);
    let count = await query.count();
    if (q.page && q.pageSize) {
      query.skip(q.pageSize * (q.page - 1));
      query.limit(q.pageSize);
    }

    query.order("-createdAt");
    let list = await query.find();
    return {
      total: count,
      data: list
    };
  }

  // 上传修改
  async edit(obj) {
    let bq = Bmob.Query(tableName);
    let res = await bq.get(obj.objectId);
    res = this.buildObj(res, obj);
    return res.save();
  }

  // 添加
  async add(obj) {
    let res = Bmob.Query(tableName);
    res = this.buildObj(res, obj);
    return res.save();
  }

  // 修改对象
  buildObj(res, obj) {
    res.set("update", obj.update)
    res.set("name", obj.name)
    
    return res;
  }

  // 删除
  async deleteObj(obj) {
    let bq = Bmob.Query(tableName);
    return bq.destroy(obj.objectId);
  }
}
</script>
<style>
</style>
