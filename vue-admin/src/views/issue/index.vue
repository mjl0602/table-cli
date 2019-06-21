<template>
  <div class="app-container">
    <el-header class="common-head">
      <el-input v-model="query.searchString" placeholder="问题编号/姓名" class="input-with-select" @keyup.enter.native="getData">
        <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索类型">
          <el-option label="问题编号" :value="0" />
          <el-option label="问题名称" :value="1" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData" />
      </el-input>
      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="问题编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="问题名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="提问人" align="center">
          <template slot-scope="scope">
            {{ scope.row.user?scope.row.user.name:'' }}
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
              删 除
            </el-button>
            <el-button type="primary" size="small" @click="scanData(scope.row)">
              查 看
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
    <info-page :id="infoId" ref="info" />
  </div>
</template>
<script>
import infoPage from './info'
import Main from '../mixins'
export default {
  components: {
    infoPage
  },
  mixins: [Main],
  data() {
    return {
      infoId: '',
      query: {
        filterType: 0,
        searchString: ''
      },
      detail: {

      }
    }
  },
  mounted() {
    console.log(this.$router)
    this.getData()
  },
  methods: {
    async getData(type) {
      this.get({
        url: 'enterpriseAdmin/issue',
        params: this.query,
        type
      })
    },
    delData(row) {
      this.del('enterpriseAdmin/issue/' + row.id)
    },
    scanData(row) {
      this.infoId = row.id
      this.$refs.info.seeVisible = true
      // this.formData = Object.assign({}, row)
      // this.addDialogVisible = true
    }
  }
}
</script>
