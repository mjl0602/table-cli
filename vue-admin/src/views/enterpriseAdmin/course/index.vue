<template>
  <base-course :urls="urls" :type="2" />
</template>
<script>
// type=2 代表企业课程列表
import BaseCourse from '../../course/common/index'
export default {
  components: {
    BaseCourse
  },
  data() {
    return {
      urls: {
        main: 'enterpriseAdmin/enterpriseCourse',
        department: 'enterpriseAdmin/department/all',
        class: 'enterpriseAdmin/courseClass/all',
        info: 'enterpriseAdmin/course',
        del: 'enterpriseAdmin/enterpriseCourse'

      }
    }
  }
}
</script>
