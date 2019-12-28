import request from '@/utils/request'

export function getJournalingRewinds(data) {
  return request({
    url: `/basic/journalingrewind/list`,
    method: 'post',
    data
  })
}

export function addJournalingRewind(data) {
  return request({
    url: '/basic/journalingrewind',
    method: 'post',
    data
  })
}

export function updateJournalingRewind(data) {
  return request({
    url: `/basic/journalingrewind`,
    method: 'put',
    data
  })
}

export function deleteJournalingRewind(id) {
  return request({
    url: `/basic/journalingrewind/${id}`,
    method: 'delete'
  })
}

