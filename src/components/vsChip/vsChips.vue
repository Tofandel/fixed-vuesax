<template lang="html">
  <div>
    <div
      :class="{'no-items':value.length === 0}"
      class="con-chips">
      <slot>
      </slot>

      <input
        v-model="newChip"
        :placeholder="value.length > 0 ? null : placeholder"
        class="con-chips--input"
        type="text"
        @keypress.enter="addItem">
      <div
        class="x-global con-chips--remove-all"
        @click="removeTotalItems">
        <vs-icon
          :icon="removeIcon"
          :icon-pack="iconPack"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VsChips',
    props: {
      value: Array,
      vsColor: {
        type: String,
        default: 'primary',
      },
      placeholder: {
        type: String,
        default: '',
      },
      items: {
        type: Array,
      },
      iconPack: {
        type: String,
        default: 'material-icons',
      },
      removeIcon: {
        type: String,
        default: 'close',
      },
    },
    data: () => ({
      newChip: '',
      chip1: true,
    }),
    methods: {
      addItem() {
        const valueOld = this.value;
        valueOld.push(this.newChip);
        this.$emit('input', valueOld);
        this.newChip = '';
      },
      removeTotalItems() {
        const valueOld = this.value;
        valueOld.splice(0, this.value.length);
        this.$emit('input', valueOld);
      },
    },
  };
</script>
