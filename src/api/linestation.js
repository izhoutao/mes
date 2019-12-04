import request from '@/utils/request'

export function getLineStations(data) {
  return request({
    url: `/basic/linestation/list`,
    method: 'post',
    data
  })
}

export function addLineStation(data) {
  return request({
    url: '/basic/linestation',
    method: 'post',
    data
  })
}

export function updateLineStation(data) {
  return request({
    url: `/basic/linestation`,
    method: 'put',
    data
  })
}

export function deleteLineStation(id) {
  return request({
    url: `/basic/linestation/${id}`,
    method: 'delete'
  })
}

