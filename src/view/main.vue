<template>
  <!-- 上/下/切换 -->
  <div class="main-wrapper">
    <van-cell center>
      <van-switch v-model="isWork" size="24" @change="changeStatus" />
    </van-cell>
    <div>
      <!-- <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list> -->
    </div>
    <div class="middle">
      <step-button :buttons="onButtons" @btnClick="btnClick"></step-button>
    </div>
    <div class="bottom">
      <van-steps :active="active" active-icon="success" active-color="#38f">
        <van-step v-for="(step, index) in steps" :key="index">{{
          step.name
        }}</van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
import stepButton from "@/component/stepButton";
export default {
  name: "main-component",
  components: {
    stepButton,
  },
  data() {
    return {
      isWork: false,
      onButtons: [
        {
          id: "1",
          name: "出门",
          type: "work",
        },
        {
          id: "2",
          name: "进站",
          type: "work",
        },
        {
          id: "3",
          name: "出站",
          type: "work",
        },
        {
          id: "4",
          name: "打卡",
          type: "work",
        },
        {
          id: "5",
          name: "打卡",
          type: "work",
        },
      ],
      active: 1,
      steps: [
        {
          id: "1",
          name: "出门",
          type: "work",
        },
        {
          id: "2",
          name: "进站",
          type: "work",
        },
        {
          id: "3",
          name: "出站",
          type: "work",
        },
        {
          id: "4",
          name: "上班打卡",
          type: "work",
        },
        {
          id: "5",
          name: "下班打卡",
          type: "work",
        },
      ],
    };
  },
  created() {
    document.documentElement.setAttribute("data-theme", 'light')
  },
  methods: {
    btnClick(data) {
      console.log(data);
      console.log(new Date())
      console.log(this._moment().format())
    },
    // 状态切换
    changeStatus() {
      console.log('change')
      let type = "ligth";
      if (this.isWork) {
        type = "dark";
      } else {
        type = "light";
      }
      window.document.documentElement.setAttribute("data-theme", type);
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_handle.scss';
.main-wrapper {
  @include font_color("font_color");
  @include background_color("background_color");
}
.bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  @include font_color("font_color");
  @include background_color("background_color");
}
.middle {
  position: fixed;
  bottom: 200px;
  width: 100%;
  @include font_color("font_color");
  @include background_color("background_color");
}
</style>
