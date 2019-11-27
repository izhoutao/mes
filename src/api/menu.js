import request from '@/utils/request'

export function getMenus(data) {
  return request({
    url: '/basic/menu/list',
    method: 'post',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/basic/menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: `/basic/menu`,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/basic/menu/${id}`,
    method: 'delete'
  })
}

