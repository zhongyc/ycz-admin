import request from '@/utils/request'

const userApi = {
    dynamic_crud_column: '/sys/dynamic/crud/column',
    dynamic_crud_relation_item: '/sys/dynamic/crud/relation/item',
    dynamic_crud_crud: '/sys/dynamic/crud',
    dynamic_crud_item: '/sys/dynamic/crud/item'
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

export function dynamic_crud_save (data) {
    return request({
        url: userApi.dynamic_crud_crud,
        method: 'post',
        data
    })
}

export function dynamic_crud_item (data) {
    return request({
        url: userApi.dynamic_crud_item,
        method: 'post',
        data
    })
}