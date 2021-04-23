<template>
  <div
    class="con-tab vs-tabs--content">
    <vnodes v-if="tab.$scopedSlots.default" :key="key" :vnodes="tab.$scopedSlots.default"/>
  </div>
</template>

<script>
  export default {
    name: 'VsTabContent',
    components: {
      Vnodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes(),
      },
    },
    props: {
      tab: Object,
    },
    data() {
      return {
        key: 0,
      };
    },
    beforeUpdate() {
      this.key++;
    },
  };
</script>
