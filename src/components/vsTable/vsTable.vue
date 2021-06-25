<template>
  <div
    :class="[{'stripe': stripe, 'hoverFlat': hoverFlat}, `vs-table-${color}`]"
    class="vs-component vs-con-table">
    <!-- header -->
    <header class="header-table vs-table--header">
      <slot name="header"></slot>
      <div
        v-if="search"
        class="con-input-search vs-table--search">
        <input
          v-model="searchx"
          class="input-search vs-table--search-input"
          type="text">
        <vs-icon icon="search"/>
      </div>
      <div
        v-if="topPagination"
        class="con-pagination-table vs-table--pagination">
        <slot v-bind="{...paginationBind, ...paginationOn}" name="pagination">
          <vs-pagination
            v-model="currentx"
            v-bind="paginationBind"
            v-on="paginationOn"/>
        </slot>
      </div>
    </header>
    <div class="con-tablex vs-table--content">
      <div
        :style="styleConTbody"
        class="vs-con-tbody vs-table--tbody ">
        <table
          ref="table"
          class="vs-table vs-table--tbody-table">
          <thead
            ref="thead"
            class="vs-table--thead">
            <tr>
              <th
                v-if="hasExpandableData"
                class="td-expand">
              </th>
              <th
                v-if="multiple"
                class="td-check">
                <span
                  class="con-td-check">
                  <vs-checkbox
                    :icon="isCheckedLine ? 'remove' : 'check'"
                    :value="isCheckedMultiple"
                    size="small"
                    @input="changeCheckedMultiple"/>
                </span>
              </th>
              <slot name="thead"></slot>
            </tr>
          </thead>
          <slot :data="paginatedResults"></slot>
        </table>
      </div>
      <div
        v-if="isNoData"
        class="not-data-table vs-table--not-data">
        {{noDataText}}
      </div>

      <div
        v-if="pagination"
        class="con-pagination-table vs-table--pagination">
        <slot v-bind="{...paginationBind, ...paginationOn}" name="pagination">
          <vs-pagination
            v-model="currentx"
            v-bind="paginationBind"
            v-on="paginationOn"/>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  import ProviderParentMixin from '../../utils/ProviderParentMixin';

  export default {
    name: 'VsTable',
    mixins: [ProviderParentMixin('vsTable')],
    props: {
      value: null,
      color: {
        default: 'primary',
        type: String,
      },
      noDataText: {
        default: 'No data Available',
        type: String,
      },
      stripe: Boolean,
      hoverFlat: Boolean,
      maxHeight: {
        default: 'auto',
        type: String,
      },
      multiple: Boolean,
      data: {
        type: Array,
        default: null,
      },
      search: Boolean,
      maxItems: {
        default: 5,
        type: [Number, String],
      },
      pagination: Boolean,
      topPagination: Boolean,
      paginationMax: Number,
      description: Boolean,
      descriptionItems: {
        default: () => [],
        type: Array,
      },
      currentPage: {
        default: 1,
        type: [Number, String],
      },
      sst: Boolean,
      total: {
        type: Number,
        default: 0,
      },
      onlyClickCheckbox: {
        type: Boolean,
        default: false,
      },
      allSelected: Boolean,
    },
    data() {
      return {
        searchKeys: [],
        headerWidth: '100%',
        searchx: null,
        currentx: 1,
        maxItemsx: this.maxItems,
        hasExpandableData: false,
        currentSortKey: null,
        currentSortType: null,
      };
    },
    computed: {
      paginationBind() {
        return {
          description: this.description,
          descriptionItems: this.descriptionItems,
          maxItems: this.maxItemsx,
          sizeArray: this.items.length,
          total: this.totalPages,
          value: this.currentx,
          max: this.paginationMax,
        };
      },
      paginationOn() {
        return {
          changeMaxItems: this.changeMaxItems,
        };
      },
      colspan() {
        return this.$refs.thead.querySelectorAll('th').length;
      },
      totalPages() {
        return Math.ceil((this.sst && this.total ? this.total : this.queriedResults.length) / this.maxItems);
      },
      queriedResults() {
        if (this.sst) {
          return this.data;
        }
        if (this.searchx) {
          return this.items.filter((tr) => {
            return this.normalize(this.getValues(tr, this.searchKeys).toString()).indexOf(this.searchString) >= 0;
          });
        } else {
          return this.items;
        }
      },
      paginatedResults() {
        if (!this.sst && (this.pagination || this.topPagination)) {
          return this.queriedResults.slice(this.min, this.max);
        } else {
          return this.queriedResults;
        }
      },
      isNoData() {
        return this.items.length === 0;
      },
      isCheckedLine() {
        return !this.data || !this.value || this.data.length !== this.value.length;
      },
      isCheckedMultiple() {
        return this.value.length > 0;
      },
      styleConTbody() {
        return {
          maxHeight: this.maxHeight,
          overflow: this.maxHeight !== 'auto' ? 'auto' : null,
        };
      },
      items() {
        if (this.currentSortType === null) {
          return this.data;
        } else {
          return this.data.slice().sort(this.compare);
        }
      },
      max() {
        return Math.ceil(this.currentx * this.maxItemsx);
      },
      min() {
        return this.max - this.maxItemsx;
      },
      searchString() {
        return this.normalize(this.searchx);
      },
    },
    watch: {
      allSelected(v) {
        if (this.value.length !== this.data.length) {
          this.changeCheckedMultiple(v);
        }
      },
      isCheckedLine(v) {
        this.$emit('update:allSelected', !v);
      },
      currentPage() {
        this.currentx = this.currentPage;
      },
      currentx() {
        this.$emit('change-page', this.currentx);
      },
      maxItems(val) {
        this.maxItemsx = val;
      },
      data(data) {
        if (data.length > 0) {
          this.$nextTick(() => {
            this.changeTdsWidth();
          });
        }
      },
      searchx() {
        this.$emit('search', this.searchx);
        if (!this.sst) {
          this.currentx = 1;
        }
      },
    },
    mounted() {
      window.addEventListener('resize', this.listenerChangeWidth);
    },
    destroyed() {
      window.removeEventListener('resize', this.listenerChangeWidth);
    },
    methods: {
      getItems(min, max) {
        const dataBase = this.sortItems(this.data);

        const items = [];
        dataBase.forEach((item, index) => {
          if (index >= min && index < max) {
            items.push(item);
          }
        });
        return items;
      },
      retrieve(obj, name) {
        return name ? (name.indexOf('.') > 0 ? name.split('.').reduce(this.get, obj) : this.get(obj, name)) : null;
      },
      get(obj, i) {
        return typeof obj === 'object' && obj !== null ? obj[i] : null;
      },
      compare(a, b) {
        const v1 = this.retrieve(a, this.currentSortKey);
        const v2 = this.retrieve(b, this.currentSortKey);
        if (v1 < v2) {
          return this.currentSortType === 'desc' ? 1 : -1;
        }
        if (v1 > v2) {
          return this.currentSortType === 'desc' ? -1 : 1;
        }
        return 0;
      },
      sort(key, sortType) {
        this.currentSortKey = key;
        this.currentSortType = sortType;
        this.$emit('sort', key, sortType);
      },
      normalize(string) {
        return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      },
      getValues(obj, keys) {
        // TODO only keep keys
        function flattenDeep(val) {
          return Object.values(val || []).reduce((acc, val) => (typeof val === 'object') ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
        }

        return flattenDeep(obj).filter(function (item) {
          return (typeof item === 'string') || (typeof item === 'number');
        });
      },
      changeCheckedMultiple(v) {
        if (v) {
          this.$emit('input', this.data.slice(), this.isCheckedLine);
        } else {
          this.$emit('input', [], this.isCheckedLine);
        }
      },
      setSelected(val, sel) {
        this.$emit('input', val);
        this.$emit('selected', sel);
      },
      clicktr(tr, isTr) {
        if (isTr) {
          if (this.multiple) {
            if (!this.onlyClickCheckbox) {
              const val = this.value.slice();
              const found = this.value.indexOf(tr);
              if (found >= 0) {
                val.splice(found, 1);
              } else {
                val.push(tr);
              }
              this.$emit('input', val);
              this.$emit('selected', tr);
            }
          } else {
            this.$emit('input', tr);
            this.$emit('selected', tr);
          }
        }
      },
      dblclicktr(tr, isTr) {
        if (isTr) {
          this.$emit('dblSelection', tr);
        }
      },
      listenerChangeWidth() {
        this.headerWidth = `${this.$refs.table.offsetWidth}px`;
        this.changeTdsWidth();
      },
      changeTdsWidth() {
        if (!this.value) return;

        const tbody = this.$refs.table.querySelector('tbody');

        // Adding condition removes querySelector none error - if tbody is not present
        if (tbody) {
          const trvs = tbody.querySelector('.tr-values');
          if (trvs === undefined || trvs === null) return;
          const tds = trvs.querySelectorAll('.td');

          const tdsx = [];

          tds.forEach((td, index) => {
            tdsx.push({ index: index, widthx: td.offsetWidth });
          });

          const colgrouptable = this.$refs.colgrouptable;
          if (colgrouptable !== undefined && colgrouptable !== null) {
            const colsTable = colgrouptable.querySelectorAll('.col');
            colsTable.forEach((col, index) => {
              col.setAttribute('width', tdsx[index].widthx);
            });
          }
        }
      },
      changeMaxItems(index) {
        this.maxItemsx = this.descriptionItems[index];
      },
    },
  };
</script>
