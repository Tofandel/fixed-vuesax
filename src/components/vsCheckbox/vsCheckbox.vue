<template lang="html">
  <div
    :class="[`vs-checkbox-${color}`, `vs-checkbox-${size}`]"
    class="vs-component con-vs-checkbox">
    <input
      v-bind="$attrs"
      :checked="isChecked"
      :value="vsValue"
      type="checkbox"
      class="vs-checkbox--input"
      v-on="listeners"> <span
        :style="style"
        class="checkbox_x vs-checkbox"> <span
          :style="styleCheck"
          class="vs-checkbox--check">
          <vs-icon
            :icon="icon"
            :icon-pack="iconPack"
            class="vs-checkbox--icon"/>
        </span> </span> <span class="con-slot-label">
      <slot></slot>
    </span>
  </div>
</template>

<script>
  import _color from '../../utils/color.js';

  export default {
    name: 'VsCheckbox',
    inheritAttrs: false,
    props: {
      color: {
        default: 'primary',
        type: String,
      },
      checked: Boolean,
      value: {
        type: [Boolean, String, Array, Number, Object],
        default() {
          return this.checked;
        },
      },
      icon: {
        default: 'check',
        type: String,
      },
      iconPack: {
        default: 'material-icons',
        type: String,
      },
      vsValue: {
        type: [Boolean, Array, String, Number, Object],
        default: true,
      },
      offValue: {
        type: [Boolean, Array, String, Number, Object],
        default() {
          return typeof this.vsValue === 'boolean' ? false : null;
        },
      },
      size: {
        default: 'default',
        type: String,
      },
    },
    computed: {
      styleCheck() {
        return {
          background: this.isChecked ? _color.getColor(this.color, 1) : null,
        };
      },
      style() {
        return {
          border: `2px solid ${this.isChecked ? _color.getColor(this.color, 1) : 'rgb(180, 180, 180)'}`,
        };
      },
      listeners() {
        return {
          // ...this.$listeners,
          change: (evt) => {
            evt.preventDefault();
            this.toggleValue(evt);
          },
          // input: (evt) => {
          //   this.toggleValue(evt)
          // }
        };
      },
      isChecked() {
        return this.isArray ? this.isArrayIncludes : (this.value === this.vsValue);
      },
      isArray() {
        return Array.isArray(this.value);
      },
      isArrayIncludes() {
        return this.value.includes(this.vsValue);
      },
    },
    watch: {
      checked(c, pr) {
        if (this.value === pr) {
          this.value = c; // Deprecated because will mutate prop directly
        }
      },
    },
    methods: {
      giveColor(color) {
        return _color.rColor(color);
      },
      toggleValue(evt) {
        if (this.isArray) {
          this.setArray();
        } else if (this.value !== this.vsValue) {
          this.$emit('input', this.vsValue, this.vsValue);
        } else {
          this.$emit('input', this.offValue);
        }
        this.$emit('change', evt);
      },
      setArray() {
        // Copy Array
        const value = this.value.slice(0);
        if (this.isArrayIncludes) {
          value.splice(value.indexOf(this.vsValue), 1);
          this.$emit('input', value);
          this.$emit('change', value);
        } else {
          value.push(this.vsValue);
          this.$emit('input', value);
          this.$emit('change', value);
        }
      },
    },
  };
</script>
