<template>
  <transition name="tr-expand">
    <tr
      v-show="active"
      class="tr-expand">
      <td :colspan="colspan">
        <div v-if="active" class="content-tr-expand">
          <slot></slot>

          <button
            v-if="close"
            class="tr-expand--close"
            @click="$emit('click', $event)">
            <i class="material-icons">
              clear
            </i>
          </button>
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
      active: Boolean,
    },
  };
</script>
