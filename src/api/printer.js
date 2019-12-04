import request from '@/utils/request'

export function getPrinters(data) {
  return request({
    url: `/basic/printer/list`,
    method: 'post',
    data
  })
}

export function addPrinter(data) {
  return request({
    url: '/basic/printer',
    method: 'post',
    data
  })
}

export function updatePrinter(data) {
  return request({
    url: `/basic/printer`,
    method: 'put',
    data
  })
}

export function deletePrinter(id) {
  return request({
    url: `/basic/printer/${id}`,
    method: 'delete'
  })
}

