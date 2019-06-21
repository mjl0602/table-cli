export default {
  computed: {
    dialogTitle() {
      return (this.isNew ? '新增' : '修改') + this.objStr
    }
  },
  data() {
    return {
      isNew: false,
      list: [],
      listLoading: true,
      total: 0,
      // 分页查询条件
      query: {
        pageNum: 1,
        pageSize: 10
      },
      addDialogVisible: false
    }
  },
  mounted() {

  },

  methods: {

    async get({ url, params, type }) {
      this.listLoading = true
      // console.log('type==>', type)
      if (type !== 'pagination') {
        this.query.pageNum = 1
      }
      try {
        const res = await this.$http.get(url, { params })
        // this.listLoading = false
        this.list = res.rows
        this.total = res.count
      } catch (e) {
        console.log(e)
      } finally {
        this.listLoading = false
      }
    },

    del(url, tips = '此操作将永久删除该数据, 是否继续?') {
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await this.$http.delete(url)
        if (res) {
          this.$message.success('操作成功！')
          this.getData()
        }
      }).catch(() => {})
    },
    submit(url, data) {
      // 默认表单ref=ruleForm
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          let res
          if (this.isNew) {
            res = await this.$http.post(url, data)
          } else {
            res = await this.$http.put(url + '/' + data.id, data)
          }
          if (res) {
            console.log(res)
            this.$message.success('操作成功!')

            this.addDialogVisible = false
            this.getData()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSizeChange(size) {
      this.query.pageSize = size
      this.getData('pagination')
    },
    handleCurrentChange(num) {
      this.query.pageNum = num
      this.getData('pagination')
    },
    // 修改单个属性
    changeProp(row, options) {
      this.$prompt(options.tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row[options.prop],
        inputPattern: options.reg,
        inputErrorMessage: options.errorMsg || '请输入内容'
      }).then(async({ value }) => {
        const res = await this.$http.put(`${options.url}/${row.id}/${options.prop}`, { value })
        if (res) {
          this.$notify.success('修改成功')
          row[options.prop] = value
        }
      }).catch(() => {})
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    validInteger(rule, value, callback) {
      if (!(/^[0-9]*[1-9][0-9]*$/.test(value))) {
        callback(new Error('请输入整数值'))
      } else {
        callback()
      }
    },
    validTel(rule, value, callback) {
      console.log('value', value)
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
  }
}
