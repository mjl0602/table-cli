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
      <el-table-column label="创建日期" align="center">
        <template slot-scope="scope">
          {{scope.row.createdAt}}
        </template>
      </el-table-column>
<el-table-column label="日期" align="center">
        <template slot-scope="scope">
          {{scope.row.date}}
        </template>
      </el-table-column>
<el-table-column label="对象ID" align="center">
        <template slot-scope="scope">
          {{scope.row.objectId}}
        </template>
      </el-table-column>
<el-table-column label="磷" align="center">
        <template slot-scope="scope">
          {{scope.row.p}}
        </template>
      </el-table-column>
<el-table-column label="文本" align="center">
        <template slot-scope="scope">
          {{scope.row.text}}
        </template>
      </el-table-column>
<el-table-column label="更新日期" align="center">
        <template slot-scope="scope">
          {{scope.row.updatedAt}}
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
        <el-form-item label="创建日期" prop="createdAt">
        <el-input v-model="row.createdAt" placeHolder="请输入创建日期"/>
      </el-form-item>
<el-form-item label="日期" prop="date">
        <el-input v-model="row.date" placeHolder="请输入日期"/>
      </el-form-item>
<el-form-item label="对象ID" prop="objectId">
        <el-input v-model="row.objectId" placeHolder="请输入对象ID"/>
      </el-form-item>
<el-form-item label="磷" prop="p">
        <el-input v-model="row.p" placeHolder="请输入磷"/>
      </el-form-item>
<el-form-item label="文本" prop="text">
        <el-input v-model="row.text" placeHolder="请输入文本"/>
      </el-form-item>
<el-form-item label="更新日期" prop="updatedAt">
        <el-input v-model="row.updatedAt" placeHolder="请输入更新日期"/>
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
      objStr: "log",
      // 数据源
      source: new DataSource()
    };
  },
  methods: {}
};

const tableName = "log";

/**
 * 增删查改等处理
 */

class DataSource {
  // 默认的内容
  defaultObject = {
    createdAt:"",
    date:"",
    objectId:"",
    p:"",
    text:"",
    updatedAt:"",
    
  };

  // 表单规则
  rules = {
    createdAt:[{ required: true, message: "必填", trigger: "blur" }],
    date:[{ required: true, message: "必填", trigger: "blur" }],
    objectId:[{ required: true, message: "必填", trigger: "blur" }],
    p:[{ required: true, message: "必填", trigger: "blur" }],
    text:[{ required: true, message: "必填", trigger: "blur" }],
    updatedAt:[{ required: true, message: "必填", trigger: "blur" }],
    
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
        res.set("createdAt", obj.createdAt)
    res.set("date", obj.date)
    res.set("objectId", obj.objectId)
    res.set("p", obj.p)
    res.set("text", obj.text)
    res.set("updatedAt", obj.updatedAt)

    return res.save();
  }

  // 添加
  async add(obj) {
    let res = Bmob.Query(tableName);
        res.set("createdAt", obj.createdAt)
    res.set("date", obj.date)
    res.set("objectId", obj.objectId)
    res.set("p", obj.p)
    res.set("text", obj.text)
    res.set("updatedAt", obj.updatedAt)

    return res.save();
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
