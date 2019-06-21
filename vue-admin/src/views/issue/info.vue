<template>
  <el-dialog :visible.sync="seeVisible" title="回答情况">
    <el-header class="common-head">
      <el-row :gutter="40" style="margin-bottom:20px">
        <el-col :span="4" style="text-align:center">
          问题名称：
        </el-col>
        <el-col :span="20">
          {{ detail.name }}
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="4" style="text-align:center">
          问题详情：
        </el-col>
        <el-col :span="20">
          {{ detail.detail }}
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" max-height="400" :data="detail.replies" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="回答编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="回答详情" align="center">
          <template slot-scope="scope">
            <pre style="white-space:pre-line"> {{ scope.row.detail }} </pre>
          </template>
        </el-table-column>
        <el-table-column label="回答人" align="center">
          <template slot-scope="scope">
            {{ scope.row.user?scope.row.user.name:'' }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"

          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="delData(scope.row)">
              删 除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
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
      seeVisible: false,
      detail: {
        user: {},
        repies: []
      }
    }
  },
  watch: {
    async seeVisible(val) {
      if (!val) {
        this.detail = {
          user: {},
          repies: []
        }
      } else {
        try {
          const res = await this.$http.get(`enterpriseAdmin/issue/${this.id}`)
          this.listLoading = false
          this.detail = res
        } catch {
          this.listLoading = false

          console.log('回答详情接口出错')
        }
      }
    }
  },
  methods: {
    delData(row) {
      this.del(`enterpriseAdmin/reply/${row.id}`)
    }
  }
}
</script>
