<template>
  <!-- 有不同尺寸的星 -->
  <div
    class="star"
    :class="starType"
  >
    <span
      v-for="itemClass in itemClasses"
      :key="itemClass.index"
      :class="itemClass"
      class="star-item"
    ></span>
  </div>
</template>
<script type="text/ecmascript-6">
const LENGTH = 5;
const CLASS_ON = 'on';
const CLASS_HALF = 'half';
const CLASS_OFF = 'off';
export default {
  // 从父组件传过来的参数
  props: {
    // star的尺寸
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType () {
      return 'star-' + this.size;
    },
    itemClasses () {
      let result = [];
      // 评分向下0.5倍取整，星只有三种，全星，半星，零星。如4.3取4，4.5、4.6取4.5
      let score = Math.floor(this.score * 2) / 2;
      // 用一个变量表示是否有半星
      let hasDecimal = score % 1 !== 0;
      let integer = Math.floor(score);
      for (let i = 0; i < integer; i++) {
        result.push(CLASS_ON);
      }
      if (hasDecimal) {
        result.push(CLASS_HALF);
      }
      while (result.length < LENGTH) {
        result.push(CLASS_OFF);
      }
      return result;
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.star
  font-size: 0
  .star-item
    display: inline-block
    background-repeat: no-repeat
    background-size: 100%
  &.star-48
    .star-item
      width: 20px
      height: 19px
      margin-right: 22px
      &:last-child
        margin-right: 0
      &.on
        bg-image('star48_on')
      &.half
        bg-image('star48_half')
      &.off
        bg-image('star48_off')
  &.star-36
    .star-item
      width: 15px
      height: 15px
      margin-right: 6px
      &:last-child
        margin-right: 0
      &.on
        bg-image('star36_on')
      &.half
        bg-image('star36_half')
      &.off
        bg-image('star36_off')
  &.star-24
    .star-item
      width: 10px
      height: 10px
      margin-right: 3px
      &:last-child
        margin-right: 0
      &.on
        bg-image('star24_on')
      &.half
        bg-image('star24_half')
      &.off
        bg-image('star24_off')
</style>
