import request from '@/utils/request'
import { param } from '@/utils/index'

export function getDictTypes(page = 0, size = 10, dictSearchParam) {
  let query
  if (dictSearchParam) {
    query = param(dictSearchParam)
  }
  return request({
    url: `/ucenter/dicttype/list/${page}/${size}?${query}`,
    method: 'get'
  })
}

export function addDictType(data) {
  return request({
    url: '/ucenter/dicttype',
    method: 'post',
    data
  })
}

export function updateDictType(id, data) {
  return request({
    url: `/ucenter/dicttype/${id}`,
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

export function getDictInfos(page = 0, size = 10, dictSearchParam) {
  let query
  if (dictSearchParam) {
    query = param(dictSearchParam)
  }
  return request({
    url: `/ucenter/dictinfo/list/${page}/${size}?${query}`,
    method: 'get'
  })
}

export function addDictInfo(data) {
  return request({
    url: '/ucenter/dictinfo',
    method: 'post',
    data
  })
}

export function updateDictInfo(id, data) {
  return request({
    url: `/ucenter/dictinfo/${id}`,
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
