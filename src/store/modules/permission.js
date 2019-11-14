import { asyncRoutes, constantRoutes } from '@/router'
import { getAsyncRoutes } from '../../api/role'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 *
 * @param {arr} clientAsyncRoutes 前端保存动态路由
 * @param {arr} serverRouter 后端保存动态路由
 */
function makePermissionRouters(serverRoutes, clientAsyncRoutes) {
  clientAsyncRoutes.map(ele => {
    // console.log(JSON.stringify(ele))
    if (!ele.name || (!ele.meta && !ele.meta.roles)) return
    let roles_obj
    for (let i = 0; i < serverRoutes.length; i++) {
      const element = serverRoutes[i]
      if (ele.name === element.code) {
        roles_obj = element
      }
    }
    roles_obj && (ele.meta.roles = roles_obj.roles)

    if (ele.children) {
      makePermissionRouters(serverRoutes, ele.children)
    }
  })
  return clientAsyncRoutes
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes({ commit }, roles) {
    let PermissionRouters = await getAsyncRoutes().then(res => {
      const data = res.queryResult.list
      PermissionRouters = makePermissionRouters(data, asyncRoutes)
      return PermissionRouters
    })

    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {

        accessedRoutes = PermissionRouters || []
      } else {
        accessedRoutes = filterAsyncRoutes(PermissionRouters, roles)
      }

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
