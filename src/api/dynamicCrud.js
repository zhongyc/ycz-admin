import request from '@/utils/request'

const userApi = {
    dynamic_crud_column: '/sys/dynamic/crud/column',
    dynamic_crud_relation_item: '/sys/dynamic/crud/relation/item'
  }

export function dynamic_crud_column (menuId, type) {
    return request({
        url: userApi.dynamic_crud_column+"?menuId="+menuId+'&type='+type,
        method: 'get'
    })
}

export function dynamic_crud_relation_item (id) {
    return request({
        url: userApi.dynamic_crud_relation_item+"?id="+id,
        method: 'get'
    })
}