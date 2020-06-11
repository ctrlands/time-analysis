<template>
  <div>
    <van-row type="flex" justify="center">
      <van-col :span="parseInt(24/buttons.length)" v-for="(button, index) in buttons" :key="index">
        <van-button round type="info" @click="btnclick(button)">{{ button.name }}</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'stepbuttoncompoent',
  props: {
    buttons: {
      type: Array,
      default: () => {
        return []
      },
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    btnclick (data) {
      this.$emit('btnClick', data)
    }
  },

};
</script>

<style></style>
