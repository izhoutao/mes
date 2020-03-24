import request from '@/utils/request'

export function getResources(data) {
  return request({
    url: `/basic/resource/list`,
    method: 'post',
    data
  })
}

export function addResource(data) {
  return request({
    url: '/basic/resource',
    method: 'post',
    data
  })
}

export function updateResource(data) {
  return request({
    url: `/basic/resource`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: `/basic/resource/${id}`,
    method: 'delete'
  })
}

