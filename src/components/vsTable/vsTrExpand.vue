<template>
  <transition name="tr-expand">
    <tr
      class="tr-expand">
      <td :colspan="colspan">
        <div v-if="active" class="content-tr-expand">
          <slot></slot>

          <vs-button
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
