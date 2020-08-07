<template>
  <tr
    ref="tableTr"
    :class="[`tr-table-state-${state}`, {'is-selected':isSelected, 'selected': data, 'is-expand': expanded, 'activeEdit':
      activeEdit, 'hoverFlat': $parent.hoverFlat}]"
    class="tr-values vs-table--tr"
    @dblclick="dblclicktr"
    @click="clicktr">
    <td
      v-if="$parent.multiple || $slots.expand"
      :class="{'active-expanded': expanded}"
      class="td-check">
      <vs-checkbox
        v-if="$parent.multiple"
        :checked="isSelected"
        size="small"
        @change="handleCheckbox"/>

      <vs-icon v-if="$slots.expand">
        keyboard_arrow_down
      </vs-icon>
    </td>
    <slot></slot>
  </tr>
</template>
<script>
  import Vue from 'vue';
  import trExpand from './vsTrExpand.vue';

  export default {
    name: 'VsTr',
    props: {
      state: {
        type: String,
        default: null,
      },
      data: {
        default: null,
      },
    },
    data: () => ({
      colspan: 0,
      expanded: false,
      activeEdit: false,
    }),
    computed: {
      isSelected() {
        if (this.$parent.multiple && this.$parent.value) {
          return this.data ? this.$parent.value.includes(this.data) : false;
        } else {
          return this.data ? this.$parent.value === this.data : false;
        }
      },
    },
    watch: {
      '$parent.datax'() {
        this.collapseExpandedData();
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.colspan = this.$parent.$refs.thead.querySelectorAll('th').length;
        if (this.$slots.expand) {
          this.colspan++;
        }
        if (this.$slots.expand) this.$parent.hasExpandableData = true;
      });
    },
    beforeDestroy() {
      this.collapseExpandedData();
    },
    methods: {
      handleCheckbox() {
        this.$parent.handleCheckbox(this.data);
      },
      insertAfter(e, i) {
        if (e.nextSibling) {
          e.parentNode.insertBefore(i, e.nextSibling);
        } else {
          e.parentNode.appendChild(i);
        }
      },
      clicktr(evt) {
        this.$parent.clicktr(this.data, true);

        if (this.$slots.expand) {
          this.clicktd(evt);
        }
      },
      dblclicktr() {
        this.$parent.dblclicktr(this.data, true);
      },
      clicktd(evt) {
        if (this.$parent.multiple || !this.$slots.expand) return;
        const tr = evt.target.closest('tr');
        if (this.expanded) {
          tr.parentNode.removeChild(tr.nextSibling);
          this.expanded = false;
        } else {
          const trx = Vue.extend(trExpand);
          const instance = new trx({
            propsData: {
              colspan: this.colspan,
            },
            parent: this,
          });
          instance.$slots.default = this.$slots.expand;

          this.expandedInstance = instance;
          instance.trEl = document.createElement('tr');
          this.insertAfter(tr, instance.trEl);
          instance.vm = instance.$mount(instance.trEl);
          this.expanded = true;
        }
      },
      collapseExpandedData() {
        if (this.expanded) {
          const tr = this.expandedInstance.trEl;
          this.expandedInstance.vm.$destroy();
          tr.parentNode.removeChild(tr);
          delete this.expandedInstance;
          this.expanded = false;
        }
      },
    },
  };
</script>
