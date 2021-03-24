<template>
  <tr
    ref="tableTr"
    :class="[`tr-table-state-${state}`, {'is-selected':isSelected, 'selected': data, 'is-expand': expanded, 'activeEdit':
      activeEdit, 'hoverFlat': parent.hoverFlat}]"
    class="tr-values vs-table--tr"
    @dblclick="dblclicktr"
    @click="clicktr">
    <td v-if="$slots.expand"
        :class="{'active-expanded': expanded}"
        class="td-expand"
        @click="toggleExpand">
      <vs-icon>
        keyboard_arrow_down
      </vs-icon>
    </td>
    <td v-if="parent.multiple"
        class="td-check">
      <vs-checkbox
        :value="parent.value"
        :vs-value="data"
        size="small"
        @input="parent.setSelected"
        @click.native.stop/>
    </td>
    <slot></slot>
  </tr>
</template>
<script>
  import Vue from 'vue';
  import trExpand from './vsTrExpand.vue';
  import InjectedChildMixin from '../../utils/InjectedChildMixin';
  import ProviderParentMixin from '../../utils/ProviderParentMixin';

  export default {
    name: 'VsTr',
    mixins: [InjectedChildMixin('vsTable'), ProviderParentMixin('vsTr')],
    props: {
      state: {
        type: String,
        default: null,
      },
      data: {
        type: null,
      },
    },
    data: () => ({
      colspan: 0,
      expanded: false,
      activeEdit: false,
      expandedInstance: null,
    }),
    computed: {
      isSelected() {
        if (this.parent.multiple && Array.isArray(this.parent.value)) {
          const str = JSON.stringify(this.data);
          return this.data ? this.parent.value.findIndex((d) => this.data === d || str === JSON.stringify(d)) >= 0 : false;
        } else {
          return this.data ? this.parent.value === this.data || JSON.stringify(this.parent.value) === JSON.stringify(this.data) : false;
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.colspan = this.parent.$refs.thead.querySelectorAll('th').length;
        if (this.$slots.expand) {
          this.colspan++;
        }
        if (this.$slots.expand) this.parent.hasExpandableData = true;
      });
    },
    updated() {
      if (this.expandedInstance) {
        this.expandedInstance.vm.$slots.default = this.$slots.expand;
        this.expandedInstance.vm.$forceUpdate();
      }
    },
    beforeDestroy() {
      this.collapseExpandedData();
    },
    methods: {
      handleCheckbox(v) {
        this.parent.handleCheckbox(this.data, v);
      },
      insertAfter(e, i) {
        if (e.nextSibling) {
          e.parentNode.insertBefore(i, e.nextSibling);
        } else {
          e.parentNode.appendChild(i);
        }
      },
      clicktr() {
        this.parent.clicktr(this.data, true);
      },
      dblclicktr() {
        this.parent.dblclicktr(this.data, true);
      },
      toggleExpand() {
        if (this.expanded) {
          this.collapseExpandedData();
        } else {
          const tr = this.$refs.tableTr;
          const trx = Vue.extend(trExpand);
          const instance = new trx({
            propsData: {
              colspan: this.colspan,
            },
            parent: this,
          });
          instance.$slots.default = this.$slots.expand;

          this.expandedInstance = instance;
          const el = document.createElement('tr');
          this.parent.$on('sorting', this.collapseExpandedData);
          this.insertAfter(tr, el);
          instance.vm = instance.$mount(el);
          this.expanded = true;
        }
      },
      collapseExpandedData() {
        if (this.expanded) {
          this.expandedInstance.$el.parentNode.removeChild(this.expandedInstance.$el);
          this.expandedInstance.vm.$destroy();
          this.parent.$off('sorting', this.collapseExpandedData);
          delete this.expandedInstance;
          this.expanded = false;
        }
      },
    },
  };
</script>
