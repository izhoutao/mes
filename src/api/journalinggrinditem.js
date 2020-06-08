import request from '@/utils/request'

export function getJournalingGrindItems(data) {
  return request({
    url: `/basic/journalinggrinditem/list`,
    method: 'post',
    data
  })
}

export function addJournalingGrindItem(data) {
  return request({
    url: '/basic/journalinggrinditem',
    method: 'post',
    data
  })
}

export function updateJournalingGrindItem(data) {
  return request({
    url: `/basic/journalinggrinditem`,
    method: 'put',
    data
  })
}

export function deleteJournalingGrindItem(id) {
  return request({
    url: `/basic/journalinggrinditem/${id}`,
    method: 'delete'
  })
}


