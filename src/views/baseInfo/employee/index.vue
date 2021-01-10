<template>
  <div>
    <dynamic-query ref="dynamicQuery" />
    <dynamic-crud ref="dynamicCrud" v-show="this.$refs.dynamicCrud != null && this.$refs.dynamicCrud.type == 'add'" />
  </div>
</template>
<script>
import dynamicQuery from '@/views/common/dynamicQuery'
import dynamicCrud from '@/views/common/dynamicCrud'
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
      alert('update' + rowId)
    },
    delete(rowId) {
      alert('delete' + rowId)
    },
    back() {
      this.$refs.dynamicQuery.list()
    }
  }
}
</script>
