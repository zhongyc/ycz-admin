<template>
  <div>
    <dynamic ref="dynamic" />
  </div>
</template>
<script>
import dynamic from '@/views/common/dynamic'
export default {
  components: { dynamic },
  methods: {
    add() {
      alert('add')
    }
  }
}
</script>
