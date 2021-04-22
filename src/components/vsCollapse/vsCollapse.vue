<template>
  <div
    :class="[type]"
    class="vs-collapse">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'VsCollapse',
    props: {
      accordion: Boolean,
      type: {
        default: 'default',
        type: String,
      },
      openHover: Boolean,
    },
    methods: {
      emitChange() {
        this.$emit('change');
      },
      closeAllItems(el) {
        const children = this.$children;
        children.forEach((item) => {
          if (item.$el !== el) {
            item.maxHeight = '0px';
          }
        });
      },
    },
  };
</script>
