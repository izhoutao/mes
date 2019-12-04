import request from '@/utils/request'

export function getLineStationPrinters(data) {
  return request({
    url: `/basic/linestationprinter/list`,
    method: 'post',
    data
  })
}

export function addLineStationPrinter(data) {
  return request({
    url: '/basic/linestationprinter',
    method: 'post',
    data
  })
}

export function updateLineStationPrinter(data) {
  return request({
    url: `/basic/linestationprinter`,
    method: 'put',
    data
  })
}

export function deleteLineStationPrinter(id) {
  return request({
    url: `/basic/linestationprinter/${id}`,
    method: 'delete'
  })
}

