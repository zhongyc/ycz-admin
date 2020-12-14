import request from '@/utils/request'

const userApi = {
    auto_complete: '/sys/auto/complete',
  }

  export function auto_complete (query, type, allRecords) {
    const data = {
        query: query,
        type: type,
        allRecords: allRecords
      };
    return request({
      url: userApi.auto_complete,
      method: 'post',
      data
    })
  }