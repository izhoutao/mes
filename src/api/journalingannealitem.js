import request from '@/utils/request'

export function getJournalingAnnealItems(data) {
  return request({
    url: `/basic/journalingannealitem/list`,
    method: 'post',
    data
  })
}

export function addJournalingAnnealItem(data) {
  return request({
    url: '/basic/journalingannealitem',
    method: 'post',
    data
  })
}

export function updateJournalingAnnealItem(data) {
  return request({
    url: `/basic/journalingannealitem`,
    method: 'put',
    data
  })
}

export function deleteJournalingAnnealItem(id) {
  return request({
    url: `/basic/journalingannealitem/${id}`,
    method: 'delete'
  })
}

