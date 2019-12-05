import request from '@/utils/request'

export function getProducts(data) {
  return request({
    url: `/basic/product/list`,
    method: 'post',
    data
  })
}

export function addProduct(data) {
  return request({
    url: '/basic/product',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: `/basic/product`,
    method: 'put',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: `/basic/product/${id}`,
    method: 'delete'
  })
}
