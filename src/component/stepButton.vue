<template>
  <div>
    <van-row type="flex" justify="center">
      <van-col :span="parseInt(24/buttons.length)" v-for="(button, index) in buttons" :key="index">
        <van-button round type="info" @click="btnclick(button, index)" :disabled="button.disabled == 1 ? true : false">{{ button.name }}</van-button>
      </van-col>
      <van-button v-if="buttons.length > 1 && buttons[0].isstep" round type="info" @click="endClick()" :disabled="isEndBtnDisabled">完成</van-button>
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
    return {
      activeIndex: 0,
      isEndBtnDisabled: true
    }
  },
  methods: {
    btnclick (data, index) {
      this.activeIndex = index
      this.isEndBtnDisabled = (activeIndex == (buttons.length - 1) ? false : true)
      this.$emit('btn-click-evt', data)
    },
    endClick () {
      this.isEndBtnDisabled = true
      this.$emit('btn-end-evt')
    }
  },

};
</script>

<style></style>
