<template lang="html">
  <div
    :class="[`vs-select-${color}`, {
      'autocompletex':autocomplete,
      'activeOptions':active,
      'input-select-validate-success':success,
      'input-select-validate-danger':danger,
      'input-select-validate-warning':warning}]"
    :style="getWidth"
    class="con-select">
    <label
      v-if="label"
      :for="'input-select-'+_uid"
      class="vs-select--label">{{label}}</label>
    <div class="input-select-con">
      <!-- v-model="valueFilter" -->
      <input
        v-bind="$attrs"
        :id="'input-select-'+_uid"
        ref="inputselect"
        :readonly="!autocomplete"
        class="input-select vs-select--input"
        type="text"
        v-on="listeners"
        @keydown.esc.stop.prevent="closeOptions">

      <button
        :class="{'activeBtnClear': activeBtnClear}"
        class="icon-select-clear vs-select--icon-clear"
        @click="clearValue">
        <i class="material-icons">close</i>
      </button>

      <vs-icon
        v-if="!activeBtnClear"
        :icon="icon"
        :icon-pack="iconPack"
        class="icon-select vs-select--icon"/>

      <transition name="fadeselect">
        <div
          v-show="active"
          ref="vsSelectOptions"
          :class="{'scrollx':scrollx}"
          :style="cords"
          class="vs-select--options">
          <ul ref="ulx">
            <li v-if="childItems.length === 0 || empty" @click="changeValue(null)">
              {{noData}}
            </li>
            <slot></slot>
          </ul>
        </div>
      </transition>
    </div>

    <transition-group
      @enter="enter"
      @leave="leave"
      @before-enter="beforeEnter">
      <div
        v-if="success"
        key="success"
        class="con-text-validation">
        <span class="span-text-validation span-text-validation-success">{{successText}}</span>
      </div>
      <div
        v-else-if="danger"
        key="danger"
        class="con-text-validation span-text-validation-danger">
        <span class="span-text-validation">{{dangerText}}</span>
      </div>
      <div
        v-else-if="warning"
        key="warning"
        class="con-text-validation span-text-validation-warning">
        <span class="span-text-validation">{{warningText}}</span>
      </div>
      <div
        v-if="descriptionText"
        key="description"
        class="con-text-validation span-text-validation">
        <span class="span-text-validation">{{descriptionText}}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import utils from '../../utils';
  import ProviderParentMixin, { Sorted } from '../../utils/ProviderParentMixin';

  export default {
    name: 'VsSelect',
    mixins: [ProviderParentMixin('VsSelect', Sorted)],
    props: {
      value: null,
      noData: {
        default: 'No data available',
        type: String,
      },
      maxSelected: {
        default: null,
        type: [Number, String],
      },
      autocomplete: Boolean,
      color: {
        default: 'primary',
        type: String,
      },
      multiple: Boolean,
      label: {
        default: null,
        type: [String],
      },
      success: Boolean,
      danger: Boolean,
      warning: Boolean,
      successText: {
        default: null,
        type: String,
      },
      dangerText: {
        default: null,
        type: String,
      },
      warningText: {
        default: null,
        type: String,
      },
      descriptionText: {
        default: null,
        type: String,
      },
      iconPack: {
        default: 'material-icons',
        type: String,
      },
      icon: {
        default: 'keyboard_arrow_down',
        type: String,
      },
      iconClear: {
        default: 'close',
        type: String,
      },
      width: {
        default: null,
        type: String,
      },
    },
    data: () => ({
      valueFilter: '',
      active: false,
      empty: false,
      scrollx: false,
      cords: {},
      searching: '',
    }),
    computed: {
      activeBtnClear() {
        return this.autocomplete && this.searching;
      },
      getWidth() {
        return this.width ? `width:${this.width};` : null;
      },
      parent() {
        return this;
      },
      listeners() {
        return {
          ...this.$listeners,
          blur: event => {
            if (
              this.autocomplete && event.relatedTarget
                ? !event.relatedTarget.closest('.vs-select--options')
                : false
            ) {
              this.closeOptions();
            }
            this.$emit('blur', event);
          },
          focus: event => {
            this.$emit('focus', event);
            const code = (event.keyCode ? event.keyCode : event.which);
            if (code) {
              this.focus();
            }
          },
          mouseup: () => {
            this.focus();
          },
          input: event => {
            if (this.autocomplete) {
              this.$emit('input-change', event);
            }
          },
          keyup: event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              const children = this.childItems.find(item => {
                return item.visible;
              });
              if (children) {
                children.focus();
              }
            } else {
              if (this.autocomplete) {
                this.filterItems(this.$refs.inputselect.value);
              }
            }
          },
        };
      },
    },
    watch: {
      value(event) {
        this.$emit('change', event);
      },
      active(a) {
        if (a) {
          this.openOptions();
        }
        this.$nextTick(() => {
          if (this.$refs.ulx.scrollHeight >= 260) this.scrollx = true;
        });
      },
    },
    mounted() {
      this.changeValue(this.value);
      if (this.active) {
        this.openOptions();
      }
    },
    beforeDestroy() {
      if (this.active) {
        this.closeOptions();
      }
    },
    methods: {
      backspace() {
        if (this.autocomplete) {
          const valueInput = this.$refs.inputselect.value;
          this.$refs.inputselect.value = valueInput.substr(0, valueInput.length - 1);
          this.$refs.inputselect.focus();
        }
      },
      navigateOptions(orientation) {
        const children = this.sortedItems;

        let i = this.index;
        do {
          orientation === 'prev' || orientation === -1 ? --i : ++i;
        } while (i > 0 && i < children.length - 1 && children[i].disabled);

        children[i].focus();
      },
      clickedValue(value) {
        if (this.multiple) {
          this.addMultiple(value);
        } else {
          this.changeValue(value);
        }
      },
      clearValue() {
        this.focus();
        this.changeValue(null);
      },
      addMultiple(value) {
        const currentValues = this.value ? this.value : [];
        if (currentValues.includes(value)) {
          currentValues.splice(currentValues.indexOf(value), 1);
          if (this.autocomplete) {
            this.$refs.inputselect.focus();
          }
        } else {
          currentValues.push(value);
          if (this.autocomplete) {
            this.filterItems();
            this.$refs.inputselect.focus();
          }
        }
        this.changeValue(currentValues);
      },
      filterItems(value = '') {
        this.searching = value;

        let count = 0;
        this.childItems.forEach(item => {
          item.visible = value === '' || item.getText().toUpperCase().indexOf(value.toUpperCase()) >= 0;
          item.visible && count++;
        });

        this.empty = count === 0;

        this.changePosition();
      },
      changeValue(val = null) {
        if (val === null) {
          this.filterItems();
          if (this.multiple) {
            val = [];
          }
        }
        if (val !== this.value) {
          this.$emit('input', val);
        }
        if (val !== null && !this.multiple) {
          this.closeOptions();
        }
        setTimeout(() => {
          if (this.$refs.inputselect) {
            this.$refs.inputselect.value = this.sortedItems
              .filter(item => item.isActive).map((child) => child.getText()).toString();
          }
        }, 0);
      },
      focus() {
        this.active = true;
      },
      clickBlur(event) {
        if (event.target === this.$refs.inputselect) {
          return;
        }
        const closestx = event.target.closest('.vs-select--item');

        if (!closestx) {
          this.closeOptions();
          if (this.autocomplete) {
            this.filterItems('');
          }
        }
      },
      openOptions() {
        utils.insertBody(this.$refs.vsSelectOptions);
        document.addEventListener('click', this.clickBlur);

        const inputx = this.$refs.inputselect;
        if (this.autocomplete && this.multiple) {
          this.$nextTick(() => {
            if (inputx.value) {
              inputx.value += ',';
            }
            inputx.selectionStart = inputx.selectionEnd = 0;
          });
        } else if (this.autocomplete && !this.multiple) {
          this.$refs.inputselect.select();
        }

        if (!this.autocomplete && (this.multiple ? this.value.length === 0 : this.value === null)) {
          this.$nextTick(() => {
            const el = this.childItems[0];
            if (el) el.focus();
          });
        }

        this.changePosition();
      },
      closeOptions() {
        this.active = false;
        utils.removeBody(this.$refs.vsSelectOptions);
        document.removeEventListener('click', this.clickBlur);
      },
      changePosition() {
        this.$nextTick(() => {
          const elx = this.$refs.inputselect;
          const content = this.$refs.vsSelectOptions;
          const conditional = this.autocomplete;
          let topx;
          const scrollTopx = window.pageYOffset || document.documentElement.scrollTop;
          if (
            elx.getBoundingClientRect().top + content.scrollHeight + 20 >=
            window.innerHeight
          ) {
            topx =
              elx.getBoundingClientRect().top +
              elx.clientHeight +
              scrollTopx -
              content.scrollHeight;
            if (conditional) {
              topx = topx - elx.clientHeight - 5;
            }
          } else {
            topx = conditional
              ? elx.getBoundingClientRect().top + elx.clientHeight + scrollTopx + 5
              : elx.getBoundingClientRect().top + scrollTopx;
          }

          const leftx = elx.getBoundingClientRect().left;
          const widthx = elx.offsetWidth;

          this.cords = {
            left: `${leftx}px`,
            top: `${topx}px`,
            width: `${widthx}px`,
          };
        });
      },
      beforeEnter(el) {
        el.style.height = 0;
      },
      enter(el, done) {
        const h = el.scrollHeight;
        el.style.height = h + 'px';
        done();
      },
      leave(el) {
        el.style.height = 0;
      },
    },
  };
</script>
