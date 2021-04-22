<template lang="html">
  <nav
    v-bind="$attrs"
    :class="`vs-align-${align}`"
    aria-label="breadcrumb"
    class="vs-breadcrumb"
    v-on="$listeners">
    <ol class="vs-breadcrumb--ol">
      <slot></slot>
      <li
        v-for="item in itemsTitle"
        v-show="!hasSlot"
        :key="item.title"
        :aria-current="item.active ? 'page' : null"
        :class="{'vs-active':item.active,'disabled-link':item.disabled}">
        <a
          v-if="!item.active"
          :href="item.url ? item.url : '#'"
          :title="item.title"
          class="vs-breadcrumb--link"
          v-text="item.title"></a>
        <template v-else>
          <span
            :class="textClass"
            :style="textStyle"
            class="vs-breadcrumb--text"
            v-text="item.title"></span>
        </template>
        <span
          v-if="!item.active"
          :class="separator.length > 1 ? 'material-icons' : null"
          aria-hidden="true"
          class="separator notranslate vs-breadcrum--separator"
          translate="no"
          v-text="separator"></span>
      </li>
    </ol>
  </nav>
</template>

<script>
  import _color from '../../utils/color.js';

  export default {
    name: 'VsBreadcrumb',
    props: {
      items: {
        type: Array,
      },
      separator: {
        type: String,
        default: '/',
      },
      color: {
        type: String,
        default: 'primary',
      },
      align: {
        type: String,
        default: 'left',
      },
    },
    computed: {
      textClass() {
        const classes = {};
        if (_color.isColor(this.color)) {
          classes[`vs-breadcrumb-text-${this.color}`] = true;
        }
        return classes;
      },
      textStyle() {
        const style = {};
        if (!_color.isColor(this.color)) {
          style.color = _color.getColor(this.color);
        }
        return style;
      },
      hasSlot() {
        return !!this.$slots.default;
      },
      itemsTitle() {
        return this.items.map(item => {
          if (typeof item.title === 'function') {
            return {
              ...item,
              title: item.title(this.$route.params),
            };
          }

          return item;
        });
      },
    },
  };
</script>
