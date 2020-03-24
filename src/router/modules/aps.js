/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const apsRouter = {
  path: '/aps',
  component: Layout,
  redirect: '/aps/resource',
  name: 'apsManagement',
  alwaysShow: true, // 一直显示根路由
  meta: {
    title: '工单排产',
    icon: 'lock'
  },
  children: [
    {
      path: 'resource',
      name: 'resource',
      component: () => import('@/views/aps/resource'),
      meta: { title: '排产资源管理', icon: 'dashboard' }
    }
  ]
}

export default apsRouter
