import request from '@/utils/request'

export function getJournalingRollingMillItems(data) {
  return request({
    url: `/basic/journalingrollingmillitem/list`,
    method: 'post',
    data
  })
}

export function addJournalingRollingMillItem(data) {
  return request({
    url: '/basic/journalingrollingmillitem',
    method: 'post',
    data
  })
}

export function updateJournalingRollingMillItem(data) {
  return request({
    url: `/basic/journalingrollingmillitem`,
    method: 'put',
    data
  })
}

export function deleteJournalingRollingMillItem(id) {
  return request({
    url: `/basic/journalingrollingmillitem/${id}`,
    method: 'delete'
  })
}

