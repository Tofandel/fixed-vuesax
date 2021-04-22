<template lang="html">
  <header
    :class="[`vs-navbar-${type}`, `vs-navbar-color-${color}`, {'collapse':collapse}]"
    :style="[styleNavbar]"
    class="vs-navbar">
    <div class="vs-navbar--header">
      <button
        :class="{'active-menu' : activeMenuResponsive}"
        class="vs-navbar--btn-responsive"
        @click="activeMenuResponsive = !activeMenuResponsive">
        <span class="btn-responsive-line line--1"></span> <span class="btn-responsive-line line--2"></span>
        <span class="btn-responsive-line line--3"></span>
      </button>

      <slot name="title">
      </slot>
    </div>

    <div
      :class="{'activeMenuResponsive': activeMenuResponsive}"
      class="vs-con-items">
      <slot></slot>
    </div>
  </header>
</template>

<script>
  import _color from '../../utils/color.js';

  export default {
    name: 'VsNavbar',

    props: {
      value: [String, Number],
      type: {
        default: null,
        type: String,
      },
      collapse: Boolean,
      color: {
        type: String,
        default: null,
      },
    },

    data: () => ({
      activeMenuResponsive: false,
    }),

    computed: {
      styleNavbar() {
        return {
          background: _color.getColor(this.color),
        };
      },
    },
    methods: {
      changeIndex(index) {
        this.$emit('input', index);
      },
    },
  };
</script>
