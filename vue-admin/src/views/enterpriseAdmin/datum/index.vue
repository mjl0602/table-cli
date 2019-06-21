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
      <router-link :to="{name:'datumplatform'}">
        <el-button type="primary">
          新 增
        </el-button>
      </router-link>

      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.data&&scope.row.data.id }}
          </template>
        </el-table-column>
        <el-table-column label="资料名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.data&&scope.row.data.name }}
          </template>
        </el-table-column>
        <el-table-column label="资料分类" align="center">
          <template slot-scope="scope">
            {{ scope.row.data&&scope.row.data.class }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="资料文件" min-width="100">
          <template slot-scope="scope">
            <a v-if="scope.row.data" style="color:#67C23A" :href="`${$cfg.getImgPath(scope.row.data.url)}?attname=${scope.row.data.name}.${scope.row.data.ext}`" target="_blank">下载</a>
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
  </div>
</template>
<script>

import Main from '../../mixins'
export default {
  mixins: [Main],
  data() {
    return {

      fileList: [],

      options: [{}], // 所有分类
      query: {
        filterType: 0,
        searchString: '',
        dClass: ''
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
        url: 'enterpriseAdmin/enterpriseData'
      })
    },
    async getDataClassAll() {
      const res = await this.$http.get('enterpriseAdmin/dataClass/all')
      if (res) {
        this.options = res
      }
    },
    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'enterpriseAdmin/enterpriseData',
        params: this.query,
        type
      })
    },

    delData(row) {
      this.del('enterpriseAdmin/enterpriseData/' + row.data.id)
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

