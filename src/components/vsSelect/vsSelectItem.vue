<template lang="html">
  <li
    v-show="visible"
    :data-text="text"
    class="vs-select--item"
    :class="{
      'active':isActive,
      'con-icon':parent.multiple,
      'disabled':disabledx
    }"
    :style="styles"
    @click="clickOption">
    <vs-icon
      v-if="parent.multiple"
      class="icon-item vs-select--item-icon"
      icon="check_circle"/>
    <span
      ref="item"
      v-bind="$attrs"
      :disabled="disabledx"
      @keydown.backspace.prevent="backspace"
      @keydown.down.prevent="navigateOptions('next')"
      @keydown.up.prevent="navigateOptions('prev')"
      @keydown.enter.prevent="clickOption">
      <slot>
        {{text}}
      </slot>
    </span>
  </li>
</template>

<script>
  import _color from '../../utils/color.js';
  import InjectedChildMixin, { Sorted } from '../../utils/InjectedChildMixin';

  export default {
    name: 'VsSelectItem',
    mixins: [InjectedChildMixin('VsSelect', Sorted)],
    inheritAttrs: false,
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      value: {
        type: null,
        default: null,
      },
      text: {
        default: null,
        type: String,
      },
    },
    data: () => ({
      // For search
      visible: true,
      hoverx: false,
    }),
    computed: {
      isColor() {
        return _color.isColor(this.color);
      },
      disabledx() {
        if (!this.disabled && this.parent.multiple) {
          if (this.isActive) {
            return false;
          } else {
            return parseInt(this.parent.maxSelected) === this.parent.value.length;
          }
        } else {
          return this.disabled;
        }
      },
      isActive() {
        return this.parent.multiple ? this.getValue.indexOf(this.value) !== -1 : this.getValue === this.value || this.getValue + '' === this.value + '';
      },
      styles() {
        return {
          background: this.isActive && !this.isColor ? _color.getColor(this.parent.color, 0.1) : null,
          color: this.isActive && !this.isColor ? _color.getColor(this.parent.color, 1) : null,
        };
      },
      getValue() {
        return this.parent.value;
      },
    },
    watch: {
      'parent.active'() {
        this.init();
      },
      'parent.searching'(search) {
        if (this.$refs.item) {
          this.$refs.item.innerHTML = this.$refs.item.innerHTML.replace(/<i class="searchx">(.*?)<\/i>/gi, '$1');
          if (search) {
            this.$refs.item.innerHTML = this.$refs.item.innerHTML.replace(new RegExp(search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'ig'), '<i class="searchx">$&</i>');
          }
        }
      },
    },
    created() {
      this.init();
    },
    methods: {
      getText() {
        return this.$refs.item ? this.$refs.item.textContent.trim() : this.text;
      },
      init() {
        this.$nextTick(() => {
          this.$emit('update:isSelected', this.parent.multiple
            ? this.getValue.indexOf(this.value) !== -1
            : this.getValue === this.value || this.getValue + '' === this.value + '');
        });
      },
      backspace() {
        this.parent.backspace();
      },
      focus() {
        this.$nextTick(() => {
          if (!this.disabled && this.$refs.item) {
            this.$refs.item.focus();
          }
        });
      },
      navigateOptions(orientation) {
        this.parent.navigateOptions(orientation);
      },
      clickOption() {
        if (this.disabledx) {
          return;
        }

        this.parent.clickedValue(this.value);
      },

    },
  };
</script>
