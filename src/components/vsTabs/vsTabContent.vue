<template>
  <div
    class="con-tab vs-tabs--content">
    <vnodes v-if="tab.$scopedSlots.default" :key="tab.ctxKey" :vnodes="tab.$scopedSlots.default"/>
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
  };
</script>
