<template>
  <div>
    <div
      ref="tableTr"
      :class="[ 'tr', `tr-table-state-${state}`,
                {
                  'is-selected':isSelected,
                  'selected': data,
                  'tr-expandedx is-expand': expanded,
                  'activeEdit':activeEdit,
                  'hoverFlat': $parent.hoverFlat
                }]"
      class="tr-values vs-table--tr"
      @dblclick="dblclicktr"
      @click="clicktr">
      <div
        v-if="$parent.multiple || $slots.expand"
        :class="{'active-expanded': expanded}"
        class="td td-check">
        <vs-checkbox
          v-if="$parent.multiple"
          :checked="isSelected"
          size="small"
          @change="handleCheckbox"/>

        <vs-icon v-if="$slots.expand">
          keyboard_arrow_down
        </vs-icon>
      </div>
      <slot></slot>
    </div>
    <vs-tr-expand v-if="expanded" active :colspan="colspan">
      <slot name="expand"></slot>
    </vs-tr-expand>
  </div>
</template>
<script>
  import VsTrExpand from './vsTrExpand';

  export default {
    name: 'VsTr',
    components: { VsTrExpand },
    directives: {
      fragments: {
        inserted: function (el) {
          const children = Array.from(el.children);
          const parent = el.parentElement;
          children.forEach((item) => {
            parent.appendChild(item);
          });
          parent.removeChild(el);
        },
      },
    },
    props: {
      state: {
        type: String,
        default: null,
      },
      data: {
        type: null,
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
      });
    },
    created() {
      if (this.$slots.expand) this.$parent.hasExpandableData = true;
    },
    methods: {
      handleCheckbox() {
        this.$parent.handleCheckbox(this.data);
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
      clicktd() {
        if (this.$parent.multiple || !this.$slots.expand) return;
        this.expanded = !this.expanded;
      },
      collapseExpandedData() {
        if (this.expanded) {
          this.expanded = false;
        }
      },
    },
  };
</script>
