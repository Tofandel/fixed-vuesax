<template lang="html">
  <div
    :class="[
      `vs-chip-${color}`,
      {
        'closable': closable,
        'con-color': color,
        'bg-chip-transparent': transparent
      }
    ]"
    :style="styleChip"
    class="con-vs-chip">
    <span class="text-chip vs-chip--text">
      <slot></slot>
    </span>

    <button
      v-if="closable"
      class="btn-close vs-chip--close"
      type="button"
      @click="closeChip">
      <vs-icon
        :icon="closeIcon"
        :icon-pack="iconPack"/>
    </button>
  </div>
</template>

<script>
  import _color from '../../utils/color.js';

  export default {
    name: 'VsChip',
    props: {
      item: {
        type: Boolean,
      },
      active: {
        type: Boolean,
        default: true,
      },
      text: {
        type: String,
        default: null,
      },
      closable: Boolean,
      color: {
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
      closeIcon: {
        type: String,
        default: 'clear',
      },
      transparent: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      styleChip() {
        const background = this.transparent ? _color.getColor(this.color, 0.15) : _color.getColor(this.color, 1);
        const color = this.transparent ? _color.getColor(this.color, 1) : _color.contrastColor(background);

        return {
          background,
          color,
        };
      },
    },
    methods: {
      closeChip() {
        this.$emit('input', false);
        this.$emit('click');
      },
      remove() {
        this.$emit('vs-remove', false);
        this.$emit('input', false);
      },
    },
  };
</script>
