<template>
  <el-dialog :visible.sync="seeVisible" title="人员情况">
    <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column label="员工编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.user?scope.row.user.name:'' }}
        </template>
      </el-table-column>

      <el-table-column label="考试情况" align="center">
        <template slot-scope="scope">
          {{ scope.row.userExam || '暂无' }}
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
      <!-- <el-footer>
        <el-pagination
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-footer> -->
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="seeVisible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>

import Main from '../mixins'
export default {
  mixins: [Main],
  props: {
    id: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      seeVisible: false
    }
  },
  watch: {
    seeVisible(val) {
      if (!val) {
        this.list = []
      } else {
        this.getData()
      }
    }
  },
  methods: {
    delData() {
      console.log('删除')
    },
    async getData() {
      // this.get(`enterpriseAdmin/courseDeliver/${this.id}`, this.query)
      try {
        const res = await this.$http.get(`enterpriseAdmin/courseDeliver/${this.id}`)
        console.log('res', res)
        this.listLoading = false
        const data = []
        res.forEach(el => {
          const result = data.findIndex(item => {
            return item.userId === el.userId
          })
          if (result < 0) {
            data.push(el)
          }
          console.log(result)
        })
        this.list = data
      } catch {
        this.listLoading = false
        console.log('课程分发详情接口有问题')
      }
    }
  }
}
</script>
