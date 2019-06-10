<template>
  <!-- 此组件内容很可能超出视口的高度，所以运用better-scroll组件，因此要固定视口的高度 -->
  <div
    class="ratings"
    ref="ratingsWrapper"
  >
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left border-right-1px">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star
              :size="36"
              :score="seller.serviceScore"
            ></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star
              :size="36"
              :score="seller.foodScore"
            ></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect
        :ratings="ratings"
        :selectType.sync="selectType"
        :onlyContent.sync="onlyContent"
        :desc="desc"
      ></ratingselect>
      <div class="ratings-list">
        <ul>
          <li
            class="rating border-1px"
            v-for="(rating, index) in ratings"
            :key="index"
            v-show="needShow(rating.rateType, rating.text)"
          >
            <div class="avatar">
              <img
                width="28"
                height="28"
                :src="rating.avatar"
                alt="用户头像"
              >
            </div>
            <div class="content">
              <h1 class="username">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star
                  :size=24
                  :score="rating.score"
                ></star>
                <span
                  class="delivery-time"
                  v-show="rating.deliveryTime"
                >{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p
                class="text"
                v-show="rating.text"
              >{{rating.text}}</p>
              <div class="recommend">
                <span :class="{'icon-thumb_up': rating.rateType === 0}"></span>
                <span
                  class="recommend-item"
                  v-for="(item, index) in rating.recommend"
                  :key="index"
                  v-show="rating.recommend && rating.recommend.length"
                >{{item}}</span>
              </div>
              <div class="ratetime">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import star from 'components/star/star'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
import BScroll from 'better-scroll'
import { formatDate } from '../../common/js/date'

const ERR_OK = 0;
const ALL = 2;

export default {
  props: {
    seller: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    }
  },
  filters: {
    formatDate (value) {
      let date = new Date(value);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  methods: {
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  components: {
    star,
    split,
    ratingselect
  },
  created () {
    this.$http.get('/api/ratings').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.ratings = response.data;
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratingsWrapper, {
            click: true
          });
        })
      }
    })
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
.ratings
  // 要固定视口的高度
  position: absolute
  top: 174px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .overview
    display: flex
    padding: 18px 0
    .overview-left
      flex: 0 0 135px
      width: 135px
      padding: 6px 0
      border-right-1px(rgba(7, 17, 27, 0.1))
      text-align: center
      @media screen and (max-width: 320px)
        flex: 0 0 120px
        width: 120px
      .score
        line-height: 28px
        margin-bottom: 6px
        font-size: 24px
        color: rgb(255, 153, 0)
      .title
        line-height: 12px
        margin-bottom: 8px
        font-size: 12px
        color: rgb(7, 17, 27)
      .rank
        line-height: 10px
        font-size: 10px
        color: rgb(147, 153, 159)
    .overview-right
      flex: 1
      padding: 0 18px
      @media screen and (max-width: 320px)
        padding: 0 12px
      .score-wrapper
        margin-bottom: 8px
        height: 18px
        font-size: 0
        .title
          display: inline-block
          vertical-align: top
          line-height: 18px
          font-size: 12px
          color: rgb(7, 17, 27)
        .star
          display: inline-block
          vertical-align: top
          margin: 0 12px
          @media screen and (max-width: 320px)
            margin: 0 6px
        .score
          display: inline-block
          vertical-align: top
          line-height: 18px
          font-size: 12px
          color: rgb(255, 153, 0)
      .delivery-wrapper
        font-size: 0
        .title
          margin-right: 12px
          line-height: 18px
          font-size: 12px
          color: rgb(7, 17, 27)
          @media screen and (max-width: 320px)
            margin-right: 6px
        .time
          font-size: 12px
          color: rgb(147, 153, 159)
  .ratings-list
    padding: 0 18px
    .rating
      display: flex
      padding: 18px 0
      border-1px(rgba(7, 17, 27, 0.1))
      .avatar
        flex: 0 0 28px
        width: 28px
        margin-right: 12px
        img
          border-radius: 50%
      .content
        position: relative
        flex: 1
        .username
          margin-bottom: 4px
          line-height: 12px
          font-size: 10px
          color: rgb(7, 17, 27)
        .star-wrapper
          margin-bottom: 6px
          font-size: 0
          .star, .delivery-time
            display: inline-block
            vertical-align: top
            line-height: 12px
            height: 12px
          .star
            margin-right: 6px
          .delivery-time
            font-size: 10px
            color: rgb(147, 153, 159)
        .text
          margin-bottom: 8px
          line-height: 18px
          font-size: 12px
          color: rgb(7, 17, 27)
        .recommend
          font-size: 0
          .icon-thumb_up, .recommend-item
            display: inline-block
            vertical-align: top
            line-height: 16px
            margin: 0 8px 4px 0
            font-size: 9px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .recommend-item
            width: 62px
            padding: 0 6px
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            box-sizing: border-box
            border: 1px solid rgba(7, 17, 27, 0.1)
            border-radius: 1px
            color: rgb(147, 153, 159)
        .ratetime
          position: absolute
          top: 0
          right: 0
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
</style>
