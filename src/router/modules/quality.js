/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const qualityRouter = {
  path: '/quality',
  component: Layout,
  redirect: '/quality/ipqc_maint',
  name: 'quality',
  alwaysShow: true, // 一直显示根路由
  meta: {
    title: '品质管理',
    icon: 'lock'
  },
  children: [
/*    {
      path: 'iqc',
      name: 'iqc',
      component: () => import('@/views/quality/iqc/index'),
      meta: { title: '进料检验', icon: 'dashboard' }
    },*/
    {
      path: 'ipqc_maint',
      name: 'ipqc_maint',
      component: () => import('@/views/quality/ipqc1/index'),
      meta: { title: '质检资料维护', icon: 'dashboard' }
    },
    {
      path: 'ipqc_check',
      name: 'ipqc_check',
      component: () => import('@/views/quality/ipqc2/index'),
      meta: { title: '质检资料复判', icon: 'dashboard' }
    },
    {
      path: 'ipqc_query',
      name: 'ipqc_query',
      component: () => import('@/views/quality/ipqc3/index'),
      meta: { title: '质检资料维查询', icon: 'dashboard' }
    },
    {
      path: 'ipqc_prodution_defect',
      name: 'ipqc_prodution_defect',
      component: () => import('@/views/quality/prodution-defect'),
      meta: { title: '缺陷等级查询', icon: 'dashboard' }
    },
  ]
}

export default qualityRouter
