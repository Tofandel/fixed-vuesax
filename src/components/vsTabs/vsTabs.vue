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
      </ul>
      <span
        :style="stylex"
        class="line-vs-tabs"></span>
    </div>
    <div class="con-slot-tabs">
      <transition :name="!forward?vertical?'fade-tab-vertical-invert':'fade-tab-invert':vertical?'fade-tab-vertical':'fade-tab'">
        <div
          v-if="active"
          class="con-tab vs-tabs--content">
          <vnodes :vnodes="activeChild.$scopedSlots.default"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import _color from '../../utils/color.js';
  import ProviderParentMixin, { Sorted } from '../../utils/ProviderParentMixin';

  export default {
    name: 'VsTabs',
    components: {
      Vnodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes(),
      },
    },
    mixins: [ProviderParentMixin('vsTabs', Sorted)],
    props: {
      value: {
        default: 0,
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
        return {
          top: `${this.topx}px`,
          left: `${this.leftx}px`,
          width: `${this.widthx}px`,
          height: `${this.heightx}px`,
          background: `linear-gradient(30deg, ${_color.getColor(this.childActive.cleanColor, 1)} 0%, ${_color.getColor(this.childActive.cleanColor, 0.5)} 100%)`,
          boxShadow: `0px 0px 8px 0px ${_color.getColor(this.childActive.color, 0.5)}`,
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
      this.childActive = this.value !== undefined ? this.childItems.find((c) => this.value === c.id)
        : (this.sortedItems.length ? this.sortedItems[0] : null);
    },
    methods: {
      goTo(id) {
        if (!this.childActive || this.childActive.id !== id) {
          this.previous = this.childActive;
          this.childActive = id;
          this.$emit('input', id);
        }
      },
      activeChild(index, initialAnimation) {
        initialAnimation = !!initialAnimation;
        const elem = this.$refs.li[index];
        if (this.childActive === index && !initialAnimation) {
          this.these = true;
          elem.classList.add('isActive');
          setTimeout(() => {
            elem.classList.remove('isActive');
            this.these = false;
          }, 200);
        }

        this.childItems.map((item, item_index) => {
          if (item_index !== index) {
            item.active = false;
          }
        });

        if (this.childActive > index) {
          this.sortedItems[index].invert = true;
          this.sortedItems[this.childActive].invert = false;
        } else {
          this.sortedItems[this.childActive].invert = true;
          this.sortedItems[index].invert = false;
        }

        this.sortedItems[index].active = true;
        this.childActive = index;
        this.$emit('input', this.childActive);

        this.changePositionLine(elem, initialAnimation);
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
