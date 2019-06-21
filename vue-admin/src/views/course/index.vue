<template>
  <base-course :urls="urls" :type="1" />
</template>
<script>
// type=1 系统端课程列表
import BaseCourse from './common/index'
export default {
  components: {
    BaseCourse
  },
  data() {
    return {
      urls: {
        main: 'course',
        department: 'department/all',
        class: 'courseClass/all',
        info: 'course',
        del: 'course'
      }
    }
  }
}
</script>

