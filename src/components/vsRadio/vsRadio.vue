<template lang="html">
  <label
    :class="[`vs-radio-${color}`]"
    class="vs-component con-vs-radio"> <input
      :name="vsName"
      v-bind="$attrs"
      :checked="isChecked"
      :value="value"
      class="vs-radio--input"
      type="radio"
      v-on="listeners"> <span
        class="vs-radio"> <span
        :style="styles"
        class="vs-radio--borde"></span> <span
          :style="styleCircle"
          class="vs-radio--circle"></span> </span> <span class="vs-radio--label">
            <slot></slot>
          </span> </label>
</template>

<script>
  import _color from '../../utils/color.js';

  export default {
    name: 'VsRadio',
    inheritAttrs: false,
    props: {
      value: [String, Boolean, Number],
      vsValue: [String, Boolean, Number],
      vsName: String,
      color: {
        default: 'primary',
        type: String,
      },
    },
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          input: () => this.$emit('input', this.vsValue),
          click: () => this.$emit('input', this.vsValue),
        };
      },
      attrs() {
        const attrsx = JSON.parse(JSON.stringify(this.$attrs));
        return {
          attrsx,
        };
      },
      isChecked() {
        return this.vsValue.toString() === this.value.toString();
      },
      styles() {
        return {
          border: `2px solid ${this.isChecked ? _color.getColor(this.color, 1) : 'rgb(200, 200, 200)'}`,
        };
      },
      styleCircle() {
        return {
          background: _color.getColor(this.color, 1),
          'box-shadow': `0px 3px 12px 0px ${_color.getColor(this.color, 0.4)}`,
        };
      },
    },
    methods: {
      giveColor(color, opacity) {
        return _color.rColor(color, opacity);
      },
    },
  };
</script>
