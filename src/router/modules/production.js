/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productionRouter = {
  path: '/production',
  component: Layout,
  redirect: '/production/workorder',
  name: 'production',
  alwaysShow: true, // 一直显示根路由
  meta: {
    title: '生产管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'workorder',
      name: 'workorder',
      component: () => import('@/views/production/work-order'),
      meta: { title: '工单管理', icon: 'dashboard' }
    },
    {
      path: 'shiporder',
      name: 'shiporder',
      component: () => import('@/views/production/ship-order'),
      meta: { title: '出货单管理', icon: 'dashboard' }
    },
    {
      path: 'rewinditem',
      name: 'rewindItem',
      component: () => import('@/views/production/rewind'),
      meta: { title: '重卷报工', icon: 'dashboard' }
    }
  ]
}

export default productionRouter
