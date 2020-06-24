import request from '@/utils/request'

export function getUsers(data) {
  return request({
    url: `/ucenter/user/list`,
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/ucenter/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/ucenter/user`,
    method: 'put',
    data
  })
}
export function updateProfile(data) {
  return request({
    url: `/ucenter/user/updateProfile`,
    method: 'put',
    data
  })
}
export function updateUserPass(data) {
  return request({
    url: `/ucenter/user/updatePass`,
    method: 'put',
    data
  })
}
export function updateUserAvatar(data) {
  return request({
    url: `/ucenter/user/updateAvatar`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/ucenter/user/${id}`,
    method: 'delete'
  })
}

