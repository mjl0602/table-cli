<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="add"
      >添加</el-button>
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
            <el-table-column label="流水号" align="center">
        <template slot-scope="scope">
          {{scope.row.flownumber}}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center">
        <template slot-scope="scope">
          {{scope.row.ordertime}}
        </template>
      </el-table-column>
      <el-table-column label="收款" align="center">
        <template slot-scope="scope">
          {{scope.row.money}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          {{scope.row.tel}}
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          {{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column label="起送时间" align="center">
        <template slot-scope="scope">
          {{scope.row.sendtimestart}}
        </template>
      </el-table-column>
      <el-table-column label="停送时间" align="center">
        <template slot-scope="scope">
          {{scope.row.sendtimeend}}
        </template>
      </el-table-column>
      <el-table-column label="生产方式" align="center">
        <template slot-scope="scope">
          {{scope.row.borntype}}
        </template>
      </el-table-column>
      <el-table-column label="餐食类型" align="center">
        <template slot-scope="scope">
          {{scope.row.foodtype}}
        </template>
      </el-table-column>
      <el-table-column label="餐具类型" align="center">
        <template slot-scope="scope">
          {{scope.row.tooltype}}
        </template>
      </el-table-column>
      <el-table-column label="要求" align="center">
        <template slot-scope="scope">
          {{scope.row.require}}
        </template>
      </el-table-column>
      <el-table-column label="忌口" align="center">
        <template slot-scope="scope">
          {{scope.row.noeat}}
        </template>
      </el-table-column>
      <el-table-column label="注意事项" align="center">
        <template slot-scope="scope">
          {{scope.row.attention}}
        </template>
      </el-table-column>
      <el-table-column label="糖尿病" align="center">
        <template slot-scope="scope">
          {{scope.row.diabetes}}
        </template>
      </el-table-column>
      <el-table-column label="配送时间" align="center">
        <template slot-scope="scope">
          {{scope.row.sendtime}}
        </template>
      </el-table-column>
      <el-table-column label="标记" align="center">
        <template slot-scope="scope">
          {{scope.row.mark}}
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
    <div class="pagination-container" >
      <el-pagination
        :current-page="query.pageNum"
        :page-sizes="[5,10,20,30,50]"
        :page-size="query.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :visible.sync="addDialogVisible" :title="dialogTitle">
      <el-form
        :model="row"
        :rules='rules'
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
              <el-form-item label="流水号" prop="flownumber">
        <el-input v-model="row.flownumber" placeHolder="请输入流水号"/>
      </el-form-item>
      <el-form-item label="下单时间" prop="ordertime">
        <el-input v-model="row.ordertime" placeHolder="请输入下单时间"/>
      </el-form-item>
      <el-form-item label="收款" prop="money">
        <el-input v-model="row.money" placeHolder="请输入收款"/>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-input v-model="row.status" placeHolder="请输入订单状态"/>
      </el-form-item>
      <el-form-item label="客户姓名" prop="name">
        <el-input v-model="row.name" placeHolder="请输入客户姓名"/>
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="row.tel" placeHolder="请输入电话"/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="row.address" placeHolder="请输入地址"/>
      </el-form-item>
      <el-form-item label="起送时间" prop="sendtimestart">
        <el-input v-model="row.sendtimestart" placeHolder="请输入起送时间"/>
      </el-form-item>
      <el-form-item label="停送时间" prop="sendtimeend">
        <el-input v-model="row.sendtimeend" placeHolder="请输入停送时间"/>
      </el-form-item>
      <el-form-item label="生产方式" prop="borntype">
        <el-input v-model="row.borntype" placeHolder="请输入生产方式"/>
      </el-form-item>
      <el-form-item label="餐食类型" prop="foodtype">
        <el-input v-model="row.foodtype" placeHolder="请输入餐食类型"/>
      </el-form-item>
      <el-form-item label="餐具类型" prop="tooltype">
        <el-input v-model="row.tooltype" placeHolder="请输入餐具类型"/>
      </el-form-item>
      <el-form-item label="要求" prop="require">
        <el-input v-model="row.require" placeHolder="请输入要求"/>
      </el-form-item>
      <el-form-item label="忌口" prop="noeat">
        <el-input v-model="row.noeat" placeHolder="请输入忌口"/>
      </el-form-item>
      <el-form-item label="注意事项" prop="attention">
        <el-input v-model="row.attention" placeHolder="请输入注意事项"/>
      </el-form-item>
      <el-form-item label="糖尿病" prop="diabetes">
        <el-input v-model="row.diabetes" placeHolder="请输入糖尿病"/>
      </el-form-item>
      <el-form-item label="配送时间" prop="sendtime">
        <el-input v-model="row.sendtime" placeHolder="请输入配送时间"/>
      </el-form-item>
      <el-form-item label="标记" prop="mark">
        <el-input v-model="row.mark" placeHolder="请输入标记"/>
      </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import AdminTableMixin from "./mixin/admin_mixin.js";
import AdminObject from "@/api/example";

export default {
  filters: {},
  mixins: [
    // 混入表格Mixin
    AdminTableMixin,
  ],
  data() {
    return {
      // 本页查看的对象名称
      objStr: "#模板对象#",
      // 数据源
      source: AdminObject,
    };
  },
  methods: {},
};
</script>
<style>
</style>
