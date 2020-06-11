<template>
  <!-- 上/下/切换 -->
  <div class="main-wrapper" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        @load="getLists"
      >
        <div v-for="(list, index) in timeLists" :key="index">
          <van-row>
            <van-col span="8">
              {{ list.name }}
            </van-col>
            <van-col span="8">
              {{ list.startTime }}--{{ list.endTime }}
            </van-col>
            <van-col span="8">
              {{ list.total }}min
            </van-col>
          </van-row>
        </div>
      </van-list>
    </div>
    <!-- <div class="middle">
      <step-button :buttons="onButtons" @btnClick="btnClick"></step-button>
    </div> -->
    <div class="bottom">
      <step-button :buttons="onButtons" @btnClick="btnClick"></step-button>
      <van-steps :active="active" active-icon="success" active-color="#38f">
        <van-step v-for="(step, index) in onButtons" :key="index">{{
          step.name
        }}</van-step>
      </van-steps>
    </div>
    <side-menu :isSidePopupShow="isSidePopupShow"></side-menu>
  </div>
</template>

<script>
import stepButton from "@/component/stepButton";
import sideMenu from '@/component/sideMenu';
export default {
  name: "main-component",
  components: {
    stepButton, sideMenu
  },
  data() {
    return {
      // 侧边菜单栏显示
      isSidePopupShow: false,
      loading: false,
      finished: false,
      timeLists: [],
      onButtons: [
        {
          id: "1",
          name: "step1",
          type: "work",
          isStep: true,
          stepOrder: 1,
          total: 0,
        },
        {
          id: "2",
          name: "step2",
          type: "work",
          isStep: true,
          stepOrder: 2,
          total: 0,
        },
        {
          id: "3",
          name: "step3",
          type: "work",
          isStep: true,
          stepOrder: 3,
          total: 0,
        },
        {
          id: "4",
          name: "step4",
          type: "work",
          isStep: true,
          stepOrder: 4,
          total: 0,
        },
        {
          id: "5",
          name: "step5",
          type: "work",
          isStep: true,
          stepOrder: 5,
          total: 0,
        },
      ],
      active: 0,
      uid: 0,
      touchStartX: 0,
      touchEndX: 0,
    };
  },
  created() {
    document.documentElement.setAttribute("data-theme", "light");
  },
  mounted() {
    this.onButtons.forEach((ele) => {
      this.$set(ele, "disabled", true);
      if (ele.stepOrder == 1) {
        ele.disabled = false;
      }
    });
  },
  methods: {
    touchstart (evt) {
      // evt.stopPropagation()
      this.touchStartX = evt.touches[0].clientX;
    },
    touchmove (evt) {
      // console.log(evt)
      this.touchEndX = evt.touches[0].clientX;
      // console.log('touchmove')
    },
    touchend (evt) {
      // console.log(this.touchStartX)
      // console.log(this.touchEndX)
      if (this.touchEndX - this.touchStartX > 20) {
        console.log('show popup')
        this.isSidePopupShow = true
      } else {
        console.log('close popup')
        this.isSidePopupShow = false
      }
    },
    getLists() {
      this.loading = false;
      this.finished = true;
      // 查询数据
    },
    /**
     * @description: 按钮点击时记录当前时间
     * @param {type} 
     * @return: 
     */    
    btnClick(data) {
      data.disabled = true;
      let nextStep = this.onButtons.filter((item) => {
        return item.stepOrder && item.stepOrder == data.stepOrder + 1;
      });
      if (nextStep.length > 0) nextStep[0].disabled = false;
      this.active = data.stepOrder;
      // this.onButtons[data.stepOrder].disabled = false;
      if (data.isStep) {
        this.uid++;
        // 存储数据至sqlite
        this.timeLists.push({
          id: this.uid,
          name: data.name,
          startTime: this._moment().format("HH:mm"),
          endTime: "",
          year: this._moment().format("YYYY"),
          month: this._moment().format("MM"),
          total: 0
        });
        if (data.stepOrder != 1) {
          // 前置步骤结束时间 = 当前步骤的开始时间
          this.timeLists[data.stepOrder - 2].endTime = this.timeLists[data.stepOrder - 1].startTime;
          let startTime = this._moment(this.timeLists[data.stepOrder - 2].startTime, "hh:mm"); // 前置步骤开始时间
          let endTime = this._moment(this.timeLists[data.stepOrder - 2].endTime, "hh:mm"); // 前置步骤结束时间
          let timeGap = endTime.diff(startTime, "minute"); //计算相差的分钟数
          this.timeLists[data.stepOrder - 2].total = timeGap; // 前置步骤执行时间
          // 存储数据至sqlite
        }
      }
      this.getLists();
    },
  },
};
</script>

<style lang="scss">
@import "@/scss/_handle.scss";
.main-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
