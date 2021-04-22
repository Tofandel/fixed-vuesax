<template>
  <div
    class="con-tab vs-tabs--content">
    <vnodes v-if="tab.$scopedSlots.default" :vnodes="tab.$scopedSlots.default()"/>
  </div>
</template>

<script>
  export default {
    name: 'VsTabContent',
    components: {
      Vnodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    props: {
      tab: Object,
    },
  };
</script>
