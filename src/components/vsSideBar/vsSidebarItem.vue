<template>
  <div
    :class="{'vs-sidebar-item-active':getActive}"
    class="vs-sidebar--item"
    @click="setIndexActive">
    <router-link
      v-if="to"
      :to="to">
      <vs-icon
        :icon="icon"
        :icon-pack="iconPack"/>
      <slot></slot>
    </router-link>
    <a
      v-else
      :href="href">
      <vs-icon
        :icon="icon"
        :icon-pack="iconPack"/>
      <slot></slot>
    </a>
  </div>
</template>
<script>
  export default {
    name: 'VsSidebarItem',
    props: {
      icon: {
        default: null,
        type: String,
      },
      iconPack: {
        default: 'material-icons',
        type: String,
      },
      href: {
        default: '#',
        type: String,
      },
      to: {
        default: null,
        type: [String, Object],
      },
      index: {
        default: null,
        type: [String, Number],
      },
    },
    computed: {
      getActive() {
        return this.$parent.getActive().toString() === this.index.toString();
      },
    },
    methods: {
      setIndexActive() {
        this.$parent.setIndexActive(this.index);
        this.$emit('click');
      },
    },
  };
</script>
