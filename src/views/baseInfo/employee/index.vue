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
    }
  }
}
</script>
