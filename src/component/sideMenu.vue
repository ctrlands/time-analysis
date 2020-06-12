<template>
  <div>
    <van-popup v-model="isShow" position="left" class="side-menu-wrapper" @close="popupClose">
      <van-row>
        <van-col span="24">
          <p class="main-text">数据统计</p>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="24">
          <p class="main-text" v-on:click="changeUIStatus">{{uiStatusDesc}}</p>
        </van-col>
      </van-row>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "side-menu-component",
  props: {
    isSidePopupShow: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      // isShow: false,
      isShow: this.isSidePopupShow,
      // false: light, true: dark
      uiStatus: false,
      uiStatusDesc: "夜间模式",
      uiStatusType: ["light", "dark"]
    };
  },
  watch: {
    isSidePopupShow: {
      handler(newVal) {
        // console.log("oldVal: " + oldVal);
        console.log("newVal: " + newVal);
        this.isShow = newVal;
      },
      immediate: true
    },
  },
  methods: {
    popupClose () {
      console.log(this.isShow)
      // this.isSidePopupShow = !this.isSidePopupShow
      // this.isShow = false
      this.$emit('popup-close')
    },
    changeUIStatus() {
      let type = "light";
      this.uiStatus = !this.uiStatus;
      type = this.uiStatus ? this.uiStatusType[1] : this.uiStatusType[0];
      if (this.uiStatus) {
        this.uiStatusDesc = "日间模式";
      } else {
        this.uiStatusDesc = "夜间模式";
      }
      window.document.documentElement.setAttribute("data-theme", type);
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/_handle.scss";
.side-menu-wrapper {
  width: 30%;
  height: 100%;
  @include font_color("font_color");
  @include background_color("background_color");
  padding: 15px;
  & .main-text {
    font-size: 24px;
  }
}
</style>
