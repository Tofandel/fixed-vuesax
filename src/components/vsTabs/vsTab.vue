<template lang="html">
  <transition :name="!parent.forward?parent.vertical?'fade-tab-vertical-invert':'fade-tab-invert':parent.vertical?'fade-tab-vertical':'fade-tab'">
    <keep-alive>
      <KeepSlot
        v-if="active"
        :key="uid" class="con-tab vs-tabs--content">
        <slot></slot>
      </KeepSlot>
    </keep-alive>
  </transition>
</template>

<script>
  import InjectedChildMixin, { Sorted } from '../../utils/InjectedChildMixin';
  import _color from '../../utils/color';

  export default {
    name: 'VsTab',
    components: {
      KeepSlot: {
        name: 'KeepSlot',
        render(createElement, context) {
          return createElement(
            'div', // tag name
            this.$slots.default, // array of children
          );
        },
      },
    },
    mixins: [InjectedChildMixin('vsTabs', Sorted)],
    inheritAttrs: false,
    props: {
      label: {
        default: 'Label',
        type: String,
      },
      id: [String, Number],
      icon: {
        default: '',
        type: String,
      },
      disabled: Boolean,
      tag: {
        default: '',
        type: String,
      },
      iconPack: {
        type: String,
        default: 'material-icons',
      },
      color: String,
      tagColor: String,
    },
    data: () => ({
      vertical: false,
      invert: false,
      ctxKey: 0,
    }),
    computed: {
      cleanColor() {
        return this.color ? _color.getColor(this.color) : _color.getColor(this.parent.color);
      },
      active() {
        return this.parent && this.parent.childActive && this.parent.childActive.uid === this.uid;
      },
      styleTab() {
        return this.active
          ? {
            color: this.cleanColor,
          }
          : {};
      },
      styleAlignIcon() {
        return this.icon ? 'display:flex;align-items:center' : '';
      },
      uid() {
        return this.id || this.index + 1;
      },
    },
    beforeUpdate() {
      this.ctxKey++;
    },
    methods: {
      clicked() {
        if (!this.disabled) {
          this.parent.goTo(this.uid);
        }
      },
    },
  };
</script>
