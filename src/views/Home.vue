<template>
<h1>Welcome!</h1>
<Canvas />
</template>

<script>
import Canvas from "../components/Canvas.vue";

export default {
  name: "Home",
  components: {
      Canvas,
  },
};
</script>