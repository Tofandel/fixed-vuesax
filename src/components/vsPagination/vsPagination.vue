<template>
  <vs-row
    :vs-justify="description ? 'space-between' : 'center'"
    vs-type="flex"
    vs-w="12">
    <vs-col
      v-if="description"
      class="vs-pagination--mb"
      vs-type="flex"
      vs-justify="flex-start"
      vs-align="center"
      vs-lg="6"
      vs-sm="12"
      vs-xs="12">
      <div>
        <span
          style="margin-right:5px"> {{descriptionTitle}}: {{minRows}} - {{maxRows}} {{descriptionConnector}}
          {{sizeArray}} | {{descriptionBody}}:

        </span>
        <ul class="vs-pagination--array">
          <li
            v-for="(row,index) in descriptionItems"
            :key="index">
            <span
              :style="styleDescription"
              :class="[`vs-description-${color}`,{ 'vs-pagination--bold': (index===indexRows)}]"
              @click="changeRowMaxItems(index)">{{row}}</span><span v-if="index !== (descriptionItems.length - 1)">
                , </span>
          </li>
        </ul>
      </div>
    </vs-col>
    <vs-col
      class="vs-pagination--mb"
      vs-type="flex"
      vs-justify="flex-end"
      vs-align="center"
      vs-lg="6"
      vs-sm="12"
      vs-xs="12">
      <div
        :style="stylePagination"
        :class="[`vs-pagination-${color}`]"
        class="con-vs-pagination">
        <nav class="vs-pagination--nav">
          <button
            :class="{disabled:current <= 1 ? 'disabled' : null}"
            :disabled="current === 1"
            class="vs-pagination--buttons btn-prev-pagination vs-pagination--button-prev"
            @click="prevPage">
            <vs-icon
              :icon-pack="iconPack"
              :icon="prevIcon ? prevIcon : defaultPrevIcon"/>
          </button>
          <ul class="vs-pagination--ul">
            <li
              v-for="(page, index) in pages"
              :key="index"
              :class="{'is-current': page === current}"
              class="item-pagination vs-pagination--li"
              @click="goTo(page)">
              <span> {{page}} </span>

              <div class="effect"></div>
            </li>
          </ul>
          <!-- :style="styleBtn" -->
          <button
            :class="{disabled:current === total ? 'disabled' : null}"
            :disabled="current === total"
            class="vs-pagination--buttons btn-next-pagination vs-pagination--button-next"
            @click="nextPage">
            <vs-icon
              :icon-pack="iconPack"
              :icon="nextIcon ? nextIcon : defaultNextIcon"/>
          </button>
          <input
            v-if="goto"
            v-model="go"
            :max="total"
            class="vs-pagination--input-goto"
            min="1"
            type="number"
            @change="goTo">
        </nav>
      </div>
    </vs-col>
  </vs-row>
</template>
<script>
  import _color from '../../utils/color.js';

  export default {
    name: 'VsPagination',
    props: {
      color: {
        type: String,
        default: 'primary',
      },
      total: {
        type: Number,
        required: true,
      },
      sizeArray: {
        type: Number,
        required: false,
      },
      maxItems: {
        type: [Number, String],
        required: false,
      },
      value: {
        type: Number,
        required: true,
        default: 1,
      },
      max: {
        type: Number,
        default: 9,
      },
      goto: {
        type: Boolean,
      },
      type: {
        type: String,
      },
      prevIcon: {
        type: String,
      },
      nextIcon: {
        type: String,
      },
      iconPack: {
        type: String,
        default: 'material-icons',
      },
      description: Boolean,
      descriptionItems: {
        default: () => [],
        type: Array,
      },
      descriptionTitle: {
        type: String,
        default: 'Registries',
      },
      descriptionConnector: {
        type: String,
        default: 'of',
      },
      descriptionBody: {
        type: String,
        default: 'Pages',
      },
    },
    data() {
      return {
        current: this.value,
        go: this.value,
        indexRows: this.descriptionItems.indexOf(this.maxItems),
      };
    },
    computed: {
      maxRows() {
        return ((this.current * this.maxItems) <= this.sizeArray) ? this.current * this.maxItems : this.sizeArray;
      },
      minRows() {
        return ((this.current * this.maxItems) <= this.sizeArray) ? (this.maxRows - this.maxItems) + 1
          : ((this.current - 1) * this.maxItems) + 1;
      },
      defaultNextIcon() {
        if (this.$vs.rtl) return 'chevron_left';
        return 'chevron_right';
      },
      defaultPrevIcon() {
        if (this.$vs.rtl) return 'chevron_right';
        return 'chevron_left';
      },
      stylePagination() {
        let style = {};
        if (!_color.isColor(this.color)) {
          style = {
            '--vs-color-pagination': _color.getColor(this.color),
            '--vs-color-pagination-alpha': _color.getColor(this.color, 0.5),
          };
        }
        return style;
      },
      styleDescription() {
        return {
          cursor: 'pointer',
        };
      },
      pages() {
        if (this.total <= Math.max(5, this.max)) {
          return this.setPages(1, this.total);
        }

        if (this.current >= 3 && this.current <= this.total - 3) {
          const incr = Math.floor((this.max - 4) / 2);

          return [1, '...', ...this.setPages(this.current - incr, this.current + incr), '...', this.total];
        } else if (this.current < 3) {
          return [
            ...this.setPages(1, this.max - 2),
            '...',
            this.total,
          ];
        } else {
          return [
            1,
            '...',
            ...this.setPages(this.total - this.max - 2, this.total),
          ];
        }
      },
    },
    watch: {
      current(val) {
        if (val !== this.value) {
          this.$emit('input', val);
          this.$emit('change', val);
        }
      },
      value(val) {
        const pageNum = val < 1 ? 1 : (val <= this.total ? val : this.total);
        this.goTo(pageNum);
      },
    },
    methods: {
      changeRowMaxItems(index) {
        this.indexRows = index;
        this.$emit('changeMaxItems', index);
        this.current = 1;
      },
      isEllipsis(page) {
        return page === '...';
      },
      goTo(page) {
        if (this.isEllipsis(page)) {
          return;
        }
        if (typeof page.target === 'undefined') {
          this.current = page;
        } else {
          const value = parseInt(page.target.value, 10);
          this.go = Math.min(this.total, Math.max(1, value));
          this.current = this.go;
        }
      },
      setPages(start, end) {
        const setPages = [];

        for (; start <= end; start++) {
          setPages.push(start);
        }

        return setPages;
      },
      nextPage() {
        if (this.current < this.total) {
          this.current++;
        }
      },
      prevPage() {
        if (this.current > 1) {
          this.current--;
        }
      },
    },
  };
</script>
