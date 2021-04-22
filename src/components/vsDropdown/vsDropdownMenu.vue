<template lang="html">
  <transition name="dropdownx">
    <div
      v-if="dropdownVisible"
      ref="options"
      :class="{'rightx':vsDropRight || $parent.rightx,'notHeight': notHeight}"
      :style="{
        'left':`${leftx}px`,
        'top':`${topx}px`
      }"
      class="con-vs-dropdown--menu vs-dropdown-menu"
      @mouseenter="mouseenterx"
      @mouseleave="mouseleavex">
      <!-- @mouseout="toggleMenu($event)" -->
      <!-- @mouseover="toggleMenu($event)" -->
      <ul
        v-if="!vsCustomContent"
        class="vs-component vs-dropdown--menu">
        <slot></slot>
      </ul>
      <div
        v-else
        class="vs-dropdown--custom vs-dropdown--menu">
        <slot></slot>
      </div>
      <div
        ref="menuAfter"
        :class="[ vsDropRight ? 'vs-dropdown-right--menu--after' : 'vs-dropdown--menu--after']"></div>
    </div>
  </transition>
</template>

<script>
  import utils from '../../utils';

  export default {
    name: 'VsDropdownMenu',
    data: () => ({
      dropdownVisible: false,
      leftAfter: 20,
      leftx: 0,
      topx: 0,
      rightx: true,
      vsTriggerClick: false,
      vsDropRight: false,
      widthx: 0,
      notHeight: false,
      vsCustomContent: false,
      parentNode: null,
    }),
    watch: {
      dropdownVisible(val) {
        const dropdownGroup = this.$children.filter(item => item.hasOwnProperty('activeGroup'));
        dropdownGroup.forEach((item_group) => {
          item_group.activeGroup = false;
        });
        this.setDirection();

        if (!val) {
          this.$parent.rightx = false;
        }
      },
    },
    mounted() {
      utils.insertBody(this);
    },
    beforeDestroy() {
      utils.removeBody(this);
    },
    methods: {
      mouseenterx() {
        if (!this.vsTriggerClick) {
          this.dropdownVisible = true;
          this.widthx = this.$el.clientWidth;
        }
      },
      mouseleavex() {
        if (!this.vsTriggerClick) {
          this.dropdownVisible = false;
          this.widthx = this.$el.clientWidth;
        }
      },
      setDirection() {
        setTimeout(() => {
          const dropdown = this.parentNode;
          const menuAfter = this.$refs.menuAfter;
          if (!menuAfter) return;
          if (dropdown && menuAfter && dropdown.getBoundingClientRect().top + 300 >= window.innerHeight) {
            // const hasGroup = this.$children.find(it=>it.hasOwnProperty('activeGroup'))
            menuAfter.style.bottom = '-5px';
            menuAfter.style.transform = 'rotate(225deg)';
            return;
          }
          menuAfter.style.top = '10px';
        }, 100);
      },
      toggleMenu(event) {
        if (event.type === 'mouseover' && !this.vsTriggerClick) {
          this.dropdownVisible = true;
        } else if (!this.vsTriggerClick) {
          this.dropdownVisible = false;
        }
        this.widthx = this.$el.clientWidth;
      },
    },
  };
</script>
