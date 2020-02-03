/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const journalingRouter = {
  path: '/journaling',
  component: Layout,
  redirect: '/journaling/rewinditem',
  name: 'journaling',
  alwaysShow: true, // 一直显示根路由
  meta: {
    title: '生产管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'rewinditem',
      name: 'rewindItem',
      component: () => import('@/views/journaling/rewind/rewind-item'),
      meta: { title: '重卷报工', icon: 'dashboard' }
    },
    {
      path: 'rewind',
      name: 'rewind',
      component: () => import('@/views/journaling/rewind/rewind'),
      meta: { title: '重卷报工', icon: 'dashboard' }
    }

  ]
}

export default journalingRouter
