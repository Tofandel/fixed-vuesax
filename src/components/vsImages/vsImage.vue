<template>
  <li class="vs-image">
    <div class="con-vs-image">
      <div
        :style="styleImage"
        :v-bind="$attrs"
        class="vs-image--img">
      </div>
    </div>
    <img
      :src="src"
      alt=""
      class="imag-blur">
  </li>
</template>
<script>
  export default {
    name: 'VsImage',
    inheritAttrs: false,
    props: {
      src: {
        default: null,
        type: String,
      },
    },
    computed: {
      styleImage() {
        return {
          backgroundImage: `url(${this.src})`,
        };
      },
    },
  };
</script>
