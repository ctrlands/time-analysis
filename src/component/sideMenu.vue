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
      isShow: this.isSidePopupShow,
      uiStatus: false,
      uiStatusDesc: "夜间模式",
      uiStatusType: ["light", "dark"]
    };
  },
  watch: {
    isSidePopupShow: {
      handler(newVal) {
        this.isShow = newVal;
      },
      immediate: true
    },
  },
  methods: {
    popupClose () {
      this.$emit('popup-close')
    },
    changeUIStatus() {
      let type = "dark";
      this.uiStatus = !this.uiStatus;
      type = this.uiStatus ? this.uiStatusType[0] : this.uiStatusType[1];
      if (this.uiStatus) {
        this.uiStatusDesc = "日间模式";
      } else {
        this.uiStatusDesc = "夜间模式";
      }
      window.localStorage.setItem('style', type)
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
