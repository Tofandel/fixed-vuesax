<template>
  <tr
    ref="tableTr"
    :class="[`tr-table-state-${state}`, {'is-selected':isSelected, 'selected': data, 'is-expand': expanded, 'activeEdit':
      activeEdit, 'hoverFlat': parent.hoverFlat}]"
    class="tr-values vs-table--tr"
    @dblclick="dblclicktr"
    @click="clicktr">
    <td v-if="parent.multiple || $slots.expand"
        :class="{'active-expanded': expanded}"
        class="td-check"
        @click="clicktd">
      <vs-checkbox
        v-if="parent.multiple"
        :value="parent.value"
        :vs-value="data"
        size="small"
        @input="parent.setSelected"
        @click.native.stop/>

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
          return this.data ? this.parent.value.indexOf(this.data) >= 0 : false;
        } else {
          return this.data ? this.parent.value === this.data : false;
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
      clicktd(evt) {
        if (this.parent.multiple || !this.$slots.expand) return;
        const tr = evt.target.closest('tr');
        if (this.expanded) {
          this.collapseExpandedData();
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
