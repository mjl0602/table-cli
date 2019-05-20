
export default {

    data(){
        return {
            formData:{
                //<!-- formData insert -->
            },
            defaultData:{

            },
            rules:{
               //<!-- rules insert -->
            }
        }
    },
    watch: {
        addDialogVisible(val) {
            if(!val){
                this.$refs.ruleForm.resetFields()
                this.formData = Object.assign({},this.defaultData)
            }
        },
    },
    created() {
        this.defaultData = Object.assign({},this.formData)
    },
    methods:{
        async getData(){
            this.listLoading = true 
            let res = await new Promise((r,e)=>{
                r({
                    count: 100,
                    rows: [{id:10,name: 'tom'}]
                })
            })
            this.listLoading = false
            if(res){
                this.list = res.rows
                this.total = res.count
            }
        },
    
        add(){
            this.isNew = true
            this.formData = Object.assign({},this.defaultData)
            this.addDialogVisible = true
        },
        edit(row){
            this.isNew = false
            this.formData = Object.assign({},row)
            this.addDialogVisible = true

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
        
    }
    
}



