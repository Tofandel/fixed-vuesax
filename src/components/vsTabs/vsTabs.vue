<template lang="html">
  <div
    :class="[`vs-tabs-${color}`,`vs-tabs-position-${position}`]"
    class="con-vs-tabs vs-tabs">
    <div
      class="con-ul-tabs">
      <ul
        ref="ul"
        :class="[`ul-tabs-${alignment}`]"
        class="ul-tabs vs-tabs--ul">
        <slot></slot>
      </ul>
      <span
        :style="stylex"
        class="line-vs-tabs"></span>
    </div>
    <div class="con-slot-tabs">
      <transition :name="!forward?vertical?'fade-tab-vertical-invert':'fade-tab-invert':vertical?'fade-tab-vertical':'fade-tab'">
        <keep-alive>
          <vs-tab-content v-if="childActive" :key="childActive._uid" :tab="childActive"/>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
  import _color from '../../utils/color.js';
  import ProviderParentMixin, { Sorted } from '../../utils/ProviderParentMixin';
  import VsTabContent from './vsTabContent';

  export default {
    name: 'VsTabs',
    components: { VsTabContent },
    mixins: [ProviderParentMixin('vsTabs', Sorted)],
    props: {
      value: {
        default: undefined,
        type: [Number, String],
      },
      color: {
        default: 'primary',
        type: String,
      },
      alignment: {
        default: 'left',
        type: String,
      },
      position: {
        default: 'top',
        type: String,
      },
    },
    data: () => ({
      topx: 'auto',
      heightx: 2,
      hover: false,
      previous: null,
      childActive: null,
      leftx: 0,
      widthx: 0,
      these: false,
    }),
    computed: {
      forward() {
        return this.sortedItems.findIndex((f) => f === this.childActive) > this.sortedItems.findIndex((f) => f === this.previous);
      },
      vertical() {
        return this.position === 'left' || this.position === 'right';
      },
      stylex() {
        const col_a = _color.getColor(this.childActive ? this.childActive.cleanColor : this.color, 0.5);
        return {
          top: `${this.topx}px`,
          left: `${this.leftx}px`,
          width: `${this.widthx}px`,
          height: `${this.heightx}px`,
          background: `linear-gradient(30deg, ${_color.getColor(this.childActive ? this.childActive.cleanColor : this.color, 1)} 0%, ${col_a} 100%)`,
          boxShadow: `0px 0px 8px 0px ${col_a}`,
          transform: `scaleX(${this.these ? 1.3 : 1})`,
        };
      },
    },
    watch: {
      value(id) {
        this.goTo(id);
      },
    },
    mounted() {
      this.childActive = (this.value !== undefined
        ? this.childItems.find((c) => this.value.toString() === c.uid.toString())
        : (this.sortedItems.length ? this.sortedItems[0] : null));
      this.changePositionLine(this.childActive.$el);
    },
    methods: {
      goTo(id) {
        if (!this.childActive || this.childActive.uid !== id) {
          this.previous = this.childActive;
          this.childActive = this.childItems.find((c) => id.toString() === c.uid.toString()) || this.sortedItems[0];
          this.$emit('input', this.childActive.uid);
          this.changePositionLine(this.childActive.$el);
        }
      },
      changePositionLine(elem) {
        if (this.vertical) {
          this.topx = elem.offsetTop;
          this.heightx = elem.offsetHeight;
          this.widthx = 2;
        } else {
          this.leftx = elem.offsetLeft;
          this.widthx = elem.offsetWidth;
          this.topx = (elem.offsetHeight + (elem.getBoundingClientRect().top - this.$refs.ul.getBoundingClientRect().top));
        }
      },
    },
  };
</script>
