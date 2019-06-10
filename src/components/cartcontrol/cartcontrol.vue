<template>
  <div class="cartcontrol">
    <transition name="move">
      <div
        class="cart-decrease"
        v-show="food.count > 0"
        @click.stop.prevent="decreaseCart"
      >
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div
      class="cart-count"
      v-show="food.count > 0"
    >{{food.count}}</div>
    <div
      class="cart-add icon-add_circle"
      @click.stop.prevent="addCart"
    ></div>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  created () {
    // console.table(this.food);
  },
  methods: {
    addCart (event) {
      // 防止PC端点击时派发两次
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
        // vue特性：通过vue.set()可观测到数据的变化。
        Vue.set(this.food, 'count', 1);
        // 以下不能检测到属性的变化
        // this.food.count = 1;
      } else {
        this.food.count++;
      }
      // 触发一个自定义事件，将参数event.target传递给父组件goods
      this.$emit('cart-add', event.target);
    },
    decreaseCart () {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
  font-size: 0
  .cart-decrease
    display: inline-block
    padding: 6px
    transition: all 0.4s linear
    .inner
      display: inline-block
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
      transition: all 0.4s linear
      // 以下指显示过渡过程的最终效果
    &.move-enter-active
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        transform: rotate(0)
    &.move-leave-active
      opacity: 0
      transform: translate3d(24px, 0, 0)
      .inner
        transform: rotate(180deg)
    &.move-enter
      opacity: 0
      transform: translate3d(24px, 0, 0)
      .inner
        transform: rotate(180deg)
    &.move-leave
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        transform: rotate(0)
  .cart-count
    display: inline-block
    vertical-align: top
    width: 12px
    line-height: 24px
    text-align: center
    padding: 6px 0
    font-size: 10px
    color: rgb(147, 153, 159)
  .cart-add
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: rgb(0, 160, 220)
</style>
