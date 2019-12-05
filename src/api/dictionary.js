import request from '@/utils/request'

export function getDictTypes(data) {
  return request({
    url: `/ucenter/dicttype/list`,
    method: 'post',
    data
  })
}
export function getDictMaps(data) {
  return request({
    url: `/ucenter/dicttype/map`,
    method: 'post',
    data
  })
}

export function addDictType(data) {
  return request({
    url: '/ucenter/dicttype',
    method: 'post',
    data
  })
}

export function updateDictType(data) {
  return request({
    url: `/ucenter/dicttype`,
    method: 'put',
    data
  })
}

export function deleteDictType(id) {
  return request({
    url: `/ucenter/dicttype/${id}`,
    method: 'delete'
  })
}

export function getDictInfos(data) {
  return request({
    url: `/ucenter/dictinfo/list`,
    method: 'post',
    data
  })
}

export function addDictInfo(data) {
  return request({
    url: '/ucenter/dictinfo',
    method: 'post',
    data
  })
}

export function updateDictInfo(data) {
  return request({
    url: `/ucenter/dictinfo`,
    method: 'put',
    data
  })
}

export function deleteDictInfo(id) {
  return request({
    url: `/ucenter/dictinfo/${id}`,
    method: 'delete'
  })
}

