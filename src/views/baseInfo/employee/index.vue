<template>
  <div>
    <dynamic-query ref="dynamicQuery" />
  </div>
</template>
<script>
import dynamicQuery from '@/views/common/dynamicQuery'
export default {
  components: { dynamicQuery },
  methods: {
    add() {
      alert('add')
    },
    update(rowId) {
      alert('update' + rowId)
    },
    delete(rowId) {
      alert('delete' + rowId)
    }
  }
}
</script>
