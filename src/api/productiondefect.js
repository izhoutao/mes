import request from '@/utils/request'

export function getProductionDefects(data) {
  return request({
    url: `/basic/productiondefect/list`,
    method: 'post',
    data
  })
}


