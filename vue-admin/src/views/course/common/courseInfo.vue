<template>
  <el-dialog :visible.sync="seeVisible" title="课程查看">
    <el-form
      ref="ruleForm"
      :model="formData"

      label-position="left"
      label-width="100px"
      style="width: 80%; margin-left:50px;"
    >
      <el-form-item label="课程名称">
        <!-- <el-input v-model="formData.name" placeholder="请输入课程名称" /> -->
        <span>{{ formData.name }}</span>
      </el-form-item>
      <el-form-item label="课程分类">
        <span>{{ formData.classes.toString() }}</span>
      </el-form-item>
      <el-form-item label="课程学分">
        <span>{{ formData.credit }}</span>
      </el-form-item>
      <el-form-item label="课程老师">
        <span>{{ formData.teacher?formData.teacher.name:"" }}</span>
      </el-form-item>
      <el-form-item label="上传图片">
        <ttx-upload-img v-model="formData.banners" :editable="false" />
      </el-form-item>

      <el-form-item label="所属岗位">
        <span>{{ formData.department.toString() }}</span>
      </el-form-item>

      <el-form-item label="上线状态">
        <span>{{ formData.isOnline?'上线':'下线' }}</span>
      </el-form-item>

      <el-form-item label="课时">
        <el-table :data="formData.chapters" border fit>
          <el-table-column label="编号" align="center">
            <template slot-scope="scope">
              {{ scope.$index*1+1 }}
            </template>
          </el-table-column>
          <el-table-column label="课时名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="上传附件" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.file[0]?scope.row.file[0].name:"" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="播放时长" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.file[0]?parseSecond(scope.row.file[0].duration):'' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="课程内容">
        <div v-html="formData.detail" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="seeVisible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { parseSecond } from '@/utils'

export default {
  props: {
    teachers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      seeVisible: false,
      formData: {
        chapters: [],
        classes: [
          { file: [] }
        ],

        department: [],
        banners: []
      }
    }
  },

  methods: {
    parseSecond
  }
}
</script>

