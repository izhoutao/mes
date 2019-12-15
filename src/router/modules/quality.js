/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const qualityRouter = {
  path: '/quality',
  component: Layout,
  redirect: '/quality/iqc',
  name: 'quality',
  alwaysShow: true, // 一直显示根路由
  meta: {
    title: '品质管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'iqc',
      name: 'iqc:list',
      component: () => import('@/views/quality/iqc/index'),
      meta: { title: '进料检验', icon: 'dashboard' }
    },
    {
      path: 'ipqc',
      name: 'ipqc:list',
      component: () => import('@/views/quality/ipqc/index'),
      meta: { title: '制程检验', icon: 'dashboard' }
    }
  ]
}

export default qualityRouter
