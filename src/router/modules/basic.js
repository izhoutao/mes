/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const basicRouter = {
  path: '/basic',
  component: Layout,
  redirect: '/basic/factory',
  name: 'basic',
  alwaysShow: true, // 一直显示根路由
  meta: {
    title: '基础配置',
    icon: 'lock'
  },
  children: [
    {
      path: 'factory',
      component: () => import('@/views/basic'), // Parent router-view
      name: 'factory',
      meta: {
        title: '工厂建模',
        icon: 'lock'
      },
      redirect: '/basic/factory/operation',
      children: [
        {
          path: 'operation',
          name: 'operation',
          component: () => import('@/views/basic/factory/operation.vue'),
          meta: { title: '生产工艺', icon: 'dashboard' }
        },
        {
          path: 'line',
          name: 'productionLine',
          component: () => import('@/views/basic/factory/line.vue'),
          meta: { title: '线别管理', icon: 'dashboard' }
        },
        {
          path: 'shift',
          name: 'shift',
          component: () => import('@/views/basic/factory/shift.vue'),
          meta: { title: '班别管理', icon: 'dashboard' }
        },
        {
          path: 'printer',
          name: 'printer',
          component: () => import('@/views/basic/factory/printer.vue'),
          meta: { title: '打印机管理', icon: 'dashboard' }
        }
      ]
    },
    {
      path: 'product',
      component: () => import('@/views/basic'), // Parent router-view
      name: 'product',
      meta: {
        title: '产品建模',
        icon: 'lock'
      },
      redirect: '/basic/product/materialtype',
      children: [
        {
          path: 'materialtype',
          name: 'materialType',
          component: () => import('@/views/basic/product/material-type.vue'),
          meta: { title: '物料类型管理', icon: 'dashboard' }
        },
        {
          path: 'material',
          name: 'material',
          component: () => import('@/views/basic/product/material.vue'),
          meta: { title: '物料管理', icon: 'dashboard' }
        }
      ]
    },
    {
      path: 'process',
      component: () => import('@/views/basic'), // Parent router-view
      name: 'process',
      meta: {
        title: '工艺建模',
        icon: 'lock'
      },
      redirect: '/basic/process/defectgroup',
      children: [
        {
          path: 'defectgroup',
          name: 'defectGroup',
          component: () => import('@/views/basic/process/defect-group.vue'),
          meta: { title: '不良代码组', icon: 'dashboard' }
        },
        {
          path: 'defect',
          name: 'defect',
          component: () => import('@/views/basic/process/defect.vue'),
          meta: { title: '不良代码', icon: 'dashboard' }
        },
        {
          path: 'linestation',
          name: 'lineStation',
          component: () => import('@/views/basic/process/line-station.vue'),
          meta: { title: '线别工站', icon: 'dashboard' }
        },
        {
          path: 'workflow',
          name: 'workflow',
          component: () => import('@/views/basic/process/workflow/index'),
          meta: { title: '生产路线', icon: 'dashboard' }
        }
      ]
    },
    {
      path: 'storage',
      component: () => import('@/views/basic'), // Parent router-view
      name: 'storage',
      alwaysShow: true, // 一直显示根路由
      meta: {
        title: '仓储建模',
        icon: 'lock'
      },
      redirect: '/basic/storage/warehouse',
      children: [
        {
          path: 'vendor',
          name: 'vendor',
          component: () => import('@/views/basic/storage/vendor.vue'),
          meta: { title: '供应商管理', icon: 'dashboard' }
        },
        {
          path: 'customer',
          name: 'customer',
          component: () => import('@/views/basic/storage/customer.vue'),
          meta: { title: '客户管理', icon: 'dashboard' }
        },
        {
          path: 'warehouse',
          name: 'warehouse',
          component: () => import('@/views/basic/storage/warehouse.vue'),
          meta: { title: '仓库管理', icon: 'dashboard' }
        }
      ]
    }
    /*{
      path: 'quality',
      component: () => import('@/views/basic'), // Parent router-view
      name: 'qualitymodel',
      alwaysShow: true, // 一直显示根路由
      meta: {
        title: '品质建模',
        icon: 'lock'
      },
      redirect: '/basic/quality/inspectionrule',
      children: [
        {
          path: 'inspectionrule',
          name: 'inspection',
          component: () => import('@/views/basic/quality/inspection-rule'),
          meta: { title: '检规维护', icon: 'dashboard' }
        }

      ]
    }*/
  ]
}

export default basicRouter
