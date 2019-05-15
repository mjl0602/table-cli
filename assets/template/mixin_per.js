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
    created() {
        this.defaultData = Object.assign({},this.formData)
    },
    methods:{
        async getData(){
            this.listLoading = true 
            let res = await new Promise((r,e)=>{
                r({
                    count: 100,
                    rows: [1,2,3]
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
            this.formData = this.formData
        },
        edit(row){
            this.isNew = false
            this.formData = row
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
                } else {
                console.log('error submit!!');
                return false;
                }
            });
        },
        
    }
}