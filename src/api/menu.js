import request from '@/utils/request'

export function getMenus(data) {
  return request({
    url: '/ucenter/menu/list',
    method: 'post',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/ucenter/menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: `/ucenter/menu`,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/ucenter/menu/${id}`,
    method: 'delete'
  })
}

