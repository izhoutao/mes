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
    /*    {
          path: 'shiporder',
          name: 'shiporder',
          component: () => import('@/views/production/ship-order'),
          meta: { title: '出货单管理', icon: 'dashboard' }
        },*/
    {
      path: 'rewinditem',
      name: 'rewindItem',
      component: () => import('@/views/production/rewind/item'),
      meta: { title: '重卷报工', icon: 'dashboard' }
    },
    {
      path: 'rollingmillitem',
      name: 'rollingMillItem',
      component: () => import('@/views/production/rolling-mill/item'),
      meta: { title: '轧机报工', icon: 'dashboard' }
    },
    {
      path: 'annealitem',
      name: 'annealItem',
      component: () => import('@/views/production/anneal/item'),
      meta: { title: '退火炉报工', icon: 'dashboard' }
    },
    {
      path: 'finishingtensionleveleritem',
      name: 'finishingTensionLevelerItem',
      component: () => import('@/views/production/finishing-tension-leveler/item'),
      meta: { title: '精整拉矫报工', icon: 'dashboard' }
    },
    {
      path: 'productionshiftreport',
      name: 'productionShiftReport',
      component: () => import('@/views/production/production-shift/report'),
      meta: { title: '生产班管理', icon: 'dashboard' }
    },
    {
      path: 'grinditem',
      name: 'grindItem',
      component: () => import('@/views/production/grind/item'),
      meta: { title: '磨床报工', icon: 'dashboard' }
    },
    {
      path: 'grindshiftreport',
      name: 'grindShiftReport',
      component: () => import('@/views/production/grind-shift/report'),
      meta: { title: '研磨班管理', icon: 'dashboard' }
    }

  ]
}

export default productionRouter
