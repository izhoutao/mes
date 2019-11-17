import request from '@/utils/request'

export function getDefectGroups(data) {
  return request({
    url: `/basic/defectgroup/list`,
    method: 'post',
    data
  })
}

export function addDefectGroup(data) {
  return request({
    url: '/basic/defectgroup',
    method: 'post',
    data
  })
}

export function updateDefectGroup(data) {
  return request({
    url: `/basic/defectgroup`,
    method: 'put',
    data
  })
}

export function deleteDefectGroup(id) {
  return request({
    url: `/basic/defectgroup/${id}`,
    method: 'delete'
  })
}

export function getDefects(data) {
  return request({
    url: `/basic/defect/list`,
    method: 'post',
    data
  })
}

export function addDefect(data) {
  return request({
    url: '/basic/defect',
    method: 'post',
    data
  })
}

export function updateDefect(data) {
  return request({
    url: `/basic/defect`,
    method: 'put',
    data
  })
}

export function deleteDefect(id) {
  return request({
    url: `/basic/defect/${id}`,
    method: 'delete'
  })
}
