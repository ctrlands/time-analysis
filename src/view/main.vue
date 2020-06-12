<template>
  <!-- 上/下/切换 -->
  <div
    class="main-wrapper"
    @touchstart.self="touchstart"
    @touchmove.self="touchmove"
    @touchend.self="touchend"
  >
    <div class="list-wrapper">
      <van-list v-model="loading" :finished="finished" @load="getLists">
        <div v-for="(list, index) in timeLists" :key="index" class="row-wrapper">
          <van-row>
            <van-col span="8" class="col-align-left">
              <p class="main-text">{{ list.name }}</p>
            </van-col>
            <van-col span="8" class="col-align-center">
              <p class="main-text">{{ list.startTime }} -- {{ list.endTime }}</p>
            </van-col>
            <van-col span="8" class="col-align-right">
              <p class="main-text">{{ list.total }}min</p>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24">
              <van-progress
                :percentage="list.total >= 60 ? 100 : 1.6*list.total"
                :show-pivot="false"
              />
            </van-col>
          </van-row>
          <!-- <van-divider /> -->
        </div>
      </van-list>
    </div>
    <div v-for="(result, index) in resultData" :key="index">
      <van-row>
        <van-col span="8">{{ result.id }}</van-col>
        <van-col span="8">{{ result.text }}</van-col>
        <van-col span="8">{{ result.desc }}</van-col>
      </van-row>
    </div>
    <!-- <div class="middle">
      <step-button :buttons="onButtons" @btnClick="btnClick"></step-button>
    </div>-->
    <div class="bottom">
      <step-button :buttons="onButtons" @btn-click-evt="btnClick"></step-button>
      <van-steps :active="active" active-icon="success" active-color="#38f">
        <van-step v-for="(step, index) in onButtons" :key="index">
          {{
          step.name
          }}
        </van-step>
      </van-steps>
    </div>
    <side-menu :isSidePopupShow="isSidePopupShow" @popup-close="popupClose"></side-menu>
  </div>
</template>

<script>
import stepButton from "@/component/stepButton";
import sideMenu from "@/component/sideMenu";
export default {
  name: "main-component",
  components: {
    stepButton,
    sideMenu
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
          total: 0
        },
        {
          id: "2",
          name: "step2",
          type: "work",
          isStep: true,
          stepOrder: 2,
          total: 0
        },
        {
          id: "3",
          name: "step3",
          type: "work",
          isStep: true,
          stepOrder: 3,
          total: 0
        },
        {
          id: "4",
          name: "step4",
          type: "work",
          isStep: true,
          stepOrder: 4,
          total: 0
        },
        {
          id: "5",
          name: "step5",
          type: "work",
          isStep: true,
          stepOrder: 5,
          total: 0
        }
      ],
      active: 0,
      uid: 0,
      touchStartX: 0,
      touchEndX: 0,
      touchStartY: 0,
      touchEndY: 0,
      isSwipRight: false,
      db: null,
      resultData: []
    };
  },
  created() {
    document.documentElement.setAttribute("data-theme", "light");
  },
  mounted() {
    this.onButtons.forEach(ele => {
      this.$set(ele, "disabled", true);
      if (ele.stepOrder == 1) {
        ele.disabled = false;
      }
    });
  },
  methods: {
    popupClose() {
      this.isSidePopupShow = false;
    },
    touchstart(evt) {
      this.touchStartX = evt.touches[0].clientX;
      this.touchStartY = evt.touches[0].clientY;
    },
    touchmove(evt) {
      this.touchEndX = evt.touches[0].clientX;
      this.touchEndY = evt.touches[0].clientY;
      if (
        this.touchEndX - this.touchStartX > 50 &&
        Math.abs(this.touchStartY - this.touchEndY) < 10
      ) {
        this.isSwipRight = true;
      } else {
        this.isSwipRight = false;
      }
    },
    touchend(evt) {
      // 向右滑动
      if (this.isSwipRight) {
        this.isSidePopupShow = true;
      } else {
        this.isSidePopupShow = false;
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
      let _this = this
      data.disabled = true;
      let nextStep = this.onButtons.filter(item => {
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
          this.timeLists[data.stepOrder - 2].endTime = this.timeLists[
            data.stepOrder - 1
          ].startTime;
          let startTime = this._moment(
            this.timeLists[data.stepOrder - 2].startTime,
            "hh:mm"
          ); // 前置步骤开始时间
          let endTime = this._moment(
            this.timeLists[data.stepOrder - 2].endTime,
            "hh:mm"
          ); // 前置步骤结束时间
          let timeGap = endTime.diff(startTime, "minute"); //计算相差的分钟数
          this.timeLists[data.stepOrder - 2].total = timeGap; // 前置步骤执行时间
          // 存储数据至sqlite
        }
      }
      this.getLists();
      // 创建本地数据
      if (data.stepOrder == 1) {
        // 创建数据库
        this.db = window.sqlitePlugin.openDatabase(
          {
            name: "timeanlysis.db",
            location: "default",
            androidDatabaseProvider: "system"
          },
          //回调函数，可传
          function callBack(db) {
            db.transaction(
              function(tx) {
                alert("创建数据库成功");
                // ...
              },
              function(err) {
                alert("Open database ERROR: " + JSON.stringify(err));
              }
            );
          }
        );
        // 创建tabletest表
        this.db.transaction(function(transaction) {
          transaction.executeSql(
            "CREATE TABLE IF NOT EXISTS tabletest (id integer primary key, title text, desc text)",
            [],
            function(tx, result) {
              alert("Table created successfully");
            },
            function(error) {
              alert("Error occurred while creating the table.");
            }
          );
        });
      }
      if (data.stepOrder == 2) {
        // 插入数据
        var title = "sundaravel";
        var desc = "phonegap freelancer";
        this.db.transaction(function(transaction) {
          var executeQuery =
            "INSERT INTO tabletest (title, desc) VALUES (?, ?)";
          transaction.executeSql(
            executeQuery,
            [title, desc],
            function(tx, result) {
              alert("Inserted suceess");
            },
            function(error) {
              alert("Error occurred, insert failure");
            }
          );
        });
      }
      if (data.stepOrder == 3) {
        // 查询数据
        this.db.transaction(function(transaction) {
          transaction.executeSql(
            "SELECT * FROM tabletest",
            [],
            function(tx, results) {
              var len = results.rows.length, i;
              let result = []
              results.rows.length.forEach(ele => {
                result.push({
                  id: ele.id,
                  title: ele.title,
                  desc: ele.desc
                })
              })
              _this.resultData = result
              alert(JSON.stringify(_this.resultData))
            },
            null
          );
        });
      }
    }
  }
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
.list-wrapper {
  padding: 12px;
}
.col-align-left {
  text-align: left;
}
.col-align-center {
  text-align: center;
}
.col-align-right {
  text-align: right;
}
.row-wrapper .van-row {
  padding: 6px 0;
}
</style>
