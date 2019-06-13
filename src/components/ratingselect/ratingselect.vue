<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span
        class="block positive"
        :class="{'active': selectedType===2}"
        @click="select(2, $event)"
      >{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span
        class="block positive"
        :class="{'active': selectedType===0}"
        @click="select(0, $event)"
      >{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span
        class="block negative"
        :class="{'active': selectedType===1}"
        @click="select(1, $event)"
      >{{desc.negative}}<span class="count">{{negatives.length}}</span> </span>
    </div>
    <div
      class="switch"
      :class="{'on': ifOnlyContent}"
      @click="toggleContent($event)"
    >
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
// 评价类型
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: true
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },
  data () {
    return {
      selectedType: this.selectType,
      ifOnlyContent: this.onlyContent
    };
  },
  computed: {
    positives () {
      // 数组过滤
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select (type, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedType = type;
      // this.selectType是个Number类型的值，它的改变不会通知父组件
      // 派发一个事件把type传给父组件，父组件可以监听到子组件的事件并接收到传递的值
      this.$emit('update:selectType', this.selectedType);
    },
    toggleContent (event) {
      if (!event._constructed) {
        return;
      }
      // 取反
      this.ifOnlyContent = !this.ifOnlyContent;
      // 派发事件更新父组件对应的prop
      this.$emit('update:onlyContent', this.ifOnlyContent);
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
.ratingselect
  .rating-type
    padding: 18px 0
    margin: 0 18px
    border-1px(rgba(7, 17, 27, 0.1))
    color: rgb(77, 85, 93)
    font-size: 0
    .block
      display: inline-block
      line-height: 16px
      margin-right: 8px
      padding: 8px 12px
      border-radius: 1px
      font-size: 12px
      &.active
        color: #fff
      .count
        font-size: 12px
        margin-left: 2px
      &.positive
        background-color: rgba(0, 160, 220, 0.2)
        &.active
          background-color: rgb(0, 160, 220)
      &.negative
        background-color: rgba(77, 85, 93, 0.2)
        &.active
          background-color: rgb(77, 85, 93)
  .switch
    line-height: 24px
    padding: 12px 18px
    color: rgb(147, 153, 159)
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    font-size: 0
    &.on
      .icon-check_circle
        color: rgb(0, 200, 80)
    .icon-check_circle
      display: inline-block
      vertical-align: top
      margin-right: 4px
      font-size: 24px
    .text
      display: inline-block
      vertical-align: top
      font-size: 12px
</style>
