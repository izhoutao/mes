/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const repositoryRouter = {
  path: '/repository',
  component: Layout,
  redirect: '/repository/inboundorder',
  name: 'repository',
  alwaysShow: true, // 一直显示根路由
  meta: {
    title: '仓储管理',
    icon: 'lock'
  },
  children: [
    /*    {
          path: 'inboundorder',
          name: 'inbound',
          component: () => import('@/views/repository/inbound-order/index'),
          meta: { title: '入库单管理', icon: 'dashboard' }
        },*/
    {
      path: 'inboundorderraw',
      name: 'inboundRaw',
      component: () => import('@/views/repository/inbound-order-raw/index'),
      meta: { title: '原料入库', icon: 'dashboard' }
    },
    {
      path: 'outboundorderraw',
      name: 'outboundRaw',
      component: () => import('@/views/repository/outbound-order-raw/index'),
      meta: { title: '工单发料出库', icon: 'dashboard' }
    }
    /*    {
          path: 'outboundorder',
          name: 'outbound',
          component: () => import('@/views/repository/outbound-order/index'),
          meta: { title: '出库单管理', icon: 'dashboard' }
        }*/
  ]
}

export default repositoryRouter
