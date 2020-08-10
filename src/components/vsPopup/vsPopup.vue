<template lang="html">
  <transition name="popup-t">
    <div
      v-if="active"
      ref="con"
      :class="[`vs-popup-${color}`,{'fullscreen':fullscreen}]"
      class="vs-component con-vs-popup">
      <div
        :style="styleCon"
        class="vs-popup--background"
        @click="close"></div>
      <div
        ref="popupx"
        :style="stylePopup"
        class="vs-popup">
        <!-- //header -->
        <header
          :style="styleHeader"
          class="vs-popup--header">
          <div class="vs-popup--title">
            <h3>{{title}}</h3>
          </div>
          <vs-icon
            v-if="!buttonCloseHidden"
            ref="btnclose"
            :icon-pack="iconPack"
            :icon="iconClose"
            :style="stylePopup"
            class="vs-popup--close vs-popup--close--icon"
            @click="close"/>
        </header>

        <!-- // slots  -->
        <div
          :style="styleContent"
          :class="classContent"
          class="vs-popup--content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import _color from '../../utils/color.js';
  import _utils from '../../utils/index';

  export default {
    name: 'VsPopup',
    props: {
      color: {
        default: 'primary',
        type: String,
      },
      value: {
        type: Boolean,
        default() {
          return this.active;
        },
      },
      title: {
        default: 'popup',
        type: String,
      },
      buttonCloseHidden: Boolean,
      fullscreen: Boolean,
      backgroundColor: {
        default: null,
        type: String,
      },
      backgroundColorPopup: {
        default: 'rgb(255,255,255)',
        type: String,
      },
      styleContent: {
        default: null,
        type: String,
      },
      classContent: {
        default: null,
        type: String,
      },
      iconPack: {
        default: 'material-icons',
        type: String,
      },
      iconClose: {
        default: 'close',
        type: String,
      },
    },
    computed: {
      styleHeader() {
        return {
          color: _color.getColor(this.color, 1),
        };
      },
      styleAfter() {
        return {
          background: _color.getColor(this.color, 1),
        };
      },
      styleCon() {
        return {
          background: _color.getColor(this.backgroundColor, 1),
        };
      },
      stylePopup() {
        return {
          background: _color.getColor(this.backgroundColorPopup, 1),
        };
      },
    },
    watch: {
      value(val) {
        if (val) {
          this.open();
        }
      },
    },
    methods: {
      giveColor(color) {
        return _color.rColor(color);
      },
      close() {
        if (this.value) {
          // _utils.removeBody(this.$refs.con);
          this.$emit('input', false);
          this.$emit('close');
        }
      },
      open() {
        this.$emit('input', true);
        this.$emit('open');
        this.$nextTick(() => {
          if (this.$refs.con) {
            _utils.insertBody(this.$refs.con);
          }
        });
      },
    },
  };
</script>
