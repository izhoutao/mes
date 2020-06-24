import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUserInfoFromJwt, setUserSession } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  sex: '',
  avatar: '',
  department: '',
  phone: '',
  email: '',
  roles: [],
  staffId: '',
  id: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_DEPARTMENT: (state, department) => {
    state.department = department
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_STAFF_ID: (state, staffId) => {
    state.staffId = staffId
  },
  SET_ID: (state, id) => {
    state.id = id
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        // setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { jwt } = response
        const activeUser = getUserInfoFromJwt(jwt)
        if (activeUser) {
          setUserSession('activeUser', JSON.stringify(activeUser))
        } else {
          reject('验证失败，请重新登录。')
        }
        const { roles, name, username, avatar, department, staffId, id, sex, email, phone } = activeUser
        // alert(JSON.stringify(activeUser))
        // const { data } = response
        //
        // if (!data) {
        //   reject('Verification failed, please Login again.')
        // }
        //
        // const { roles, name, avatar, description } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('该用户未被赋予角色！')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_USERNAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_DEPARTMENT', department)
        commit('SET_SEX', sex)
        commit('SET_EMAIL', email)
        commit('SET_PHONE', phone)
        commit('SET_STAFF_ID', staffId)
        commit('SET_ID', id)
        resolve(activeUser)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      // setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
