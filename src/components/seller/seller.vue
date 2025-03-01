<template>
  <div
    class="seller"
    ref="sellerWrapper"
  >
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star
            :size="36"
            :score="seller.score"
          ></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>元
            </div>
          </li>
        </ul>
        <div
          class="favorite"
          @click="toggleFavorite($event)"
        >
          <span
            class="icon-favorite"
            :class="{'active': favorite}"
          ></span>
          <span
            class="text"
            :class="{'active': favorite}"
          >{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul
          class="supports"
          v-if="seller.supports"
        >
          <li
            class="support-item border-1px"
            v-for="(item, index) in seller.supports"
            :key="index"
          >
            <span
              class="icon"
              :class="classMap[seller.supports[index].type]"
            ></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-pics">
        <h1 class="title">商家实景</h1>
        <!-- pics-wrapper是为了图片滚动，有一个外层容器固定视口宽度 -->
        <div
          class="pics-wrapper"
          ref="picsWrapper"
        >
          <ul
            class="pics-list"
            ref="picsList"
          >
            <li
              class="pic-item"
              v-for="(pic, index) in seller.pics"
              :key="index"
            >
              <img
                :src="pic"
                alt="商家实景图"
                width="120"
                height="90"
              >
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-infos">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li
            class="info"
            v-for="(info, index) in seller.infos"
            :key="index"
          >{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import star from 'components/star/star';
import split from 'components/split/split';
import BScroll from 'better-scroll';
import { saveToLocal, loadFromLocal } from 'common/js/store';

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
      favorite: (() => {
        // 从缓存中读取
        return loadFromLocal(this.seller.id, 'favorite', false);
      })()
    };
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏';
    }
  },
  components: {
    star,
    split
  },
  watch: {
    'seller' () {
      this._initSellerScroll();
      this._initPicScroll();
    }
  },
  created () {
    // 根据data.json文件中的seller.supports的type字段判断supports类型的class，以便supports的图标确定
    this.classMap = ['decrease', 'discount', 'special', 'ticket', 'guarantee'];
  },
  // 表示DOM已经渲染完毕，better-scroll依赖于原生DOM
  mounted () {
    this._initSellerScroll();
    this._initPicScroll();
  },
  methods: {
    _initSellerScroll () {
      if (!this.sellerScroll) {
        this.sellerScroll = new BScroll(this.$refs.sellerWrapper, {
          click: true
        });
      } else {
        this.sellerScroll.refresh();
      }
    },
    _initPicScroll () {
      if (this.seller.pics) {
        // 计算ul的宽度
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$refs.picsList.style.width = width + 'px';
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picsWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            });
          } else {
            this.picScroll.refresh();
          }
        });
      }
    },
    toggleFavorite (event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, 'favorite', this.favorite);
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
.seller
  position: absolute
  top: 174px
  left: 0
  bottom: 0
  width: 100%
  overflow: hidden
  .overview
    padding: 18px
    position: relative
    .title
      margin-bottom: 8px
      line-height: 14px
      font-size: 14px
      color: rgb(7, 17, 27)
    .desc
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .star
        display: inline-block
        vertical-align: top
        margin-right: 8px
      .text
        display: inline-block
        vertical-align: top
        margin-right: 12px
        line-height: 18px
        font-size: 10px
        color: rgb(77, 85, 93)
    .remark
      display: flex
      padding: 18px 0
      .block
        flex: 1
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        &:last-child
          border: none
        h2
          margin-bottom: 4px
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .content
          line-height: 24px
          font-size: 10px
          color: rgb(7, 17, 27)
          .stress
            font-size: 24px
    .favorite
      position: absolute
      top: 20px
      right: 18px
      width: 40px
      text-align: center
      .icon-favorite
        display: block
        margin-bottom: 4px
        line-height: 24px
        font-size: 24px
        color: rgb(212, 214, 217)
        &.active
          color: rgb(240, 20, 20)
      .text
        line-height: 10px
        font-size: 10px
        color: rgb(164, 169, 174)
        &.active
          color: rgb(77, 85, 97)
  .bulletin
    padding: 18px 18px 0 18px
    .title
      margin-bottom: 8px
      line-height: 14px
      font-size: 14px
      color: rgb(7, 17, 27)
    .content-wrapper
      padding: 0 12px 16px 12px
      line-height: 24px
      font-size: 12px
      color: rgb(240, 20, 20)
      border-1px(rgba(7, 17, 27, 0.1))
    .supports
      padding: 0 12px
      .support-item
        padding: 16px 0
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border: none
        .icon
          display: inline-block
          vertical-align: top
          margin-right: 6px
          width: 16px
          height: 16px
          background-repeat: no-repeat
          background-size: 100%
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.special
            bg-image('special_4')
          &.ticket
            bg-image('ticket_4')
          &.guarantee
            bg-image('guarantee_4')
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
  .seller-pics
    padding: 18px 0 18px 18px
    .title
      margin-bottom: 12px
      line-height: 14px
      font-size: 14px
      color: rgb(7, 17, 27)
    .pics-wrapper
      width: 100%
      overflow: hidden
      // 当所有图片在视口宽度的一行容不下时不折行
      white-space: nowrap
      .pics-list
        font-size: 0
        .pic-item
          display: inline-block
          margin-right: 6px
          width: 120px
          height: 90px
          &:last-child
            margin: 0
  .seller-infos
    padding: 18px 18px 0 18px
    .title
      padding-bottom: 12px
      line-height: 14px
      font-size: 14px
      color: rgb(7, 17, 27)
      border-1px(rgba(7, 17, 27, 0.1))
    .info
      padding: 16px 12px
      line-height: 16px
      font-size: 12px
      color: rgb(7, 17, 27)
      border-1px(rgba(7, 17, 27, 0.1))
</style>
