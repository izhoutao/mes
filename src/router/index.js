import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import basicRouter from './modules/basic'
import repositoryRouter from './modules/repository'
import systemRouter from './modules/system'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have system requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/basic',
  //   component: Layout,
  //   redirect: '/basic/operation',
  //   name: 'basic',
  //   alwaysShow: true, // 一直显示根路由
  //   meta: {
  //     title: '基础配置',
  //     icon: 'lock'
  //     // roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'operation',
  //       name: 'operation:list',
  //       component: () => import('@/views/basic/factory/operation.vue'),
  //       meta: { title: '生产工艺', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'workflow',
  //       name: 'workflow:list',
  //       component: () => import('@/views/basic/process/workflow/index'),
  //       meta: { title: '生产路线', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'defectgroup',
  //       name: 'defectGroup:list',
  //       component: () => import('@/views/basic/process/defect-group.vue'),
  //       meta: { title: '不良代码组', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'defect',
  //       name: 'defect:list',
  //       component: () => import('@/views/basic/process/defect.vue'),
  //       meta: { title: '不良代码', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'line',
  //       name: 'line:list',
  //       component: () => import('@/views/basic/factory/line.vue'),
  //       meta: { title: '线别管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'shift',
  //       name: 'shift:list',
  //       component: () => import('@/views/basic/factory/shift.vue'),
  //       meta: { title: '班别管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'printer',
  //       name: 'printer:list',
  //       component: () => import('@/views/basic/factory/printer.vue'),
  //       meta: { title: '打印机管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'warehouse',
  //       name: 'warehouse:list',
  //       component: () => import('@/views/basic/storage/warehouse.vue'),
  //       meta: { title: '仓库管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'vendor',
  //       name: 'vendor:list',
  //       component: () => import('@/views/basic/storage/vendor.vue'),
  //       meta: { title: '供应商管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'customer',
  //       name: 'customer:list',
  //       component: () => import('@/views/basic/storage/customer.vue'),
  //       meta: { title: '客户管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'material',
  //       name: 'material:list',
  //       component: () => import('@/views/basic/product/material.vue'),
  //       meta: { title: '物料管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'materialtype',
  //       name: 'materialType:list',
  //       component: () => import('@/views/basic/product/material-type.vue'),
  //       meta: { title: '物料类型管理', icon: 'dashboard' }
  //     }
  //     /*      {
  //             path: 'defect',
  //             name: 'Defect',
  //             component: () => import('@/views/basic/defect'),
  //             meta: { title: '不良代码', icon: 'dashboard' }
  //           },*/
  //   ]
  // },
  // {
  //   path: '/warehouse',
  //   component: Layout,
  //   redirect: '/warehouse/inboundorder',
  //   name: 'basic',
  //   alwaysShow: true, // 一直显示根路由
  //   meta: {
  //     title: '仓库管理',
  //     icon: 'lock'
  //     // roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'inboundorder',
  //       name: 'inboundorder:list',
  //       component: () => import('@/views/repository/inbound-order/index'),
  //       meta: { title: '入库单管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'outboundorder',
  //       name: 'outboundorder:list',
  //       component: () => import('@/views/repository/outbound-order/index'),
  //       meta: { title: '出库单管理', icon: 'dashboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'system',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'lock'
  //     // roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'user',
  //       component: () => import('@/views/system/user'),
  //       name: 'user:list',
  //       meta: { title: '用户管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/system/role'),
  //       name: 'role:list',
  //       meta: { title: '角色管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/system/menu'),
  //       name: 'menu:list',
  //       meta: { title: '菜单管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'dictionary',
  //       component: () => import('@/views/system/dictionary/index'),
  //       name: 'dictionary:list',
  //       meta: { title: '数据字典', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'department',
  //       name: 'department:list',
  //       component: () => import('@/views/system/department'),
  //       meta: { title: '部门管理', icon: 'dashboard' }
  //     }
  //
  //   ]
  // },
  basicRouter,
  repositoryRouter,
  systemRouter,
  {
    path: 'help',
    component: Layout,
    children: [
      {
        path: 'https://www.baidu.com',
        meta: { title: '帮助', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
