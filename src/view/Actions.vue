<template>
  <!-- 类型管理界面 add/edit/del/update  title="分类"-->
  <div>
    <van-nav-bar
      :border="false"
      fixed
      left-text="分类"
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
              v-for="(item, index) in lists"
              :key="index"
              @touchstart="touchstart($event, item)"
              @touchmove="touchmove($event, item)"
              @touchend="touchend($event, item)"
            >
              <div class="list-action-info-wrapper">
                <span>{{ item.name }}</span>
                <div
                  class="list-action-btn-wrapper"
                  v-show="active==item.id"
                  :class="{'btn-wrapper__active': active==item.id}"
                >
                  <van-button type="default" size="mini">编辑</van-button>
                  <van-button type="default" size="mini">删除</van-button>
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
            <van-field v-model="actionTypeName" placeholder="请输入类型名称" />
            <van-checkbox v-model="isStep" icon-size="16PX">是否按步骤进行</van-checkbox>
          </van-cell-group>
        </van-col>
      </van-row>
    </van-dialog>
  </div>
</template>

<script>
import { executeSql } from "@/util/sqliteUtil"
export default {
  name: 'add-actions-view',
  data () {
    return {
      isShowDialog: false,
      actionTypeName: '',
      isStep: false,
      lists: [{
        id: 1,
        name: '分类1',
      }, {
        id: 2,
        name: '分类2',
      }, {
        id: 3,
        name: '分类4',
      }],
      clientStartX: 0,
      clientEndX: 0,
      isMove: false,
      active: '',
    }
  },
  created () {
  },
  methods: {
    // 弹窗取消/确认
    beforeCloseDialog (action, done) {
      if (action == 'confirm') {
        this.confirmAddActionType().then(result => {
          this.$toast('操作成功')
          done()
        }, err => {
          done(false)
        })
      } else {
        // 取消
        done()
      }
    },
    goPrev () {
      this.$router.push('/')
    },
    // 保存数据
    confirmAddActionType () {
      let _self = this
      return new Promise((resolve, reject) => {
        let strLen = _self.actionTypeName.match(/[^ -~]/g) == null ? _self.actionTypeName.length : _self.actionTypeName.length + _self.actionTypeName.match(/[^ -~]/g).length;
        if (_self.actionTypeName == '' || strLen > 10) {
          _self.$toast('文本不能为空且长度不能超过10个字符串')
          reject()
          return
        }
        const _EXECUTEQUERY = 'INSERT INTO actiontypes(name, isstep) VALUES (?,?)'
        let _VALUE = [_self.actionTypeName, _self.isStep]
        // 插入数据
        executeSql(_self.$store.state.Database.database, _VALUE, _EXECUTEQUERY).then(
          data => {
            resolve()
          },
          err => {
            _self.$toast('保存异常, 请稍后再试')
            reject(err)
          }
        )
      })
    },
    handleAddActionType () {
      this.isShowDialog = true
    },
    touchstart (evt, item) {
      this.isMove = false
      this.clientStartX = evt.touches[0].clientX
    },
    touchmove (evt, item) {
      evt.preventDefault();
      this.isMove = true
      this.clientEndX = evt.touches[0].clientX
    },
    touchend (evt, item) {
      if (this.isMove) {
        let gap = this.clientStartX - this.clientEndX
        gap >= 10 ? this.active = item.id : this.active = ''
      }
    }
  },

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
  animation: right-to-left-ani .5s forwards;
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
