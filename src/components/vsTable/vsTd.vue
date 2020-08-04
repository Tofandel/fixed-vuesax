<template>
  <td
    ref="td"
    :class="{'td-edit': $slots.edit}"
    class="td vs-table--td">
    <template v-if="!activeEdit">
      <span @click="clicktd">
        <vs-icon
          v-if="$slots.edit"
          class="icon-edit"
          icon="edit"/>
        <slot></slot>
        <span
          v-if="$slots.edit"
          class="empty">{{data ? '' : 'Empty'}}</span></span>
    </template>
    <template v-else>
      <button
        class="tr-expand--save"
        @click="saveEdit">
        <i class="material-icons">done</i>
      </button>
      <slot name="edit"></slot>
      <button
        class="tr-expand--close"
        @click="closeEdit">
        <i class="material-icons">clear</i>
      </button>
    </template>
  </td>
</template>

<script>
  export default {
    name: 'VsTd',
    props: {
      data: {
        type: null,
        default: null,
      },
    },
    data() {
      return {
        activeEdit: false,
      };
    },
    methods: {
      clicktd() {
        if (this.$slots.edit) {
          this.activeEdit = !this.activeEdit;
        }
      },
      closeEdit(evt) {
        if (!evt.target.closest('.tr-expand') && !evt.target.closest('.vs-select--options')) {
          this.activeEdit = false;
        }
      },
      saveEdit() {
        this.activeEdit = false;
      },
    },
  };
</script>
