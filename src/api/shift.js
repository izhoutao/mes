import request from '@/utils/request'

export function getShifts(data) {
  return request({
    url: `/basic/shift/list`,
    method: 'post',
    data
  })
}

export function addShift(data) {
  return request({
    url: '/basic/shift',
    method: 'post',
    data
  })
}

export function updateShift(data) {
  return request({
    url: `/basic/shift`,
    method: 'put',
    data
  })
}

export function deleteShift(id) {
  return request({
    url: `/basic/shift/${id}`,
    method: 'delete'
  })
}

