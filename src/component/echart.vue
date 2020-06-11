<template>
  <div> {{ data }} </div>
</template>

<script>
export default {
  name: 'echart-component',
  data () {
    return {
      data: 'echart page'
    }
  },
  created () {
    console.log('echart in')
  }
}
</script>

<style>

</style>
