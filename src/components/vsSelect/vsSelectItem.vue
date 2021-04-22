<template lang="html">
  <li
    v-show="visible"
    :data-text="text"
    class="vs-component"
    v-on="listeners">
    <button
      ref="item"
      v-bind="$attrs"
      :class="{
        'activex':$parent.parent.multiple?getValue.indexOf(value) >= 0:getValue === value,
        'con-icon':$parent.parent.multiple,
        'disabledx':disabledx
      }"
      :disabled="disabled"
      :style="styles"
      class="vs-select--item"
      name="button"
      type="button"
      @keydown.backspace.prevent="backspace"
      @keydown.down.prevent="navigateOptions('next')"
      @keydown.up.prevent="navigateOptions('prev')"
      @keydown.enter.prevent="clickOption()">
      <vs-icon
        v-if="$parent.parent.multiple"
        class="icon-item vs-select--item-icon"
        icon="check_circle"/>
      <slot name="text">
        <span>{{text}}</span>
      </slot>
    </button>
  </li>
</template>

<script>
  import _color from '../../utils/color.js';

  export default {
    name: 'VsSelectItem',
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
      hoverx: false,
      visible: true,
      // valueInputx: '',
    }),
    computed: {
      disabledx() {
        if (this.$parent.parent.multiple) {
          if (this.isActive) {
            return false;
          } else {
            return parseInt(this.$parent.parent.maxSelected) === this.$parent.parent.value.length;
          }
        } else {
          return false;
        }
      },
      isActive() {
        return this.$parent.parent.multiple ? this.getValue.indexOf(this.value) !== -1 : this.getValue.toString() === this.value.toString();
      },
      listeners() {
        return {
          ...this.$listeners,
          blur: (event) => {
            if (event.relatedTarget ? !event.relatedTarget.closest('.vs-select--options') : true) {
              this.$parent.parent.closeOptions();
            }
          },
          click: (event) => this.clickOption(event),
          mouseover: (event) => {
            this.$emit('mouseover', event);
            this.changeHover(true);
          },
          mouseout: (event) => {
            this.$emit('mouseover', event);
            this.changeHover(false);
          },
        };
      },
      styles() {
        return {
          background: this.isActive ? _color.getColor(this.$parent.parent.color, 0.1) : null,
          color: this.isActive ? _color.getColor(this.$parent.parent.color, 1) : null,
          fontWeight: this.isActive ? 'bold' : null,
        };
      },
      getValue() {
        return this.$parent.parent.value;
      },
    },
    watch: {
      '$parent.parent.active': function () {
        this.init();
      },
      // valueInputx() {
      //   if (this.visible) {
      //     const valueInputx = this.valueInputx.split(',');
      //     if (valueInputx[valueInputx.length - 1] === '') {
      //       // this.getText = this.text;
      //       return;
      //     }
      //     let valuex = valueInputx[valueInputx.length - 1];
      //     const re = new RegExp(valuex, 'i');
      //     if (this.text.toUpperCase().indexOf(valuex.toUpperCase()) === 0) {
      //       valuex = this.MaysPrimera(valuex);
      //     }
      //     this.getText = this.text.replace(re, `<span class="searchx">${valuex}</span>`);
      //   } else {
      //     this.getText = this.text;
      //   }
      // },
    },
    created() {
      this.putValue();
      this.init();
    },
    updated() {
      this.putValue();
    },
    methods: {
      init() {
        this.$nextTick(() => {
          this.$emit('update:isSelected', this.$parent.parent.multiple
            ? this.getValue.indexOf(this.value) !== -1
            : this.getValue.toString() === this.value.toString());
          this.putValue();
        });
      },
      changeHover(booleanx) {
        this.hoverx = booleanx;
      },
      MaysPrimera(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      backspace() {
        if (this.$parent.parent.autocomplete) {
          const valueInput = this.$parent.parent.$refs.inputselect.value;
          this.$parent.parent.$refs.inputselect.value = valueInput.substr(0, valueInput.length - 1);
          this.$parent.parent.$refs.inputselect.focus();
        }
      },
      navigateOptions(orientation) {
        let
          orientationObject = 'nextSibling';
        let lengthx = 0;

        function getNextLi(li, orientationObject) {
          if (li && li.localName === 'li') {
            const lix = li[orientationObject];
            if (li.style) {
              if (li.style.display === 'none') {
                return getNextLi(lix, orientationObject);
              } else {
                return li;
              }
            } else {
              return li;
            }
          } else {
            return false;
          }
        }

        let children = this.$parent.parent.$children;

        children.forEach((item) => {
          if (item.$children.length > 0) {
            children = [...children, ...item.$children];
          }
        });

        children = children.filter((item) => {
          return item.$children.length === 0 && item.$el.localName !== 'span';
        });

        if (orientation === 'prev') {
          orientationObject = 'previousSibling';
          lengthx = children.length;
        }
        const nextElement = getNextLi(this.$el[orientationObject], orientationObject);

        if (nextElement) {
          nextElement.querySelector('.vs-select--item').focus();
        } else {
          if (lengthx === children.length) lengthx--;
          getNextLi(children[lengthx === 0 ? 1 : lengthx].$el, orientationObject).querySelector('.vs-select--item').focus();
        }
      },
      focusValue(index) {
        if (this.$parent.parent.multiple
          ? this.$parent.parent.value.indexOf(this.value) >= 0
          : this.value ===
            this.$parent.parent.value) {
          if (!this.$parent.parent.autocomplete) {
            setTimeout(() => {
              this.$refs.item.focus();
            }, 50);
          }
        } else if (index === 0) {
          if (!this.$parent.parent.autocomplete) {
            setTimeout(() => {
              this.$refs.item.focus();
            }, 50);
          }
        }
      },
      putValue() {
        if (this.value === this.$parent.parent.value) {
          this.$parent.parent.valuex = this.text;
        }
      },
      clickOption() {
        if (this.disabledx) {
          return;
        }
        const text = this.text;
        if (!this.$parent.parent.multiple) {
          this.$parent.parent.active = false;
          document.removeEventListener('click', this.$parent.parent.clickBlur);
          this.$parent.parent.valuex = text;
          this.$parent.parent.$emit('input', this.value);
          this.$parent.parent.changeValue();
        } else if (this.$parent.parent.multiple) {
          this.$parent.parent.valuex = text;
          this.$parent.parent.addMultiple(this.value);
        }
        // this.$parent.parent.$children.forEach((item) => {
        //   item.valueInputx = '';
        // });
      },

      // methods colors
      isColor() {
        return _color.isColor(this.color);
      },
    },
  };
</script>
