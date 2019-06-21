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

    async get(url, params) {
      this.listLoading = true
      try{
        const res = await this.$http.get(url, { params })
        this.listLoading = false
        console.log('res', res)
        this.list = res.rows
        this.total = res.count
      }catch(e){
        this.listLoading = false
        console.log('getData error')
      }
      
    },

    del(url) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const res = this.$http.delete(url)
        if (res) {
          this.$message.success('删除成功！')
          this.getData()
        }
      }).catch(() => {})
    },
    submit(url, data) {
      // 默认表单ref=ruleForm
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          
          try{
            let res
            if (this.isNew) {
              res = await this.$http.post(url, data)
              this.$message.success('添加成功')
            } else {
              res = await this.$http.put(url + '/' + data.id, data)
              this.$message.success('修改成功')
            }
           
              this.addDialogVisible = false
              this.getData()
            
          }catch{
            console.log('submit error')
          }
         
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSizeChange(size) {
      this.query.pageSize = size
      this.getData()
    },
    handleCurrentChange(num) {
      this.query.pageNum = num
      this.getData()
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
    }
  }
}
