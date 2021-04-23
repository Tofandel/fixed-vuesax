<template lang="html">
  <li
    :class="{'activeChild':active}"
    :style="styleTab"
    class="vs-tabs--li"
    @mouseout="hover = false"
    @mouseover="hover = true">
    <button
      v-bind="$attrs"
      :disabled="disabled"
      :style="styleAlignIcon"
      class="vs-tabs--btn"
      type="button"
      v-on="$listeners"
      @click="clicked">
      <vs-icon
        v-if="icon"
        :color="cleanColor"
        :icon="icon"
        :icon-pack="iconPack"
        class="vs-tabs--btn-icon"/>
      <span v-if="label">{{label}}</span>
    </button>

    <button
      v-if="tag"
      class="vs-tabs--btn-tag"
      @click="$emit('click-tag')">
      <vs-icon
        :color="tagColor || cleanColor"
        :icon="tag"
        :icon-pack="iconPack"/>
    </button>
  </li>
</template>

<script>
  import InjectedChildMixin, { Sorted } from '../../utils/InjectedChildMixin';
  import vsIcon from '../../components/vsIcon/vsIcon';
  import _color from '../../utils/color';

  export default {
    name: 'VsTab',
    components: {
      vsIcon,
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
