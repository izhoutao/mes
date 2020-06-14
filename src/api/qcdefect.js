import request from '@/utils/request'

export function getQcDefects(data) {
  return request({
    url: `/basic/qcdefect/list`,
    method: 'post',
    data
  })
}

export function addQcDefect(data) {
  return request({
    url: '/basic/qcdefect',
    method: 'post',
    data
  })
}

export function updateQcDefect(data) {
  return request({
    url: `/basic/qcdefect`,
    method: 'put',
    data
  })
}

export function deleteQcDefect(id) {
  return request({
    url: `/basic/qcdefect/${id}`,
    method: 'delete'
  })
}



export function getTopDefects(num) {
  return request({
    url: `/basic/qcdefect/top/${num}`,
    method: 'get'
  })
}

