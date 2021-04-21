<template lang="html">
  <li
    :class="{'activeChild':active}"
    :style="styleTab"
    class="vs-tabs--li"
    @mouseover="hover = true"
    @mouseout="hover = false">
    <button
      v-bind="$attrs"
      :disabled="disabled"
      :style="styleAlignIcon"
      class="vs-tabs--btn"
      type="button"
      @click="clicked"
      v-on="$listeners">
      <vs-icon
        v-if="icon"
        :icon-pack="iconPack"
        :icon="icon"
        :color="cleanColor"
        class="vs-tabs--btn-icon"/>
      <span v-if="label">{{label}}</span>
    </button>

    <button
      v-if="tag"
      class="vs-tabs--btn-tag"
      @click="$emit('click-tag')">
      <vs-icon
        :icon-pack="iconPack"
        :icon="tag"
        :color="cleanColor"/>
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
    },
    data: () => ({
      vertical: false,
      id: null,
      invert: false,
    }),
    computed: {
      cleanColor() {
        return this.color ? _color.getColor(this.color) : _color.getColor(this.parent.color);
      },
      active() {
        return this.parent && this.parent.childActive && this.parent.childActive.id === this.id;
      },
      styleTab() {
        return this.active ? {
          color: this.cleanColor,
        } : {};
      },
      styleAlignIcon() {
        return this.icon ? 'display:flex;align-items:center' : '';
      },
    },
    created() {
      if (this.id === undefined) {
        this.id = this.index + 1;
      }
    },
    methods: {
      clicked() {
        if (!this.disabled) {
          this.parent.goTo(this.id);
        }
      },
    },
  };
</script>
