<template>
  <!--  z-index: 50 -->
  <div class="shopcart">
    <div
      class="content"
      @click="toggleList"
    >
      <div class="content-left">
        <div class="logo-wrapper">
          <div
            class="logo"
            :class="{'highlight': totalCount > 0}"
          >
            <i class="icon-shopping_cart"></i>
          </div>
          <div
            class="count"
            v-show="totalCount > 0"
          >{{totalCount}}</div>
        </div>
        <div
          class="price"
          :class="{'highlight': totalCount > 0}"
        >￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div
        class="content-right"
        @click.stop="pay"
      >
        <div
          class="pay"
          :class="payClass"
        >{{payDescription}}</div>
      </div>
    </div>
    <!-- 小球飞入效果 -->
    <div class="ball-container">
      <transition-group
        name="drop"
        tag="div"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <!-- z-index: 200 -->
        <div
          class="ball"
          v-for="ball in balls"
          :key="ball.id"
          v-show="ball.show"
        >
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <!-- 购物车详情 -->
    <transition name="fold">
      <!-- z-index: -1 -->
      <div
        class="shopcart-list"
        v-show="listShow"
      >
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span
            class="empty"
            @click="empty"
          >清空</span>
        </div>
        <div
          class="list-content"
          ref="listContent"
        >
          <ul>
            <li
              class="food"
              v-for="food in selectFoods"
              :key="food.name"
            >
              <span class="name">{{food.name}}</span>
              <span class="price">￥{{food.price * food.count}}</span>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <!-- z-index: -2 -->
      <div
        class="list-mask"
        v-show="listShow"
        @click="hideList"
      >
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
import BScroll from 'better-scroll'
export default {
  props: {
    selectFoods: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default () {
        return [{
          price: 10,
          count: 2
        }];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      balls: [
        {
          id: 1,
          show: false
        },
        {
          id: 2,
          show: false
        },
        {
          id: 3,
          show: false
        },
        {
          id: 4,
          show: false
        },
        {
          id: 5,
          show: false
        }
      ],
      // 下落的小球
      dropBalls: [],
      // 购物车详情是否折叠
      fold: true,
      listShow: false
    }
  },
  computed: {
    totalPrice () {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount () {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDescription () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        return '去结算';
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    }
  },
  watch: {
    totalCount () {
      if (!this.totalCount) {
        this.fold = true;
      }
    },
    fold () {
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
        this.listShow = true;
      } else {
        this.listShow = false;
      }
    }
  },
  methods: {
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          // 以下可以触发小球的动画
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    // 每个transition钩子函数有一个el参数，表示当前执行transition的DOM对象
    beforeEnter (el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          // 浏览器的一个接口，返回元素的大小及其相对于视口的位置。
          let rect = ball.el.getBoundingClientRect();
          // 计算小球开始和落点位置的差距
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
          el.style.transform = `translate3d(0, ${y}px, 0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
          inner.style.transform = `translate3d(${x}px, 0, 0)`;
        }
      }
    },
    enter (el) {
      // 先主动触发一次浏览器重绘,且写注释让eslint忽略这条语句检查
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.display = '';
        el.style.webkitTransform = 'translate3d(0, 0, 0)';
        el.style.transform = 'translate3d(0, 0, 0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = 'translate3d(0, 0, 0)';
        inner.style.transform = 'translate3d(0, 0, 0)';
      });
    },
    afterEnter (el) {
      // 将dropBalls中第一个小球show置为false
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    hideList () {
      this.fold = true;
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`支付${this.totalPrice}元`);
    }
  },
  components: {
    cartcontrol,
    BScroll
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
.shopcart
  position: fixed
  left: 0
  bottom: 0
  z-index: 50
  width: 100%
  height: 48px
  .content
    display: flex
    font-size: 0
    color: rgba(255, 255, 255, 0.4)
    .content-left
      flex: 1
      background-color: #141d27
      .logo-wrapper
        display: inline-block
        vertical-align: top
        position: relative
        top: -10px
        margin: 0 12px
        @media screen and (max-width: 320px)
          margin: 0 6px
        padding: 6px
        width: 56px
        height: 56px
        // IE盒模型
        box-sizing: border-box
        border-radius: 50%
        background-color: #141d27
        .logo
          width: 100%
          height: 100%
          line-height: 44px
          text-align: center
          border-radius: 50%
          background-color: rgba(255, 255, 255, 0.1)
          // 高亮
          &.highlight
            background-color: rgb(0, 160, 220)
            color: rgb(255, 255, 255)
          .icon-shopping_cart
            line-height: 44px
            font-size: 24px
        .count
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 6px
          background-color: rgb(240, 20, 20)
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
          color: rgb(255, 255, 255)
          font-weight: 700
          font-size: 9px
      .price
        display: inline-block
        vertical-align: top
        line-height: 24px
        margin-top: 12px
        box-sizing: border-box
        padding-right: 12px
        @media screen and (max-width: 320px)
          padding-right: 6px
        border-right: 1px solid rgba(255, 255, 255, 0.1)
        font-weight: 700
        font-size: 16px
        &.highlight
          color: rgb(255, 255, 255)
      .desc
        display: inline-block
        vertical-align: top
        line-height: 24px
        margin: 12px 0 0 12px
        font-size: 12px
    .content-right
      flex: 0 0 105px
      width: 105px
      @media screen and (max-width: 320px)
        flex: 0 0 100px
        width: 100px
      .pay
        height: 48px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        &.enough
          background-color: rgb(0, 180, 60)
          color: rgb(255, 255, 255)
        &.not-enough
          background-color: rgb(43, 51, 59)
  .ball-container
    .ball
      position: fixed
      left: 32px
      bottom: 22px
      z-index: 200
      &.drop-enter-active
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background-color: rgb(0, 160, 220)
          transition: all 0.4s linear
  .shopcart-list
    position: absolute
    top: 0
    left: 0
    z-index: -1
    width: 100%
    transform: translate3d(0, -100%, 0)
    transition: all 0.3s linear
    &.fold-enter-active, &.fold-leave-active
      transition: all 0.3s linear
    &.fold-enter, &.fold-leave-to
      transform: translate3d(0, 0, 0)
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background-color: #f3f5f7
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .title
        float: left
        font-size: 14px
        color: rgb(7, 17, 27)
      .empty
        float: right
        font-size: 12px
        color: rgb(0, 160, 220)
    .list-content
      max-height: 217px
      overflow: hidden
      padding: 0 18px
      background-color: #fff
      .food
        position: relative
        line-height: 24px
        padding: 12px 18px
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        .name
          font-size: 14px
          color: rgb(7, 17, 27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .cartcontrol-wrapper
          position: absolute
          top: 6px
          right: 0
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -2
    background-color: rgba(7, 17, 27, 0.6)
    filter: blur(10px)
    backdrop-filter: blur(10px)
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      transition: all 0.7s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      background-color: rgba(7, 17, 27, 0)
</style>
