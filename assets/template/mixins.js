
export default {
    computed: {
        dialogTitle() {
          return (this.isNew ? "新增" : "修改") + this.objStr;
        },
    },
    data(){
     
        return {
            isNew:false,
            list: [],
            listLoading: false,
            total: 0,
            // 分页查询条件
            query:{
                pageNum:1,
                pageSize: 10
            },
            addDialogVisible: false, 
        }
    },
    mounted(){
        
    },

    methods:{
      
        async get(url, params) {
          this.listLoading = true
          const res = await this.$http.get(url, { params })
          this.listLoading = false
          if (res) {
            console.log('res', res)
            this.list = res.rows
            this.total = res.count
          }
        },
        
       
        del(row){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message.success('删除成功！')
            }).catch(() => {});
        },
        submitForm() {
          // 默认表单ref=ruleForm
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
                if(this.isNew){
                    this.$message.success('添加成功')
                }else{
                    this.$message.success('修改成功')
                }
                this.addDialogVisible = false
            } else {
            console.log('error submit!!');
            return false;
            }
          });
        },
        handleSizeChange(size) {
          this.query.pageSize = size
          this.getData()
        },
        handleCurrentChange(num) {
          this.query.pageNum = num
          this.getData()
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