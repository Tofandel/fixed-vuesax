<template>
  <td
    ref="td"
    :class="{'td-edit': $slots.edit}"
    class="td vs-table--td">
    <span @click="clicktd">
      <vs-icon
        v-if="$slots.edit"
        class="icon-edit"
        icon="edit"/>
      <slot></slot>
      <span
        v-if="$slots.edit"
        class="empty">{{data ? '' : 'Empty'}}</span></span>
  </td>
</template>
<script>
  import Vue from 'vue';
  import trExpand from './vsTrExpand.vue';
  import InjectedChildMixin from '../../utils/InjectedChildMixin';

  export default {
    name: 'VsTd',
    mixins: [InjectedChildMixin('vsTable', 0, 'table'), InjectedChildMixin('vsTr')],
    props: {
      data: {
        type: null,
      },
    },
    data() {
      return {
        expandedInstance: null,
        activeEdit: false,
      };
    },
    watch: {
      activeEdit() {
        this.parent.activeEdit = this.activeEdit;
      },
    },
    beforeDestroy() {
      this.close();
    },
    updated() {
      if (this.expandedInstance) {
        this.expandedInstance.vm.$slots.default = this.$slots.expand;
      }
    },
    methods: {
      insertAfter(e, i) {
        if (e.nextSibling) {
          e.parentNode.insertBefore(i, e.nextSibling);
        } else {
          e.parentNode.appendChild(i);
        }
      },
      clicktd(evt) {
        if (this.$slots.edit) {
          const tr = evt.target.closest('tr');
          if (!this.activeEdit) {
            const trx = Vue.extend(trExpand);
            const instance = new trx({
              propsData: {
                colspan: this.parent.colspan,
                close: true,
              },
              parent: this,
            });
            instance.$slots.default = this.$slots.edit;
            instance.$on('close', this.close);
            const el = document.createElement('tr');
            this.insertAfter(tr, el);
            instance.vm = instance.$mount(el);
            this.expandedInstance = instance;
            this.activeEdit = true;
            this.table.$on('sorting', this.close);
            setTimeout(() => {
              window.addEventListener('click', this.closeEdit);
            }, 20);
          }
        }
      },
      closeEdit(evt) {
        if (!evt.target.closest('.tr-expand') && !evt.target.closest('.vs-select--options')) {
          this.close();
        }
      },
      close() {
        if (this.activeEdit) {
          this.activeEdit = false;
          this.expandedInstance.$el.parentNode.removeChild(this.expandedInstance.$el);
          this.expandedInstance.vm.$destroy();
          this.expandedInstance.vm.$destroy();
          window.removeEventListener('click', this.closeEdit);
          this.table.$off('sorting', this.close);
        }
      },
    },
  };
</script>
