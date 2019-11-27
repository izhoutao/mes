import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '../../api/role'

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
function makePermissionRouters(routeMap, clientAsyncRoutes) {
  clientAsyncRoutes.forEach(ele => {
    // console.log(JSON.stringify(ele))
    if (!ele.name) return
    if (routeMap[ele.name]) (ele.meta.roles = routeMap[ele.name].roleList.map(role => role.code))
    if (ele.children) {
      makePermissionRouters(routeMap, ele.children)
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
    const res = await getRoutes()
    const routes = res.queryResult.list
    const routesMap = Object.fromEntries(routes.map(route => {
      return { [route.code]: route }
    }))
    const permissionRouters = makePermissionRouters(routesMap, asyncRoutes)
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = permissionRouters || []
      } else {
        accessedRoutes = filterAsyncRoutes(permissionRouters, roles)
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
