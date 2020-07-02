<template>
  <div class="main-wrapper" v-swiperight="{fn:touchend, name:'right'}">
    <div class="list-wrapper">
      <van-list v-model="loading" v-bind:finished="finished" v-on:load="getLists">
        <div v-for="(list, index) in timeLists" v-bind:key="index" class="row-wrapper">
          <van-row>
            <van-col span="8" class="col-align-left">
              <p class="main-text">{{ list.name }}</p>
            </van-col>
            <van-col span="8" class="col-align-center">
              <p class="main-text">{{ list.starttime }} -- {{ list.endtime }}</p>
            </van-col>
            <van-col span="8" class="col-align-right">
              <p class="main-text">{{ list.timediff }}min</p>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24">
              <van-progress
                :percentage="list.timediff >= 60 ? 100 : 1.6 * list.timediff"
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
    <p style="color:#999;" @click="go">Go to actiontype</p>
    <!-- <router-link to="/actiontype"><span style="color:#999;">Go to actiontype</span></router-link> -->
    <div class="bottom">
      <step-button :buttons="steps" @btn-click-evt="btnClick" @btn-end-evt="endClick"></step-button>
      <van-steps :active="active" active-icon="success" active-color="#38f">
        <van-step v-for="(step, index) in steps" :key="index">
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
import stepButton from "@/component/stepButton"
import sideMenu from "@/component/sideMenu"
import {
  openDB,
  executeSql,
  sqlBatch,
  sqlQuery,
  extraTableColumn
} from "@/util/sqliteUtil"
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
      db: null,
      resultData: [],
      steps: []
    }
  },
  created () { },
  mounted () {
    this.initTable()
  },
  methods: {
    go () {
      this.$router.push({
        path: "/actiontype"
      })
    },
    initBtn () {
      let currentStep = null
      window.localStorage.clear()
      if (window.localStorage.getItem('currentStep')) {
        currentStep = JSON.parse(window.localStorage.getItem('currentStep'))
      }
      this.steps.forEach((ele) => {
        this.$set(ele, "disabled", 1)
        if (ele.steporder == 1) {
          ele.disabled = 0
        }
        if (currentStep && ele.steporder == (currentStep.steporder + 1)) {
          ele.disabled = 0
        }
      })
      console.log(this.steps)
    },
    // 初始化db
    async initTable () {
      await this.$store.dispatch("Database/openDatabase", "timeanlysis")
      this.db = this.$store.state.Database.database
      if (this.db) {
        this.initSqlDefaultData()
        this.getStepDatas()
        // this.addTableColumn()
        // this.dropTable()
      }
    },
    popupClose () {
      this.isSidePopupShow = false
    },
    touchend (obj, evt) {
      this.isSidePopupShow = true
    },
    getLists () {
      this.loading = false
      this.finished = true
      // 查询数据
      const _sql = "SELECT * from records"
      sqlQuery(this.$store.state.Database.database, _sql).then(
        (data) => {
          this.timeLists = data
        },
        (err) => {
          console.log(err)
        }
      )
    },
    /**
     * @description: 按钮点击时记录当前时间
     * @param {type}
     * @return:
     */
    btnClick (data) {
      // 储存当前步骤信息, 储存前置步骤结束时间等信息
      let _this = this
      data.disabled = 1
      let nextStep = this.steps.filter((item) => {
        return item.steporder && item.steporder == (Number(data.steporder) + 1)
      })
      console.log(nextStep)
      if (nextStep.length > 0) nextStep[0].disabled = 0
      this.active = data.steporder
      if (data.isstep) {
        // 存储当前步骤数据至sqlite
        let tmp = {
          actionid: data.id,
          year: _this._moment().format("YYYY"),
          month: _this._moment().format("M"),
          day: _this._moment().format("D"),
          odate: _this._moment().format("YYYY-M-D H:m"),
          starttime: _this._moment().format("H:m"),
          name: data.name,
          disabled: 1
        }
        const _EXECUTEINSERT =
          "INSERT INTO records(actionid, year, month, day, odate, starttime, name, disabled) VALUES (?,?,?,?,?,?,?,?)"
        let _VALUE = [
          tmp.actionid,
          tmp.year,
          tmp.month,
          tmp.day,
          tmp.odate,
          tmp.starttime,
          tmp.name,
          tmp.disabled
        ]
        // 插入数据
        executeSql(_this.$store.state.Database.database, _VALUE, _EXECUTEINSERT).then(
          (result) => {
            window.localStorage.setItem('currentStep', JSON.stringify(tmp))
          },
          (err) => {
            console.log("insert error")
            console.log(err)
          }
        )

        let currentStep = JSON.parse(window.localStorage.getItem('currentStep'))
        // 存储数据至sqlite
        if (currentStep && currentStep.steporder != 1) {
          // 前置步骤结束时间 = 当前步骤的开始时间
          currentStep.endtime = _this._moment().format("H:m")
          let oendtime = _this._moment().format("YYYY-M-D H:m")
          let etime = _this._moment(oendtime)
          let ostarttime = _this._moment(currentStep.odate)
          let timediff = etime.diff(ostarttime, "minute") //计算相差的分钟数
          currentStep.timediff = timediff // 前置步骤执行时间
          // 存储数据至sqlite
          const _EXECUTEQUERY = `UPDATE records SET endtime = '${currentStep.endtime}', timediff = '${timediff}' WHERE actionid = '${currentStep.actionid}'`
          // 插入数据
          executeSql(_this.$store.state.Database.database, [], _EXECUTEQUERY).then(
            (data) => {
              console.log("insert  prev  ---------------  success")
            },
            (err) => {
              // console.log(err)
            }
          )
        }
      } else {
        window.localStorage.removeItem('currentStep')
      }
      _this.getLists()
    },
    // 结束流程
    endClick () {
      let _this = this
      // 记录点击时间
      // 拿到前置步骤开始时间
      // 计算时间差
      // 更新前置步骤结束时间
      if (window.localStorage.getItem('currentStep')) {
        let currentStep = JSON.parse(window.localStorage.getItem('currentStep'))
        let oendtime = _this._moment().format("H:m")
        let endtime = _this._moment(_this._moment().format("YYYY-M-D H:m"))
        let starttime = _this._moment(currentStep.odate)
        let timediff = endtime.diff(starttime, "minute") //计算相差的分钟数
        // 存储数据至sqlite
        const _EXECUTEUPDATE = `UPDATE records SET endtime = '${oendtime}', timediff = '${timediff}' WHERE actionid = '${currentStep.actionid}'`
        // 插入数据
        executeSql(_this.$store.state.Database.database, [], _EXECUTEUPDATE).then(
          (data) => {
            _this.getLists()
          },
          (err) => {
            // console.log(err)
          }
        )
      }
    },
    // 初始化button状态
    // initBtnStatus () {
    //   let currentStep = JSON.parse(window.localStorage.getItem('currentStep'))
    //   const _EXECUTEQUERY = `SELECT `

    // },
    // 插入sql测试数据
    initSqlDefaultData () {
      const CREATE_ACTIONS_TYPE_TABLE =
        "CREATE TABLE IF NOT EXISTS actiontypes (id integer primary key, name varchar(15), isstep varchar(1))"
      const CREATE_ACTIONS_TABLE =
        "CREATE TABLE IF NOT EXISTS actions (id integer primary key, actiontypeid integer, name varchar(15), isstep varchar(1), steporder varchar(10))"
      const CREATE_RECORDS_TABLE =
        "CREATE TABLE IF NOT EXISTS records (id integer primary key, actionid integer, year varchar(5), month varchar(2), day varchar(2), starttime text, endtime text, odate text, timediff text)"
      let _sqlBatch = []
      _sqlBatch.push(
        CREATE_ACTIONS_TABLE,
        CREATE_RECORDS_TABLE,
        CREATE_ACTIONS_TYPE_TABLE
      )
      sqlBatch(this.db, _sqlBatch).then(
        (data) => {
          console.log("add table success")
        },
        (err) => {
          console.log(err)
        }
      )
    },
    insertTestData () {
      // // 插入数据
      sqlBatch(this.db, [
        [
          "INSERT INTO actions(name, isstep, steporder) VALUES (?,?,?)",
          ["step1", "1", "1"]
        ],
        [
          "INSERT INTO actions(name, isstep, steporder) VALUES (?,?,?)",
          ["step2", "1", "2"]
        ],
        [
          "INSERT INTO actions(name, isstep, steporder) VALUES (?,?,?)",
          ["step3", "1", "3"]
        ],
        [
          "INSERT INTO actions(name, isstep, steporder) VALUES (?,?,?)",
          ["step4", "1", "4"]
        ]
      ]).then(
        (data) => {
          console.log("insert success")
        },
        (err) => {
          console.log("insert failure")
          console.log(err)
        }
      )
    },
    getStepDatas () {
      const _sql = "SELECT * from actions WHERE actiontypeid = 1"
      sqlQuery(this.$store.state.Database.database, _sql).then(
        (data) => {
          this.steps = data
          this.initBtn()
        },
        (err) => {
          console.log(err)
        }
      )
    },
    // 添加额外列
    addTableColumn () {
      extraTableColumn(this.$store.state.Database.database, "records", "name text").then(
        (data) => {
          console.log('add column success')
        },
        (err) => {
          console.log(err)
        }
      )
    },
    // 删除数据表
    dropTable () {
      const _sql = [
        "DROP TABLE IF EXISTS records"
      ]
      sqlBatch(this.db, _sql).then(
        (data) => {
          console.log("删除table成功")
        },
        (err) => {
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
  bottom: 200PX;
  width: 100%;
  @include font_color("font_color");
  @include background_color("background_color");
}

.list-wrapper {
  padding: 12PX;
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
  padding: 6PX 0;
}
</style>
