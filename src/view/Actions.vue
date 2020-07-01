<template>
  <!-- 行为管理界面 add/edit/del/update -->
  <div>
    <van-nav-bar
      :border="false"
      fixed
      left-text="行为管理"
      left-arrow
      @click-left="goPrev"
      @click-right="handleAddActionType"
    >
      <template #right>
        <van-icon name="add-o" />
      </template>
    </van-nav-bar>
    <div class="body-middle">
      <van-row class="list-wrapper">
        <van-col span="24">
          <ul>
            <li
              v-for="(item, index) in actions"
              :key="index"
              @touchstart="touchstart($event, item)"
              @touchmove="touchmove($event, item)"
              @touchend="touchend($event, item)"
            >
              <div class="list-action-info-wrapper">
                <span>{{ item.name }}</span>
                <div
                  class="list-action-btn-wrapper"
                  v-show="active == item.id"
                  :class="{ 'btn-wrapper__active': active == item.id }"
                >
                  <van-button type="default" size="mini" @click="handleEdit(item)">编辑</van-button>
                  <van-button type="default" size="mini" @click="handleDel(item)">删除</van-button>
                </div>
              </div>
            </li>
          </ul>
        </van-col>
      </van-row>
    </div>
    <van-dialog
      v-model="isShowDialog"
      show-cancel-button
      class="add-action-type-dialog-wrapper"
      :before-close="beforeCloseDialog"
    >
      <van-row>
        <van-col span="24">
          <van-cell-group :border="false" class="cell-wrapper">
            <van-field v-model="actionName" placeholder="请输入行为名称" />
          </van-cell-group>
        </van-col>
      </van-row>
      <van-row type="flex" justify="space-between">
        <van-col span="12">
          <span class="label">序号</span>
        </van-col>
        <van-col span="12">
          <van-stepper
            v-model="stepNum"
            :min="minStep"
            :disabled="isStepDisabled"
            max="8"
            input-width="60"
            theme="round"
            integer
            button-size="18"
            class="step-wrapper"
          />
        </van-col>
      </van-row>
    </van-dialog>
  </div>
</template>

<script>
import { executeSql, sqlQuery } from "@/util/sqliteUtil"
export default {
  name: "add-actions-view",
  data () {
    return {
      isStepDisabled: false,
      isShowDialog: false,
      actionName: "",
      stepNum: 0,
      clientStartX: 0,
      clientEndX: 0,
      isMove: false,
      active: "",
      actions: [],
      // false: add, true: edit
      status: false,
      actionId: null,
      minStep: 1
    }
  },
  created () {
    this.getActions()
  },
  methods: {
    // 弹窗取消/确认
    beforeCloseDialog (action, done) {
      if (action == "confirm") {
        this.confirmAddActionType().then(
          (result) => {
            this.getActions()
            this.getPrevMaxStepOrder()
            done()
          },
          (err) => {
            done(false)
          }
        )
      } else {
        // 取消
        done()
      }
    },
    goPrev () {
      this.$router.push("/")
    },
    // 保存数据
    confirmAddActionType () {
      let _self = this
      return new Promise((resolve, reject) => {
        let strLen =
          _self.actionName.match(/[^ -~]/g) == null
            ? _self.actionName.length
            : _self.actionName.length + _self.actionName.match(/[^ -~]/g).length
        if (_self.actionName == "" || strLen > 10) {
          _self.$toast("文本不能为空且长度不能超过10个字符串")
          reject()
          return
        }
        if (_self.status) {
          const _EXECUTEUPDATE = `UPDATE actions SET name = '${_self.actionName}' WHERE id = '${_self.actionId}'`
          executeSql(
            _self.$store.state.Database.database,
            [],
            _EXECUTEUPDATE
          ).then(
            (data) => {
              _self.$toast("修改成功")
              resolve()
            },
            (err) => {
              _self.$toast("修改异常, 请稍后再试")
              reject(err)
            }
          )
        } else {
          const _EXECUTEINSERT =
            "INSERT INTO actions(name, actiontypeid, isstep, steporder) VALUES (?,?,?,?)"
          let _VALUE = [
            _self.actionName,
            _self.$route.query.actionTypeId,
            "true",
            _self.stepNum
          ]
          // 插入数据
          executeSql(
            _self.$store.state.Database.database,
            _VALUE,
            _EXECUTEINSERT
          ).then(
            (data) => {
              _self.$toast("添加成功")
              resolve()
            },
            (err) => {
              _self.$toast("添加异常, 请稍后再试")
              reject(err)
            }
          )
        }
      })
    },
    // 添加
    handleAddActionType () {
      this.isShowDialog = true
      this.status = false
      this.isStepDisabled = false
      this.stepNum = this.minStep
    },
    touchstart (evt, item) {
      this.isMove = false
      this.clientStartX = evt.touches[0].clientX
    },
    touchmove (evt, item) {
      evt.preventDefault()
      this.isMove = true
      this.clientEndX = evt.touches[0].clientX
    },
    touchend (evt, item) {
      if (this.isMove) {
        let gap = this.clientStartX - this.clientEndX
        gap >= 10 ? (this.active = item.id) : (this.active = "")
      }
    },
    // 获取上一次的step序号
    getPrevMaxStepOrder () {
      const _sql = `SELECT MAX(steporder) as prevMaxStepOrder from actions WHERE actiontypeid = '${this.$route.query.actionTypeId}'`
      sqlQuery(this.$store.state.Database.database, _sql).then(
        (data) => {
          data.length > 0 ? (this.minStep = Number(data[0].prevMaxStepOrder) + 1) : (this.minStep = 1)
        },
        (_err) => { }
      )
    },
    // 获取分类数据
    getActions () {
      const _sql = `SELECT id, name, actiontypeid, isstep, steporder from actions WHERE actiontypeid = '${this.$route.query.actionTypeId}'`
      sqlQuery(this.$store.state.Database.database, _sql).then(
        (data) => {
          data.length > 0 && (this.actions = data)
        },
        (_err) => { }
      )
    },
    // 删除 只允许从后面往前面顺序删除, 不允许乱序删除
    handleDel (item) {
      this.$dialog.confirm({
        message: "确认删除?",
        beforeClose: (action, done) => {
          if (action === "confirm") {
            if ((this.minStep - 1) != item.steporder) {
              this.$toast('只允许逆序删除')
              done(false)
            } else {
              const _sql = `DELETE FROM actions WHERE id = ${item.id}`
              executeSql(this.$store.state.Database.database, [], _sql).then(
                (data) => {
                  this.getActions()
                  this.getPrevMaxStepOrder()
                  this.$toast("删除成功")
                  done()
                },
                (_err) => {
                  this.$toast("删除异常")
                  done(false)
                }
              )
            }
          } else {
            done()
          }
        }
      })
    },
    // 编辑 只允许修改名称
    handleEdit (item) {
      this.isStepDisabled = true
      this.actionId = item.id
      this.actionName = item.name
      this.isShowDialog = true
      this.status = true
      this.stepNum = item.steporder
    }
  }
}
</script>

<style lang="scss">
.body-middle {
  padding-top: 50PX;
  width: 100%;
  overflow-x: hidden;
}
.list-wrapper {
  padding: 12PX;
  ul li {
    padding: 5PX 0;
  }
  .list-action-info-wrapper {
    position: relative;
    line-height: 28PX;
  }
  .list-action-btn-wrapper {
    display: inline-block;
    position: absolute;
    right: -120PX;
  }
}
.add-action-type-dialog-wrapper {
  .cell-wrapper {
    padding: 12PX 12PX 3PX 12PX;
    .van-cell.van-field {
      padding: 5PX 16PX;
      border-bottom: 1PX solid rgba(153, 153, 153, 0.3);
    }
    .van-checkbox {
      padding: 5PX 0;
    }
    .van-checkbox__label {
      font-size: 14PX;
    }
  }
  .van-hairline--top.van-dialog__footer.van-dialog__footer--buttons {
    .van-button--large {
      height: 30PX;
    }
  }
}

.btn-wrapper__active {
  animation: right-to-left-ani 0.5s forwards;
}
@keyframes right-to-left-ani {
  0% {
    right: -120PX;
  }
  50% {
    right: 60PX;
  }
  100% {
    right: 0;
  }
}
</style>

<style lang="scss" scope>
.label {
  text-align: left;
  line-height: 18PX;
  padding-left: 12PX;
}
.step-wrapper {
  text-align: right;
  padding-right: 12PX;
}
</style>
