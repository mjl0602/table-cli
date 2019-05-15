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
        }
    }
}