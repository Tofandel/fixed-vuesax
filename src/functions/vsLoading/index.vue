<template>
  <transition name="fade">
    <div
      v-if="value"
      :style="style"
      :class="[`vs-loading-background-${background}`,`vs-loading-color-${color}`,{'textAfter':textAfter}]"
      class="con-vs-loading"
      @click="effectClick">
      <transition name="effect-click">
        <div
          v-if="activeEffectClick&&clickEffect"
          :style="styleEffectClick"
          class="effect-click">
        </div>
      </transition>

      <h4
        v-if="text"
        class="title-loading">
        {{text}}
      </h4>

      <div
        :style="{
          transform:`scale(${scale})`
        }"
        :class="[type]"
        class="vs-loading">
        <img v-if="src" :src="src">
        <template
          v-else-if="type!=='material'">
          <div
            :style="styleEffect1"
            class="effect-1 effects"></div>
          <div
            :style="styleEffect2"
            class="effect-2 effects"></div>
          <div
            :style="styleEffect3"
            class="effect-3 effects"></div>
        </template>
        <svg
          v-else
          class="spinner"
          width="50px"
          height="50px"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg">
          <circle
            class="path"
            fill="none"
            stroke-width="5"
            stroke-linecap="round"
            cx="33"
            cy="33"
            r="30"/>
        </svg>
      </div>
    </div>
  </transition>
</template>
<script>
  import _color from '../../utils/color.js';
  import _utils from '../../utils';

  export default {
    components: {},
    props: {
      type: {
        type: String,
        default: 'default',
      },
      color: String,
      background: {
        type: String,
        default: null,
      },
      src: String,
      clickEffect: Boolean,
      scale: {
        type: Number,
        default: 1,
      },
      textAfter: Boolean,
      text: String,
      value: {
        type: Boolean,
        default: true,
      },
      container: [Object, String],
    },
    data() {
      return {
        activeEffectClick: false,
      };
    },
    computed: {
      styleEffectClick() {
        return {
          left: `${this.leftx}px`,
          top: `${this.topx}px`,
          topx: 0,
          leftx: 0,
          activeEffectClick: false,
        };
      },
      styleEffect1() {
        switch (this.type) {
          case 'border':
            return {
              borderLeft: `1px solid ${_color.getColor(this.color, 1)}`,
            };
          case 'point':
            return {
              background: _color.getColor(this.color, 0.4),
            };
          case 'radius':
            return {
              border: `3px solid ${_color.getColor(this.color, 1)}`,
            };
          case 'corners':
            return {
              border: `3px solid ${_color.getColor(this.color, 1)}`,
            };
          case 'sound':
            return {
              background: _color.getColor(this.color, 1),
            };
          default:
            return {
              borderLeft: `3px solid ${_color.getColor(this.color, 1)}`,
            };
        }
      },
      styleEffect2() {
        switch (this.type) {
          case 'corners':
            return {};
          default:
            return this.styleEffect1;
        }
      },
      styleEffect3() {
        return this.styleEffect2;
      },
      style() {
        if (this.background) {
          return {
            background: _color.getColor(this.background, 1),
          };
        }
        return null;
      },
    },
    watch: {
      value(val) {
        if (val) {
          _utils.insertBody(this, this.container);
        } else {
          _utils.removeBody(this, this.container);
        }
      },
    },
    mounted() {
      if (this.value) {
        _utils.insertBody(this, this.container);
      }
    },
    beforeDestroy() {
      if (this.value) {
        _utils.removeBody(this, this.container);
      }
    },
    methods: {
      effectClick(evt) {
        this.leftx = evt.offsetX;
        this.topx = evt.offsetY;
        this.activeEffectClick = true;
        setTimeout(() => {
          this.activeEffectClick = false;
        }, 50);
      },
    },
  };
</script>
