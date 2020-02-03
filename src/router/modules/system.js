/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  alwaysShow: true, // will always show the root menu
  name: 'system',
  meta: {
    title: '系统管理',
    icon: 'lock'
    // roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/system/user'),
      name: 'user',
      meta: { title: '用户管理', icon: 'dashboard' }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role'),
      name: 'role',
      meta: { title: '角色管理', icon: 'dashboard' }
    },
    {
      path: 'menu',
      component: () => import('@/views/system/menu'),
      name: 'menu',
      meta: { title: '菜单管理', icon: 'dashboard' }
    },
    {
      path: 'dictionary',
      component: () => import('@/views/system/dictionary/index'),
      name: 'dictionary',
      meta: { title: '数据字典', icon: 'dashboard' }
    },
    {
      path: 'coderule',
      component: () => import('@/views/system/code-rule'),
      name: 'codeRule',
      meta: { title: '编码规则', icon: 'dashboard' }
    },
    {
      path: 'department',
      name: 'department',
      component: () => import('@/views/system/department'),
      meta: { title: '部门管理', icon: 'dashboard' }
    }

  ]
}

export default systemRouter
