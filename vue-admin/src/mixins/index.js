export default {
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0
    }
  },
  methods: {
    handleSizeChange(size) {
      this.query.pageSize = size
      this.getData()
    },
    handleCurrentChange(num) {
      this.query.pageNum = num
      this.getData()
    },
    // 列表单属性修改
    changeProp(tips, type, row) {
      let inputPattern = /^[\s\S]*.*[^\s][\s\S]*$/
      let inputErrorMessage
      if (type === 'index') {
        inputPattern = /^\d{1,}$/
        inputErrorMessage = '请输入整数值'
      }
      this.$prompt(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern,
        inputValue: row[type],
        inputErrorMessage: inputErrorMessage || tips
      }).then(async({ value }) => {
        const res = await this.$http.put(`course/${row.id}/${type}`, { value })
        if (res) {
          console.log('res', res)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          row[type] = value
        }
      }).catch(() => {})
    },
    // 删除
    async del(url, ids) {
      this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await this.$http.post(url, { ids })
        if (res) {
          this.$notify.success('删除成功！')
        }
      }).catch(() => {

      })
    },
    // delete单条
    async delSingle(url) {
      this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await this.$http.delete(url)
        if (res) {
          this.$notify.success('删除成功！')
          this.getData()
        }
      }).catch(() => {

      })
    }
  }
}
