/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/order',
  name: 'order',
  alwaysShow: true, // 一直显示根路由
  meta: {
    title: '订单管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'order',
      name: 'order',
      component: () => import('@/views/order/order'),
      meta: { title: '订单管理', icon: 'dashboard' }
    }
  ]
}

export default orderRouter
