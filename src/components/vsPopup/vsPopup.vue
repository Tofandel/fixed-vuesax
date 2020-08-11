<template lang="html">
  <transition name="popup-t">
    <div
      v-if="value"
      :class="[`vs-popup-${color}`,{'fullscreen':fullscreen}]"
      class="vs-component con-vs-popup">
      <div
        :style="styleCon"
        class="vs-popup--background"
        @click="backgroundClose"></div>
      <div
        ref="popupx"
        :style="stylePopup"
        class="vs-popup">
        <!-- //header -->
        <header
          :style="styleHeader"
          class="vs-popup--header">
          <span v-if="prompt"
                :style="styleBefore"
                class="before"></span>
          <div class="vs-popup--title">
            <h3>{{title}}</h3>
          </div>
          <vs-icon
            v-if="!noCloseButton"
            :icon-pack="iconPack"
            :icon="iconClose"
            :style="stylePopup"
            class="vs-popup--close vs-popup--close--icon notranslate"
            @click="close"/>
        </header>

        <!-- // slots  -->
        <div
          :style="styleContent"
          :class="classContent"
          class="vs-popup--content">
          <slot>{{text}}</slot>
        </div>
        <!-- footer buttons -->
        <footer v-if="prompt" class="vs-popup--footer">
          <slot name="footer">
            <vs-button
              :disabled="!valid"
              :color="color"
              :type="buttonAccept"
              class="vs-popup--accept-button"
              @click="acceptDialog">
              {{acceptText}}
            </vs-button>
            <vs-button
              :text-color="'rgba(0,0,0,.5)'"
              :type="buttonCancel"
              class="vs-popup--cancel-button"
              @click="cancelClose">
              {{cancelText}}
            </vs-button>
          </slot>
        </footer>
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
      value: Boolean,
      title: {
        default: 'popup',
        type: String,
      },
      noCloseButton: Boolean,
      fullscreen: Boolean,
      backgroundColor: {
        default: null,
        type: String,
      },
      backgroundColorPopup: {
        default: null,
        type: String,
      },
      prompt: Boolean,
      valid: {
        default: true,
        type: Boolean,
      },
      buttonAccept: {
        default: 'filled',
        type: String,
      },
      buttonCancel: {
        default: 'flat',
        type: String,
      },
      acceptText: {
        default: 'Accept',
        type: String,
      },
      cancelText: {
        default: 'Cancel',
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
      noBackgroundClose: Boolean,
      persistent: Boolean,
      text: {
        default: null,
        type: String,
      },
      type: {
        default: 'alert',
        type: String,
      },
      parent: {
        type: null,
        default: null,
      },
    },
    computed: {
      styleHeader() {
        if (_color.isColor(this.color)) {
          return null;
        }
        return {
          color: _color.getColor(this.color, 1),
        };
      },
      styleBefore() {
        if (_color.isColor(this.color)) {
          return null;
        }
        return {
          background: _color.getColor(this.color, 1),
        };
      },
      styleCon() {
        if (this.backgroundColor) {
          return {
            background: _color.getColor(this.backgroundColor, 1),
          };
        }
        return null;
      },
      stylePopup() {
        if (this.backgroundColorPopup) {
          return {
            background: _color.getColor(this.backgroundColorPopup, 1),
          };
        }
        return null;
      },
    },
    watch: {
      value(val) {
        if (val) {
          this.open();
        }
      },
    },
    mounted() {
      if (this.value) {
        _utils.insertBody(this.$el, this.parent);
      }
    },
    beforeDestroy() {
      if (this.value) {
        _utils.removeBody(this.$el, this.parent);
      }
    },
    methods: {
      rebound() {
        this.$refs.dialogx.classList.add('locked');
        setTimeout(() => {
          this.$refs.dialogx.classList.remove('locked');
        }, 200);
      },
      backgroundClose() {
        if (this.noBackgroundClose) {
          this.rebound();
        } else {
          this.cancelClose();
        }
      },
      acceptDialog() {
        if (this.valid) {
          this.$emit('accept');
          this.close();
        }
      },
      cancelClose() {
        this.$emit('cancel');
        if (!this.persistent) {
          this.close();
        }
      },
      close() {
        if (this.value) {
          // _utils.removeBody(this.$el);
          this.$emit('input', false);
          this.$emit('close');

          this.$nextTick(() => {
            _utils.removeBody(this.$el, this.parent);
          });
        }
      },
      open() {
        this.$emit('input', true);
        this.$emit('open');
        this.$nextTick(() => {
          _utils.insertBody(this.$el, this.parent);
        });
      },
    },
  };
</script>
