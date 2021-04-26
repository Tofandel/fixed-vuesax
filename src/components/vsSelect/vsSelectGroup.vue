<template>
  <li v-show="shouldShow" class="vs-select-group">
    <h4>
      {{title}}
    </h4>
    <ul>
      <slot></slot>
    </ul>
  </li>
</template>
<script>
  import InjectedChildMixin, { NoRegister } from '../../utils/InjectedChildMixin';

  export default {
    name: 'VsSelectGroup',
    mixins: [InjectedChildMixin('VsSelect', NoRegister)],
    props: {
      title: {
        default: 'Group',
        type: String,
      },
    },
    computed: {
      shouldShow() {
        return this.$children.some((child) => child.visible);
      },
    },
  };
</script>
