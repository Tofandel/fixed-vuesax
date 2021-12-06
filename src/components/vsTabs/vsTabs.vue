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
        <li v-for="tab in sortedItems"
            ref="li"
            :key="tab.uid"
            :class="{'activeChild':tab.active}"
            :style="tab.styleTab"
            class="vs-tabs--li">
          <button
            v-bind="tab.$attrs"
            :disabled="tab.disabled"
            :style="tab.styleAlignIcon"
            class="vs-tabs--btn"
            type="button"
            v-on="tab.$listeners"
            @click="tab.clicked">
            <vs-icon
              v-if="tab.icon"
              :color="tab.cleanColor"
              :icon="tab.icon"
              :icon-pack="tab.iconPack"
              class="vs-tabs--btn-icon"/>
            <span v-if="tab.label">{{tab.label}}</span>
          </button>

          <button
            v-if="tab.tag"
            class="vs-tabs--btn-tag"
            @click="$emit('click-tag')">
            <vs-icon
              :color="tab.tagColor || tab.cleanColor"
              :icon="tab.tag"
              :icon-pack="tab.iconPack"/>
          </button>
        </li>
      </ul>
      <span
        :style="stylex"
        class="line-vs-tabs"></span>
    </div>
    <div class="con-slot-tabs">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import _color from '../../utils/color.js';
  import ProviderParentMixin, { Sorted } from '../../utils/ProviderParentMixin';

  export default {
    name: 'VsTabs',
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
      previous: null,
      childActive: null,
      leftx: 0,
      widthx: 0,
      interval: null,
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
          transform: 'scaleX(1)',
        };
      },
    },
    watch: {
      value(id) {
        this.goTo(id);
      },
      childItems() {
        if (!this.childActive) {
          this.goTo(this.value);
        } else if (!this.childItems.find((f) => f === this.childActive)) {
          this.goTo(this.sortedItems[0]);
        }
      },
    },
    mounted() {
      this.goTo(this.value);
      window.addEventListener('resize', this.changePositionLine);
      this.interval = setInterval(this.changePositionLine, 1000);
    },
    destroyed() {
      window.removeEventListener('resize', this.changePositionLine);
      clearInterval(this.interval);
    },
    methods: {
      goTo(id) {
        if (!this.childActive || this.childActive.uid !== id) {
          this.previous = this.childActive;
          this.childActive = id ? this.childItems.find((c) => id.toString() === c.uid.toString()) || this.sortedItems[0] : this.sortedItems[0];
          this.$emit('input', this.childActive ? this.childActive.uid : null);
          this.changePositionLine();
        }
      },
      changePositionLine() {
        setTimeout(() => {
          if (!this.childActive) { return; }
          const elem = this.$refs.li[this.childActive.index];
          if (!elem) {
            return;
          }
          if (this.vertical) {
            this.topx = elem.offsetTop;
            this.heightx = elem.offsetHeight;
            this.widthx = 2;
          } else {
            this.leftx = elem.offsetLeft;
            this.widthx = elem.offsetWidth;
            this.topx = (elem.offsetHeight + (elem.getBoundingClientRect().top - this.$refs.ul.getBoundingClientRect().top));
          }
        }, 0);
      },
    },
  };
</script>
