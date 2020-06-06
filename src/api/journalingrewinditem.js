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

export function saveOrUpdateSplitRawItem(productNumber, data) {
  return request({
    url: `/basic/journalingrewinditem/split/${productNumber}`,
    method: 'post',
    data
  })
}

export function splitRawItem(productNumber) {
  return request({
    url: `/basic/journalingrewinditem/split/${productNumber}`,
    method: 'get'
  })
}

export function undoSplitRawItem(productNumber) {
  return request({
    url: `/basic/journalingrewinditem/split/undo/${productNumber}`,
    method: 'get'
  })
}

export function removeSplitRawItem(id) {
  return request({
    url: `/basic/journalingrewinditem/split/delete/${id}`,
    method: 'get'
  })
}


