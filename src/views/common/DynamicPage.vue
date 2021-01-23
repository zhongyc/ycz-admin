<template>
  <div>
    <dynamic-query ref="dynamicQuery" />
    <dynamic-crud ref="dynamicCrud" v-show="this.$refs.dynamicCrud != null && this.$refs.dynamicCrud.type != ''" />
  </div>
</template>
<script>
import dynamicQuery from '@/views/common/DynamicQuery'
import dynamicCrud from '@/views/common/DynamicCrud'
import { dynamic_crud_delete, dynamic_crud_status } from '@/api/dynamicCrud'
export default {
  components: { dynamicQuery, dynamicCrud },
  data() {
    return {
      actionType: 0
    }
  },
  methods: {
    add() {
      this.$refs.dynamicCrud.showAdd()
    },
    update(rowId) {
      var that = this
      const requestParam = { id: rowId, crudId: that.$route.meta.permission, columns: [], type: 2 }
      dynamic_crud_status(requestParam).then(response => {
        that.$refs.dynamicCrud.showUpdate(rowId)
      })
    },
    delete(rowId) {
      const requestParam = { id: rowId, crudId: this.$route.meta.permission, columns: [], type: 3 }
      dynamic_crud_delete(requestParam).then(response => {
        this.$notification.success({
          message: '删除操作',
          description: `保存成功`
        })
        this.back()
      })
    },
    detail(rowId) {
      var that = this
      that.$refs.dynamicCrud.showDetail(rowId)
    },
    back() {
      this.$refs.dynamicQuery.list()
    }
  }
}
</script>
