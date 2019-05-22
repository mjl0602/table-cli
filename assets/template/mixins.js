export default {
    computed: {
        dialogTitle() {
          return (this.isNew ? "新增" : "修改") + this.objStr;
        },
    },
    data(){
        var checkInteger = (rule, value, callback) => {
            if (!/^[1-9][0-9]*+$/.test(value)) {
              callback(new Error('请输入整数'));
            } else {
              callback();
            }
          }; 
        var checkNumber = (rule, value, callback) => {
            if (!/^\d+(\.\d{0,2})?$/.test(value)) {
              callback(new Error('请输入数字值,最多两位小数'));
            } else {
              callback();
            }
          };
        var checkPhone = (rule, value, callback) => {
            if (!/^1[3-9]\d{9}$/.test(value)) {
              callback(new Error('请输入正确的手机号码'));
            } else {
              callback();
            }
          };
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
        this.getData()
    },
    methods:{
        getData(){
            console.log('click getData')
        },
        add(){
            console.log('click add')
        },
        edit(){
            console.log('click edit')
        },
        handleSizeChange(size) {
          this.query.pageSize = size
          this.getData()
        },
        handleCurrentChange(num) {
          this.query.pageNum = num
          this.getData()
        }
    }
}