import request from '@/utils/request'

export function getJournalingRewindItems(data) {
  return request({
    url: `/basic/journalingrewinditem/list`,
    method: 'post',
    data
  })
}

export function addJournalingRewindItem(data) {
  return request({
    url: '/basic/journalingrewinditem',
    method: 'post',
    data
  })
}

export function updateJournalingRewindItem(data) {
  return request({
    url: `/basic/journalingrewinditem`,
    method: 'put',
    data
  })
}

export function deleteJournalingRewindItem(id) {
  return request({
    url: `/basic/journalingrewinditem/${id}`,
    method: 'delete'
  })
}

