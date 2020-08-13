<template>
  <th
    colspan="1"
    rowspan="1"
    @click="sortValue">
    <div class="vs-table-text">
      <slot></slot>
      <span
        v-if="isColumnSelectedForSort && currentSort"
        class="sort-th">
        <vs-icon
          :icon="sortIcon"
          class="th-sort-icon"/>
      </span>
    </div>
  </th>
</template>
<script>
  export default {
    name: 'VsTh',
    props: {
      sortKey: {
        default: null,
        type: String,
      },
    },
    data: () => ({
      thIndex: 0,
      currentSort: 0,
      sortStatuses: [
        null,
        'desc',
        'asc',
      ],
    }),
    computed: {
      isColumnSelectedForSort() {
        if (!this.sortKey) {
          return false;
        }
        if (this.$parent.currentSortKey !== this.sortKey) {
          this.resetSort();
        }
        return this.$parent.currentSortKey === this.sortKey;
      },
      sortIcon() {
        switch (this.sortStatuses[this.currentSort]) {
          case 'asc':
            return 'expand_less';
          case 'desc':
            return 'expand_more';
        }
        return '';
      },
    },
    methods: {
      sortValue() {
        this.currentSort = (this.currentSort + 1) % 3;
        this.$parent.sort(this.sortKey, this.sortStatuses[this.currentSort]);
      },
      resetSort() {
        this.currentSort = 0;
      },
    },
  };
</script>
