<template lang="html">
  <div
    :class="[
      `vs-input-number-size-${size}`,
      `vs-input-number-${color}`,
      {'isChangeValue':isChangeValue}
    ]"
    class="vs-input-number">
    <button
      v-repeat-click="less"
      :disabled="$attrs.disabled"
      :class="{
        limit:value <= min
      }"
      :style="{
        background:getColor
      }"
      class="btn-less vs-input-number--button-less"
      type="button">
      <vs-icon
        :icon-pack="iconPack"
        :icon="iconDec"/>
    </button>
    <span v-if="label">{{label}}</span>
    <input
      ref="input"
      :style="styleInput"
      :value="value"
      v-bind="$attrs"
      :disabled="isDisabled"
      :min="min"
      :max="max"
      type="number"
      class="vs-input-number--input"
      v-on="listeners">
    <button
      v-repeat-click="plus"
      :disabled="$attrs.disabled"
      :class="{
        limit:value >= max && max !== null
      }"
      :style="{
        background:getColor
      }"
      class="btn-plus vs-input-number--button-plus"
      type="button">
      <vs-icon
        :icon-pack="iconPack"
        :icon="iconInc"/>
    </button>
  </div>
</template>

<script>
  import _color from '../../utils/color.js';
  export default {
    name: 'VsInputNumber',
    directives: {
      repeatClick: {
        bind(el, binding, vnode) {
          let intervalx = null;
          let startT;
          const functionx = () => vnode.context[binding.expression].apply();
          const bucle = () => {
            if (new Date() - startT < 100) {
              functionx();
            }
            clearInterval(intervalx);
            intervalx = null;
          };
          const eventx = (e) => {
            if (e.button !== 0) return;
            startT = new Date();
            var escuchando = function () {
              if (bucle) {
                bucle.apply(this, arguments);
              }
              el.removeEventListener('mouseup', escuchando, false);
            };
            el.addEventListener('mouseleave', escuchando, false);
            el.addEventListener('mouseup', escuchando, false);
            clearInterval(intervalx);
            intervalx = setInterval(functionx, 100);
          };
          el.addEventListener('mousedown', eventx, false);
        },
      },
    },
    inheritAttrs: false,
    props: {
      value: {
        type: [Number, String],
      },
      color: {
        default: 'primary',
        type: String,
      },
      label: {
        default: null,
        type: String,
      },
      max: {
        default: null,
        type: [Number, String],
      },
      min: {
        default: 0,
        type: [Number, String],
      },
      size: {
        default: null,
        type: String,
      },
      iconPack: {
        default: 'material-icons',
        type: String,
      },
      iconDec: {
        default: 'remove',
        type: String,
      },
      iconInc: {
        default: 'add',
        type: String,
      },
      step: {
        default: 1,
        type: [Number, String],
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
      isChangeValue: false,
    }),
    computed: {
      styleInput() {
        return {
          width: `${this.getLength}px`,
        };
      },
      getLength() {
        if (this.value) {
          return this.value.toString().length * 9.1;
        } else {
          return 0;
        }
      },
      getColor() {
        return _color.getColor(this.color, 1);
      },
      listeners() {
        return {
          ...this.$listeners,
          blur: (evt) => {
            if (this.cValue > this.cMax) {
              this.$emit('input', this.max);
            } else if (this.cValue < this.cMin) {
              this.$emit('input', this.min);
              this.$emit('blur', evt);
            }
          },
          input: (evt) => {
            this.$emit('input', evt.target.value);
          },
        };
      },
      cMin() {
        return parseFloat(this.min);
      },
      cMax() {
        return parseFloat(this.max);
      },
      cValue() {
        return parseFloat(this.value);
      },
      cStep() {
        return parseFloat(this.step);
      },
    },
    watch: {
      value() {
        this.isChangeValue = true;
        setTimeout(() => {
          this.isChangeValue = false;
        }, 200);
      },
    },
    methods: {
      input(newValue) {
        const inv = 1 / this.cStep;
        newValue = Math.floor(newValue * inv) / inv;
        this.$emit('input', newValue);
      },
      plus() {
        let newValue;
        if (isNaN(this.value)) {
          newValue = 0;
          this.input(newValue);
        } else {
          if (this.max ? this.cValue < this.cMax : true) {
            newValue = this.cValue + this.cStep;
            this.input(newValue);
          }
        }
      },
      less() {
        let newValue;
        if (isNaN(this.value)) {
          newValue = 0;
          this.input(newValue);
        } else {
          if (this.min ? this.cValue > this.cMin : true) {
            newValue = this.cValue - this.cStep;
            this.input(newValue);
          }
        }
      },
    },
  };
</script>
