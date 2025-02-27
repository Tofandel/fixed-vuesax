<template lang="html">
  <button
    v-bind="$attrs"
    :class="[`vs-button-${isColor() ? color : null}`,`vs-button-${type}`,{
      'isActive':isActive,
      'includeIcon':icon,
      'includeIconOnly':icon && !$slots.default,
      'vs-radius':radius
    }, size]"
    :style="[styles,{
      'width':/[px]/.test(size) ? `${size}` : null,
      'height':/[px]/.test(size) ? `${size}` : null
    }]"
    :type="button"
    class="vs-component vs-button"
    name="button"
    v-on="listeners">
    <span
      v-if="!is('line')&&!is('gradient')&&!is('relief')"
      ref="backgroundx"
      :style="stylesBackGround"
      class="vs-button-backgroundx vs-button--background"> </span>

    <vs-icon
      v-if="icon"
      :icon="icon"
      :icon-pack="iconPack"
      :style="{
        'order':iconAfter ? 2 : 0,
        ['margin-' + isRTL('left')]: $slots.default && !iconAfter ? '5px' : '0px',
        ['margin-' + isRTL('right')]: $slots.default && iconAfter ? '5px' : '0px'
      }"
      class="vs-button--icon"/>

    <span
      v-if="$slots.default"
      class="vs-button-text vs-button--text">
      <slot></slot>
    </span>

    <span
      ref="linex"
      :style="styleLine"
      class="vs-button-linex"></span>
  </button>
</template>

<script>
  import _color from '../../utils/color.js';

  export default {
    name: 'VsButton',
    inheritAttrs: false,
    props: {
      type: {
        default: 'filled',
        type: String,
      },
      color: {
        default: 'primary',
        type: String,
      },
      textColor: {
        default: null,
        type: String,
      },
      lineOrigin: {
        default: 'center',
        type: String,
      },
      linePosition: {
        default: 'bottom',
        type: String,
      },
      gradientDirection: {
        default: '30deg',
        type: String,
      },
      gradientColorSecondary: {
        default: 'primary',
        type: String,
      },
      size: {
        type: String,
        default: null,
      },
      icon: {
        type: String,
        default: null,
      },
      iconPack: {
        type: String,
        default: 'material-icons',
      },
      iconAfter: Boolean,
      radius: Boolean,
      to: {
        default: undefined,
        type: [String, Object],
      },
      href: {
        default: '',
        type: [String, Object],
      },
      target: {
        default: false,
        type: [Boolean, String],
      },
      button: {
        default: 'button',
        type: String,
      },
      value: Boolean,
    },
    data: () => ({
      isActive: false,
      hoverx: false,
      leftBackground: 20,
      topBackground: 20,
      radio: 0,
      time: 0.3,
      timeOpacity: 0.3,
      opacity: 1,
    }),
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          click: (event) => this.clickButton(event),
          blur: (event) => this.blurButton(event),
          mouseenter: (event) => this.mouseEnter(event),
          mouseleave: (event) => this.mouseLeave(event),
        };
      },
      styles() {
        if (this.is('filled')) {
          return {
            color: _color.getColor(this.textColor, 1) || _color.contrastColor(this.color),
            background: _color.getColor(this.color, 1),
            boxShadow: this.hoverx ? `0px 8px 25px -8px ${_color.getColor(this.color, 1)}` : null,
          };
        } else if (this.is('border')) {
          return {
            border: `1px solid ${_color.getColor(this.color, 1)}`,
            background: this.hoverx ? _color.getColor(this.color, 0.1) : 'transparent',
            color: _color.getColor(this.textColor, 1) || _color.getColor(this.color, 1),
          };
        } else if (this.is('flat')) {
          return {
            background: this.hoverx ? _color.getColor(this.color, 0.1) : 'transparent',
            color: _color.getColor(this.textColor, 1) || _color.getColor(this.color, 1),
          };
        } else if (this.is('line')) {
          return {
            color: _color.getColor(this.textColor, 1) || _color.getColor(this.color, 1),
            borderBottomWidth: this.linePosition === 'bottom' ? '2px' : null,
            borderColor: `${_color.getColor(this.color, 0.2)}`,
            borderTopWidth: this.linePosition === 'top' ? '2px' : null,
          };
        } else if (this.is('gradient')) {
          const backgroundx = `linear-gradient(${this.gradientDirection}, ${_color.getColor(this.color)} 0%, ${_color.getColor(this.gradientColorSecondary, 1)} 100%)`;
          return {
            background: backgroundx,
          };
        } else if (this.is('relief')) {
          const color = _color.getColor(this.color, 1);
          return {
            background: _color.getColor(this.color, 1),
            boxShadow: `0 3px 0 0 ${_color.darken(color, -0.4)}`,
          };
        }
        return {};
      },
      stylesBackGround() {
        return {
          background: this.is('flat') || this.is('border') ? _color.getColor(this.color, 1, false) : null,
          opacity: this.opacity,
          left: `${this.leftBackground}px`,
          top: `${this.topBackground}px`,
          width: `${this.radio}px`,
          height: `${this.radio}px`,
          transition: `width ${this.time}s ease, height ${this.time}s ease, opacity ${this.timeOpacity}s ease`,
        };
      },
      styleLine() {
        let lineOrigin = '50%';
        if (this.lineOrigin === 'left') {
          lineOrigin = '0%';
        } else if (this.lineOrigin === 'right') {
          lineOrigin = 'auto';
        }

        return {
          top: this.linePosition === 'top' ? '-2px' : 'auto',
          bottom: this.linePosition === 'bottom' ? '-2px' : 'auto',
          background: _color.getColor(this.color, 1),
          left: lineOrigin,
          right: lineOrigin === 'auto' ? '0px' : null,
          transform: lineOrigin === '50%' ? 'translate(-50%)' : null,
        };
      },
    },
    watch: {
      isActive(v) {
        if (this.value !== v) {
          this.$emit('input', v);
        }
      },
      value(val) {
        this.isActive = val;
      },
    },
    methods: {
      isRTL(value) {
        if (this.$vs.rtl) {
          return value;
        } else {
          if (value === 'right') {
            return 'left';
          }
          if (value === 'left') {
            return 'right';
          }
        }
      },
      routerPush() {
        this.$router.push(this.to).catch(err => {
          this.$emit('routeErr', err);
        });
      },
      is(which) {
        return this.type === which;
      },
      mouseEnter(event) {
        this.$emit('mouseover', event);
        this.hoverx = true;
      },
      mouseLeave(event) {
        this.$emit('mouseleave', event);
        this.hoverx = false;
      },
      blurButton(event) {
        this.$emit('blur', event);
        if (this.type === 'border' || this.type === 'flat') {
          this.opacity = 0;
          setTimeout(() => {
            this.radio = 0;
          }, 150);
          this.isActive = false;
        }
      },
      clickButton(event) {
        if (this.isActive) {
          this.blurButton(event);
          return;
        }
        if (this.to) {
          this.routerPush();
        }
        if (this.href) {
          if (typeof (this.href) === 'string') {
            this.target ? window.open(this.href) : window.location.href = this.href;
          } else {
            this.target ? window.open(this.href.url) : window.location.href = this.href.url;
          }
        }
        const btn = this.$el;
        let xEvent = event.offsetX;
        let yEvent = event.offsetY;
        const radio = btn.clientWidth * 3;
        this.time = btn.clientWidth / (btn.clientWidth + (this.is('border') || this.is('flat') ? 70 : 20));
        if (this.is('filled')) {
          this.timeOpacity = this.time;
        }

        if (event.target ? event.target !== btn : false) {
          xEvent += event.target.offsetLeft;
          yEvent += event.target.offsetTop;
        }
        this.leftBackground = xEvent;
        this.topBackground = yEvent;
        this.radio = radio;
        if (this.is('filled')) {
          this.opacity = 0;
        } else {
          this.opacity = 1;
        }

        this.isActive = true;
        if (this.is('filled')) {
          setTimeout(() => {
            this.time = this.timeOpacity = this.radio = 0;
            this.opacity = 1;
            this.isActive = false;
          }, this.time * 1100);
        } else {
          setTimeout(() => {
            this.timeOpacity = 0.15;
            this.isActive = false;
          }, this.time * 1100);
        }
        this.$emit('click', event);
      },
      isColor() {
        return _color.isColor(this.color);
      },
    },
  };
</script>
