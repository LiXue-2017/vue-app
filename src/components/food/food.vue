<template>
  <transition name="move">
    <div
      class="food"
      v-show="showFlag"
      ref="food"
    >
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div
            class="back"
            @click="hideFoodDetail"
          >
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.sellCount}}%</span>
          </div>
          <div class="price-wrapper">
            <price :food="food"></price>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol
              :food="food"
              @cart-add="drop"
            ></cartcontrol>
          </div>
          <div
            class="buy"
            v-show="!food.count || food.count === 0"
            @click="addFirst"
          >加入购物车</div>
        </div>
        <split v-show="food.info"></split>
        <div
          class="info"
          v-show="food.info"
        >
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split v-show="food.ratings"></split>
        <div class="ratings">
          <h1 class="title">商品评价</h1>
          <ratingselect
            :ratings="food.ratings"
            :select-type.sync="selectType"
            :only-content.sync="onlyContent"
            :desc="desc"
            ref="ratingselect"
          ></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li
                class="rating-item border-1px"
                v-for="(rating, index) in food.ratings"
                :key="index"
                v-show="needShow(rating.rateType, rating.text)"
              >
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img
                    class="avatar"
                    width="12"
                    height="12"
                    :src="`${rating.avatar}`"
                    alt="用户头像"
                  >
                </div>
                <div class="time">{{rating.rateTime | formatTime(rating.rateTime)}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div
              class="no-rating"
              v-show="!food.ratings || !food.ratings.length"
            >暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import price from 'components/price/price.vue';
import cartcontrol from 'components/cartcontrol/cartcontrol.vue';
import Vue from 'vue';
import split from 'components/split/split.vue';
import ratingselect from 'components/ratingselect/ratingselect';
import { formatDate } from 'common/js/date.js';
// 评价类型
// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  methods: {
    // 供父组件调用
    show () {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      // 当子组件的prop值发生变化后，当下一次调用show方法时重置子组件中的prop值
      this.$refs.ratingselect.selectedType = ALL;
      this.$refs.ratingselect.ifOnlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hideFoodDetail () {
      this.showFlag = false;
    },
    addFirst (event) {
      // 防止PC端多次点击
      if (!event._constructed) {
        return;
      }
      this.$emit('cart-add', event.target);
      Vue.set(this.food, 'count', 1);
    },
    drop (target) {
      // 多个动画同时计算，造成性能开销，以下通过异步优化
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        // 调用父组件的方法
        this.$parent._drop(target);
      });
    },
    // 需要显示的商品评价
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return this.selectType === type;
      }
    }
  },
  filters: {
    formatTime (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    price,
    cartcontrol,
    split,
    ratingselect
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 46
  width: 100%
  background-color: #fff
  transform: translate3d(0, 0, 0)
  &.move-enter-active, &.move-leave-active
    transition: all 0.3s linear
  &.move-enter, &.move-leave-to
    transform: translate3d(100%, 0, 0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        // 让按钮点击区域变大
        display: block
        padding: 10px
        font-size: 20px
        color: #fff
  .food-content
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        line-height: 10px
        height: 10px
        margin-bottom: 18px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .cartcontrol-wrapper
        position: absolute
        bottom: 12px
        right: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        background-color: rgb(0, 160, 220)
        color: #fff
        font-size: 10px
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .ratings
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          color: rgb(147, 153, 159)
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              vertical-align: top
              margin-right: 6px
              font-size: 10px
            .avatar
              border-radius: 50%
          .time
            line-height: 12px
            margin-bottom: 6px
            font-size: 10px
          .text
            line-height: 16px
            font-size: 12px
            .icon-thumb_up, .icon-thumb_down
              line-height: 16px
              margin-right: 4px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
