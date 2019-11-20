import request from '@/utils/request'

export function getLines(data) {
  return request({
    url: `/basic/line/list`,
    method: 'post',
    data
  })
}

export function addLine(data) {
  return request({
    url: '/basic/line',
    method: 'post',
    data
  })
}

export function updateLine(data) {
  return request({
    url: `/basic/line`,
    method: 'put',
    data
  })
}

export function deleteLine(id) {
  return request({
    url: `/basic/line/${id}`,
    method: 'delete'
  })
}

