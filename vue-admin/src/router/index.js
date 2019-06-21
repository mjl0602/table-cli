import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout/Layout'

/* Router Modules */

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  }
  // { path: '*', redirect: '/404', hidden: true }

]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  /** When your routing table is too long, you can split it into small modules**/
  // {
  //   path: '/course',
  //   component: Layout,
  //   meta: { title: '课程管理', icon: 'guide', roles: ['admin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'course',
  //       component: () => import('@/views/course/index.vue'),
  //       meta: { title: '课程列表', icon: 'list' }
  //     },
  //     {
  //       path: 'class',
  //       name: 'courseclass',
  //       component: () => import('@/views/course/class.vue'),
  //       meta: { title: '分类管理', icon: 'drag' }
  //     },
  //     {
  //       path: 'department',
  //       name: 'coursedepartment',
  //       component: () => import('@/views/course/department.vue'),
  //       meta: { title: '岗位管理', icon: 'eye' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterprise',
  //   component: Layout,
  //   meta: { roles: ['admin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'user',
  //       component: () => import('@/views/enterprise/index'),
  //       meta: { title: '企业账户管理', icon: 'user' }
  //     }
  //   ]
  // },
  // {
  //   path: '/teacher',
  //   component: Layout,
  //   meta: { roles: ['admin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'teacher',
  //       component: () => import('@/views/teacher/index'),
  //       meta: { title: '老师管理', icon: 'form' }
  //     }
  //   ]
  // },
  // {
  //   path: '/data',
  //   component: Layout,
  //   meta: { title: '资料管理', icon: 'email', roles: ['admin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'data',
  //       component: () => import('@/views/data/index.vue'),
  //       meta: { title: '资料列表', icon: 'list' }
  //     },
  //     {
  //       path: 'class',
  //       name: 'dataclass',
  //       component: () => import('@/views/data/class.vue'),
  //       meta: { title: '分类列表', icon: 'size' }
  //     }
  //   ]
  // },
  // {
  //   path: '/staff',
  //   component: Layout,
  //   meta: { title: '员工管理', icon: 'user', roles: ['enterprise'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'staff',
  //       component: () => import('@/views/enterpriseAdmin/staff/index.vue'),
  //       meta: { title: '员工列表', icon: 'list' }
  //     },
  //     {
  //       path: 'class',
  //       name: 'department',
  //       component: () => import('@/views/enterpriseAdmin/staff/department.vue'),
  //       meta: { title: '部门列表', icon: 'list' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseCourse',
  //   component: Layout,
  //   meta: { title: '课程管理', icon: 'guide', roles: ['enterprise', 'agencyAdmin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'enterpriseCourse',
  //       component: () => import('@/views/enterpriseAdmin/course/index.vue'),
  //       meta: { title: '课程列表', icon: 'list' }
  //     },
  //     {
  //       path: 'platform',
  //       name: 'courseplatform',
  //       component: () => import('@/views/enterpriseAdmin/course/platform.vue'),
  //       meta: { title: '平台课程库', icon: 'pdf' }
  //     },
  //     {
  //       path: 'special',
  //       name: 'coursespecial',
  //       component: () => import('@/views/enterpriseAdmin/course/special.vue'),
  //       meta: { title: '专题管理', icon: 'lock' }
  //     }
  //     // {
  //     //   path: 'banner',
  //     //   name: 'coursebanner',
  //     //   component: () => import('@/views/banner/index.vue'),
  //     //   meta: { title: '首页广告', icon: 'nested' }
  //     // }
  //   ]
  // },
  // {
  //   path: '/enterpriseDatum',
  //   component: Layout,
  //   meta: { title: '资料管理', icon: 'chart', roles: ['enterprise', 'agencyAdmin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'enterpriseDatum',
  //       component: () => import('@/views/enterpriseAdmin/datum/index.vue'),
  //       meta: { title: '资料列表', icon: 'list' }
  //     },
  //     {
  //       path: 'platform',
  //       name: 'datumplatform',
  //       component: () => import('@/views/enterpriseAdmin/datum/platform.vue'),
  //       meta: { title: '平台资料库', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseExam',
  //   component: Layout,
  //   meta: { roles: ['enterprise', 'agencyAdmin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'enterpriseExam',
  //       component: () => import('@/views/exam/index'),
  //       meta: { title: '考试管理', icon: 'people' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseBanner',
  //   component: Layout,
  //   meta: { roles: ['enterprise'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'enterpriseBanner',
  //       component: () => import('@/views/banner/index.vue'),
  //       meta: { title: '首页广告', icon: 'edit' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseIssue',
  //   component: Layout,
  //   meta: { roles: ['enterprise', 'agencyAdmin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'enterpriseIssue',
  //       component: () => import('@/views/issue/index'),
  //       meta: { title: '问答管理', icon: 'size' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseTest',
  //   component: Layout,
  //   meta: { roles: ['enterprise', 'agencyAdmin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'enterpriseTest',
  //       component: () => import('@/views/test/index'),
  //       meta: { title: '测评管理', icon: 'star' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseIssue/info/:id',
  //   component: Layout,
  //   hidden: true,
  //   meta: { roles: ['enterprise', 'agencyAdmin'] },
  //   children: [
  //     {
  //       path: '',
  //       name: 'enterpriseExamInfo',
  //       component: () => import('@/views/issue/info'),
  //       meta: { title: '问答详情', icon: 'tab' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseActivity',
  //   component: Layout,
  //   meta: { roles: ['enterprise', 'agencyAdmin'] },
  //   children: [
  //     {
  //       path: '',
  //       name: 'enterpriseActivity',
  //       component: () => import('@/views/activity/index'),
  //       meta: { title: '活动管理', icon: 'zip' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseMessage',
  //   component: Layout,
  //   meta: { roles: ['enterprise', 'agencyAdmin'] },
  //   children: [
  //     {
  //       path: '',
  //       name: 'enterpriseMessage',
  //       component: () => import('@/views/message/index'),
  //       meta: { title: '消息管理', icon: 'link' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseSendCourse',
  //   component: Layout,
  //   meta: { roles: ['enterprise'] },
  //   children: [
  //     {
  //       path: '',
  //       name: 'enterpriseSendCourse',
  //       component: () => import('@/views/sendCourse/index'),
  //       meta: { title: '课程分发', icon: 'language' }
  //     }
  //   ]
  // },
  // {
  //   path: '/enterpriseUserInfo',
  //   component: Layout,
  //   meta: { roles: ['enterprise'] },
  //   children: [
  //     {
  //       path: '',
  //       name: 'enterpriseUserInfo',
  //       component: () => import('@/views/user/index'),
  //       meta: { title: '企业账户详情', icon: 'form' }
  //     }
  //   ]
  // },
  {
    path: '/drag',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: '',
        name: 'drag_test',
        component: () => import('@/views/drag_test/index'),
        meta: { title: '拖拽测试', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export const needCache = (function() {
  const result = []
  asyncRouterMap.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (!el.meta.noCache) {
          result.push(el.name)
        }
      })
    }
  })
  return result
})()
