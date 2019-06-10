<template>
  <div class="goods">
    <div
      class="menu-wrapper"
      ref="menuWrapper"
    >
      <ul>
        <!-- z-index: 10 -->
        <li
          class="menu-item"
          v-for="(item, index) in goods"
          :key="index"
          :class="{'current':currentIndex===index}"
          @click="selectMenu(index, $event)"
        >
          <span class="text border-1px">
            <span
              class="icon"
              v-show="item.type > 0"
              :class="classMap[item.type]"
            ></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div
      class="foods-wrapper"
      ref="foodsWrapper"
    >
      <ul>
        <!-- 给class加一个hook，表明这个class是为了被js选择，这个样式并没有实际的效果 -->
        <li
          class="food-list food-list-hook"
          v-for="(item, index) in goods"
          :key="index"
        >
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li
              class="food-item"
              v-for="(food, index) in item.foods"
              :key="index"
              @click="selectFood(food, $event)"
            >
              <div class="icon">
                <img
                  width="57"
                  height="57"
                  :src="food.icon"
                >
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="descrition">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}</span>
                </div>
                <div class="price-wrapper">
                  <price :food="food"></price>
                </div>
                <!-- cartcontrol组件，控制购物数量 -->
                <div class="cartcontrol-wrapper">
                  <cartcontrol
                    :food="food"
                    @cart-add="_drop"
                  ></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
      :select-foods="selectFoods"
      ref="shopcart"
    ></shopcart>
    <food
      :food="selectedFood"
      ref="food"
      @cart-add="_drop"
    ></food>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import shopcart from 'components/shopcart/shopcart.vue';
import cartcontrol from 'components/cartcontrol/cartcontrol.vue';
import food from 'components/food/food.vue';
import price from 'components/price/price.vue';
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      // menuScroll: {},
      // foodsScroll: {},
      // 滚动区间的高度，元素是每个li的高度
      listHeight: [],
      // Y轴实时的滚动位置
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        // 如果scrollY在某个区兼之间，就返回当前区间索引
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods () {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created () {
    // 用vue-resource
    this.$http.get('api/goods').then(function (response) {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          // 计算滚动高度
          this._calculateHeight();
        })
      }
    })
    // 根据data.json文件中的seller.supports的type字段判断supports类型的class，以便supports的图标确定
    this.classMap = ['decrease', 'discount', 'special', 'ticket', 'guarantee'];
  },
  methods: {
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        // better-scroll 默认会阻止浏览器的原生 click 事件。
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        // probeType为3，在屏幕滑动过程中、在momentum滚动动画运行过程中实时派发scroll事件
        probeType: 3,
        click: true
      });
      // 添加滚动事件
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      });
    },
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        // 元素的clientHeight = padding + 内容height
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu (index, event) {
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    _drop (target) {
      // 多个动画同时计算，造成性能开销，以下通过异步优化
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        // 调用子组件的方法
        this.$refs.shopcart.drop(target);
      })
    },
    // 展开商品详情页
    selectFood (food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      // 调用子组件的show方法
      this.$refs.food.show();
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food,
    price
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background-color: #f3f5f7
    .menu-item
      // 当文字1到多行都能保持垂直居中
      display: table
      width: 56px
      height: 54px
      line-height: 14px
      padding: 0 12px
      &.current
        position: relative
        margin-top: -1px
        z-index: 10
        background-color: #fff
        font-weight: 700
        .text
          border-none()
      .text
        display: table-cell
        vertical-align: middle
        width: 56px
        font-size: 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          margin-right: 2px
          background-repeat: no-repeat
          background-size: 100%
          &.decrease
            bg-image('decrease_2')
          &.discount
            bg-image('discount_2')
          &.special
            bg-image('special_2')
          &.guarantee
            bg-image('guarantee_2')
          &.ticket
            bg-image('ticket_2')
  .foods-wrapper
    flex: 1
    .title
      line-height: 26px
      padding-left: 13px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background-color: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        img
          width: 57px
          height: 57px
          margin-right: 10px
      .content
        flex: 1
        .name
          line-height: 14px
          margin: 2px 0 8px 0
          font-size: 14px
          color: rgb(7, 17, 27)
        .descrition, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .descrition
          line-height: 12px
          margin: 8px 0
        .extra
          .count
            margin-right: 12px
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>
