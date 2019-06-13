<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img
          width="64"
          height="64"
          :src="seller.avatar"
          alt="商家头像"
        >
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div
          class="supports"
          v-if="seller.supports"
        >
          <span
            class="icon"
            :class="classMap[seller.supports[0].type]"
          ></span><span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div
        class="support-count"
        v-if="seller.supports"
        @click="showDetail"
      >
        <span class="count">{{seller.supports.length}}个</span><i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div
      class="bulletin-wrapper"
      @click="showDetail"
    >
      <!-- 两个span之间不留空白符 -->
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img
        :src="seller.avatar"
        alt="header背景图"
      >
    </div>
    <transition name="fade">
      <div
        class="detail"
        v-show="detailShow"
      >
        <!-- 内容区 -->
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star
                :size="48"
                :score="seller.score"
              ></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul
              class="supports"
              v-if="seller.supports"
            >
              <li
                class="support-item"
                v-for=" (item, index) in seller.supports"
                :key="index"
              >
                <span
                  class="icon"
                  :class="classMap[seller.supports[index].type]"
                ></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div
          class="detail-close"
          @click="hideDetail"
        >
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
// 引入star组件
import star from 'components/star/star.vue';
export default {
  props: {
    seller: {
      type: Object
    }
  },
  // 注册star组件
  components: {
    star
  },
  data () {
    return {
      detailShow: false
    };
  },
  methods: {
    showDetail () {
      this.detailShow = true;
    },
    hideDetail () {
      this.detailShow = false;
    }
  },
  created () {
    // 根据data.json文件中的seller.supports的type字段判断supports类型的class，以便supports的图标确定
    this.classMap = ['decrease', 'discount', 'special', 'ticket', 'guarantee'];
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.header
  position: relative
  // 隐藏filter：blur()之后超出盒子大小的模糊效果
  overflow: hidden
  color: #fff
  background: rgba(7, 17, 27, 0.5)
  .content-wrapper
    position: relative
    padding: 24px 12px 18px 24px
    // 消除父元素中的空白字符，使右边的文字紧挨着左边的图片
    font-size: 0
    .avatar
      display: inline-block
      // 使avatar和content顶部对齐
      vertical-align: top
      img
        border-radius: 2px
    .content
      display: inline-block
      margin-left: 16px
      .title
        margin: 2px 0 8px 0
        .brand
          display: inline-block
          width: 30px
          height: 18px
          // 使图标和右边的文字垂直方向对齐
          vertical-align: top
          bg-image('./brand')
          background-repeat: no-repeat
          background-size: 100%
        .name
          display: inline-block
          margin-left: 6px
          font-size: 16px
          font-weight: bold
          line-height: 18px
      .description
        margin: 8px 0 10px 0
        line-height: 12px
        font-size: 12px
      .supports
        margin: 10px 0 2px 0
        .icon
          display: inline-block
          width: 12px
          height: 12px
          margin-right: 4px
          vertical-align: top
          background-repeat: no-repeat
          background-size: 100%
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.ticket
            bg-image('ticket_4')
          &.special
            bg-image('special_4')
        .text
          display: inline-block
          margin-top: 1px
          line-height: 12px
          font-size: 10px
    .support-count
      position: absolute
      right: 12px
      bottom: 14px
      padding: 0 8px
      height: 24px
      line-height: 24px
      border-radius: 14px
      background-color: rgba(0, 0, 0, 0.2)
      text-align: center
      .count
        vertical-align: top
        font-size: 10px
      .icon-keyboard_arrow_right
        line-height: 24px
        margin-left: 2px
        font-size: 10px
  .bulletin-wrapper
    position: relative
    height: 28px
    line-height: 28px
    padding: 0 22px 0 12px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    background-color: rgba(7, 17, 27, 0.2)
    .bulletin-title
      // 图片必须设置宽高
      display: inline-block
      vertical-align: top
      margin-top: 8px
      width: 22px
      height: 12px
      bg-image('bulletin')
      background-size: 100%
      background-repeat: no-repeat
    .bulletin-text
      vertical-align: top
      margin: 0 4px
      font-size: 12px
    .icon-keyboard_arrow_right
      position: absolute
      right: 12px
      top: 8px
      font-size: 10px
  .background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -1
    // CSS3模糊效果
    filter: blur(10px)
    img
      width: 100%
      height: 100%
  .detail
    position: fixed
    top: 0
    left: 0
    z-index: 100
    width: 100%
    height: 100%
    overflow: auto
    background-color: rgba(7, 17, 27, 0.8)
    font-size: 0
    // 过渡属性
    &.fade-enter, &.fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s ease
    // backdrop-filter: blur(10px)只在ios上生效
    // backdrop-filter：blur(10px)
    // 包裹内容的容器
    .detail-wrapper
      width: 100%
      // 包裹内容的容器最小高度是视口的高度，使底部位于视口底部
      min-height: 100%
      z-index: 1000
      .detail-main
        margin-top: 64px
        // 设置padding-bottom，给底部留空间，当内容高度超过视口高度时底部不会覆盖内容区
        padding-bottom: 64px
        .name
          line-height: 16px
          text-align: center
          font-size: 16px
          font-weight: 700
        .star-wrapper
          margin: 16px 0 28px 0
          padding: 2px 0
          text-align: center
        .title
          display: flex
          width: 80%
          margin: 28px auto 24px auto
          .line
            // line等分剩余空间
            flex: 1
            position: relative
            top: -6px
            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
          .text
            padding: 0 12px
            font-size: 14px
            font-weight: 700
        .supports
          width: 80%
          margin: 24px auto 28px auto
          .support-item
            padding: 0 12px
            margin-bottom: 6px
            font-size: 0
            &:last-child
              margin-bottom: 0
            .icon
              display: inline-block
              margin-right: 6px
              width: 16px
              height: 16px
              vertical-align: top
              background-repeat: no-repeat
              background-size: 100%
              &.decrease
                bg-image('decrease_3')
              &.discount
                bg-image('discount_3')
              &.special
                bg-image('special_3')
              &.ticket
                bg-image('ticket_3')
              &.guarantee
                bg-image('guarantee_3')
            .text
              line-height: 16px
              font-size: 12px
        .bulletin
          width: 80%
          margin: 0 auto
          padding: 0 12px
          .content
            line-height: 24px
            font-size: 12px
    .detail-close
      position: relative
      width: 32px
      height: 32px
      // 使底部显示的位于内容区
      margin: -64px auto 0 auto
      clear: both
      font-size: 32px
</style>
