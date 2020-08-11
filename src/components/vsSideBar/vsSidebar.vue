<template>
  <transition name="vs-sidebar-animate">
    <div
      v-show="staticPosition || value"
      ref="sidebarbackground"
      class="vs-content-sidebar">
      <div
        v-if="!hiddenBackground"
        class="vs-sidebar--background"></div>
      <div
        ref="sidebarContainer"
        :class="[
          `vs-sidebar-${color}`,
          {
            'vs-sidebar-parent': parent != 'body',
            'vs-sidebar-staticPosition': staticPosition,
            'vs-sidebar-position-right': positionRight,
            'vs-sidebar-reduce': reduce,
            'vs-sidebar-reduceNotRebound': reduceNotRebound,
            'vs-sidebar-reduceNotHoverExpand': reduceNotHoverExpand
          }
        ]"
        class="vs-sidebar">
        <header
          v-if="$slots.header"
          class="vs-sidebar--header">
          <slot name="header"></slot>
        </header>

        <div class="vs-sidebar--items">
          <slot></slot>
        </div>

        <vs-spacer v-if="spacer"/>

        <footer
          v-if="$slots.footer"
          class="vs-sidebar--footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<script>
  import utils from '../../utils';

  export default {
    name: 'VsSidebar',
    props: {
      value: {
        default: false,
      },
      defaultIndex: {
        default: null,
        type: [String, Number],
      },
      color: {
        default: 'primary',
        type: String,
      },
      parent: {
        default: null,
        type: [String, Object],
      },
      spacer: Boolean,
      staticPosition: Boolean,
      positionRight: Boolean,
      clickNotClose: Boolean,
      reduce: Boolean,
      reduceNotRebound: Boolean,
      reduceNotHoverExpand: Boolean,
      hiddenBackground: Boolean,
    },
    data: () => ({
      currentIndex: 0,
    }),
    watch: {
      value() {
        if (!this.clickNotClose) this.addEventClick();
      },
    },
    created() {
      this.currentIndex = this.defaultIndex;
    },
    mounted() {
      utils.insertBody(this.$refs.sidebarbackground, this.parent);
    },
    beforeDestroy() {
      utils.removeBody(this.$refs.sidebarbackground, this.parent);
    },
    methods: {
      getActive() {
        return this.currentIndex;
      },
      setIndexActive(index) {
        this.currentIndex = index;
      },
      addEventClick() {
        this.$nextTick(() => {
          const parentx = typeof this.parent === 'string' ? document.querySelector(this.parent) : this.parent;
          const element = parentx || window;
          if (this.value) {
            setTimeout(() => {
              element.addEventListener('click', this.closeSidebar);
            }, 300);
          }
        });
      },
      closeSidebar(evt) {
        const parent = evt.target.closest('.vs-sidebar');
        if (!parent) {
          this.$emit('input', false);
          const parentx = typeof this.parent === 'string' ? document.querySelector(this.parent) : this.parent;
          const element = parentx || window;
          element.removeEventListener('click', this.closeSidebar);
        }
      },
    },
  };
</script>
