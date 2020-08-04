<template>
  <transition name="tr-expand">
    <tr
      class="tr-expand">
      <td :colspan="colspan">
        <div class="content-tr-expand">
          <slot></slot>

          <vs-button
            v-if="close"
            type="border"
            color="success"
            icon="done"
            class="tr-expand--close"
            @click="$emit('close', $event)"/>
        </div>
      </td>
    </tr>
  </transition>
</template>

<script>
  export default {
    name: 'VsTrExpand',
    props: {
      close: {
        type: Boolean,
        default: false,
      },
      colspan: {
        default: 1,
        type: Number,
      },
    },
  };
</script>
