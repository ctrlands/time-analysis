<template>
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
                :percentage="list.total >= 60 ? 100 : 1.6 * list.total"
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
      <step-button :buttons="steps" @btn-click-evt="btnClick"></step-button>
      <van-steps :active="active" active-icon="success" active-color="#38f">
        <van-step v-for="(step, index) in steps" :key="index">{{ step.name }}</van-step>
      </van-steps>
    </div>
    <side-menu :isSidePopupShow="isSidePopupShow" @popup-close="popupClose"></side-menu>
  </div>
</template>

<script>
import stepButton from "@/component/stepButton"
import sideMenu from "@/component/sideMenu"
import { openDB, executeSql, sqlBatch, sqlQuery, extraTableColumn } from "@/util/sqliteUtil"
export default {
  name: "main-component",
  components: {
    stepButton,
    sideMenu
  },
  data () {
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
      resultData: [],
      steps: []
    }
  },
  created () {
    document.documentElement.setAttribute("data-theme", "light")
  },
  mounted () {
    this.onButtons.forEach(ele => {
      this.$set(ele, "disabled", true)
      if (ele.stepOrder == 1) {
        ele.disabled = false
      }
    })
    this.getStepOrders()
  },
  methods: {
    // 初始化db
    initTable () {
      openDB("timeanlysis").then(
        data => {
          this.db = data
        },
        err => {
          // console.log(err);
        }
      )
      if (this.db) {
        // 创建表
        const CREATE_ACTIONS_TABLE =
          "CREATE TABLE IF NOT EXISTS actions (id integer primary key, name varchar(15), isstep varchar(1), steporder varchar(10))"
        const CREATE_RECORDS_TABLE =
          "CREATE TABLE IF NOT EXISTS records (id integer primary key, stepid integer, year varchar(5), month varchar(2), day varchar(2), starttime text, endtime text, odate text, timediff text)"
        let _sqlBatch = []
        _sqlBatch.push(CREATE_ACTIONS_TABLE, CREATE_RECORDS_TABLE)
        sqlBatch(this.db, _sqlBatch).then(
          data => {
            console.log(data)
            console.log("add table success")
          },
          err => {
            console.log(err)
          }
        )
      }
    },
    // 获取步骤数据
    getStepOrders () {
      openDB("timeanlysis").then(
        data => {
          this.db = data
          // 初始化表
          // this.initSqlDefaultData()
          // 添加额外列
          // this.addTableColumn()
          // this.getStepDatas()
          // 删除表
          // this.dropTable()
        },
        err => {
          // console.log(err);
        }
      )
    },
    popupClose () {
      this.isSidePopupShow = false
    },
    touchstart (evt) {
      this.touchStartX = evt.touches[0].clientX
      this.touchStartY = evt.touches[0].clientY
    },
    touchmove (evt) {
      this.touchEndX = evt.touches[0].clientX
      this.touchEndY = evt.touches[0].clientY
      if (
        this.touchEndX - this.touchStartX > 50 &&
        Math.abs(this.touchStartY - this.touchEndY) < 10
      ) {
        this.isSwipRight = true
      } else {
        this.isSwipRight = false
      }
    },
    touchend (evt) {
      // 向右滑动
      if (this.isSwipRight) {
        this.isSidePopupShow = true
      } else {
        this.isSidePopupShow = false
      }
    },
    getLists () {
      this.loading = false
      this.finished = true
      // 查询数据
    },
    /**
     * @description: 按钮点击时记录当前时间
     * @param {type}
     * @return:
     */

    btnClick (data) {
      // 储存当前步骤信息, 储存前置步骤结束时间等信息
      let _this = this
      data.disabled = true
      let nextStep = this.steps.filter(item => {
        return item.steporder && item.steporder == data.steporder + 1
      })
      if (nextStep.length > 0) nextStep[0].disabled = false
      this.active = data.steporder
      // this.onButtons[data.stepOrder].disabled = false;
      if (data.isstep) {
        this.uid++
        // 存储数据至sqlite
        this.timeLists.push({
          id: data.id,
          name: data.name,
          startTime: this._moment().format("H:m"),
          endTime: "",
          year: this._moment().format("YYYY"),
          month: this._moment().format("MM"),
          total: 0
        })
        if (data.steporder != 1) {
          // 前置步骤结束时间 = 当前步骤的开始时间
          this.timeLists[data.steporder - 2].endTime = this.timeLists[
            data.steporder - 1
          ].startTime
          let startTime = this._moment(
            this.timeLists[data.steporder - 2].startTime,
            "hh:mm"
          ) // 前置步骤开始时间
          let endTime = this._moment(
            this.timeLists[data.steporder - 2].endTime,
            "hh:mm"
          ) // 前置步骤结束时间
          let timediff = endTime.diff(startTime, "minute") //计算相差的分钟数
          this.timeLists[data.stepOrder - 2].total = timediff // 前置步骤执行时间
          // 存储数据至sqlite
          let tmp = {
            endtime: endTime,
            timediff: timediff
          }
          const _EXECUTEQUERY = `INSERT INTO records(endtime, timediff) VALUES (?,?) WHERE stepid = ''`
          let _VALUE = [tmp.endtime, tmp.timediff]
          // 插入数据
          executeSql(this.db, _VALUE, _EXECUTEQUERY).then(
            data => {
              // console.log("insert success")
            },
            err => {
              // console.log(err)
            }
          )
        }

        // 存储当前步骤数据至sqlite
        let tmp = {
          stepid: data.id,
          year: this._moment().format("YYYY"),
          month: this._moment().format("M"),
          day: this._moment().format("D"),
          odate: this._moment().format("YYYY-M-D-H:m"),
          starttime: this._moment().format("H:m"),
          disabled: 1
        }
        const _EXECUTEQUERY = 'INSERT INTO records(stepid, year, month, day, odate, starttime, disabled) VALUES (?,?,?,?,?,?,?)'
        let _VALUE = [tmp.stepid, tmp.year, tmp.month, tmp.day, tmp.odate, tmp.startTime, tmp.disabled]
        // 插入数据
        executeSql(this.db, _VALUE, _EXECUTEQUERY).then(
          data => {
            console.log("insert success")
          },
          err => {
            console.log('insert error')
            console.log(err)
          }
        )
      }
      this.getLists()
    },
    // 插入sql测试数据
    initSqlDefaultData () {
      const CREATE_ACTIONS_TYPE_TABLE =
        "CREATE TABLE IF NOT EXISTS actiontypes (id integer primary key, name varchar(15), isstep varchar(1))"
      const CREATE_ACTIONS_TABLE =
        "CREATE TABLE IF NOT EXISTS actions (id integer primary key, actiontypeid integer, name varchar(15), isstep varchar(1), steporder varchar(10))"
      const CREATE_RECORDS_TABLE =
        "CREATE TABLE IF NOT EXISTS records (id integer primary key, actionid integer, year varchar(5), month varchar(2), day varchar(2), starttime text, endtime text, odate text, timediff text)"
      let _sqlBatch = []
      _sqlBatch.push(CREATE_ACTIONS_TABLE, CREATE_RECORDS_TABLE, CREATE_ACTIONS_TYPE_TABLE)
      console.log(_sqlBatch)
      sqlBatch(this.db, _sqlBatch).then(
        data => {
          // console.log(data)
          console.log("add table success")
          // this.insertTestData()
        },
        err => {
          console.log(err)
        }
      )
      // const CREATE_ACTIONS_TYPE_TABLE = "CREATE TABLE IF NOT EXISTS testtabledata (id integer primary key, name varchar(15), isstep varchar(1))"
      // // _sqlBatch.push(CREATE_ACTIONS_TABLE, CREATE_RECORDS_TABLE)
      // executeSql(this.db, [], CREATE_ACTIONS_TYPE_TABLE).then(
      //   data => {
      //     console.log("add table success")
      //   },
      //   err => {
      //     console.log(err)
      //   }
      // )
    },
    insertTestData () {
      // // 插入数据
      sqlBatch(this.db, [
        ['INSERT INTO actions(name, isstep, steporder) VALUES (?,?,?)', ['step1', '1', '1']],
        ['INSERT INTO actions(name, isstep, steporder) VALUES (?,?,?)', ['step2', '1', '2']],
        ['INSERT INTO actions(name, isstep, steporder) VALUES (?,?,?)', ['step3', '1', '3']],
        ['INSERT INTO actions(name, isstep, steporder) VALUES (?,?,?)', ['step4', '1', '4']]
      ]).then(
        data => {
          console.log("insert success")
        },
        err => {
          console.log('insert failure')
          console.log(err)
        }
      )
    },
    getStepDatas () {
      const _sql = 'SELECT * from actions'
      sqlQuery(this.db, _sql).then(data => {
        this.steps = data
        console.log(this.steps)
      }, err => {
        console.log(err)
      })
    },
    // 添加额外列
    addTableColumn () {
      console.log('in')
      extraTableColumn(this.db, 'testtabledata', 'extracolumn text').then(data => { }, err => { console.log(err) })
      extraTableColumn(this.db, 'testtabledata', 'lplorder text').then(data => { }, err => { console.log(err) })
    },
    // 删除数据表
    dropTable () {
      const _sql = ['DROP TABLE IF EXISTS actions', 'DROP TABLE IF EXISTS records']
      sqlBatch(this.db, _sql).then(
        data => {
          console.log("删除table成功")
        },
        err => {
          console.log(err)
        }
      )
    }
  }
}
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
