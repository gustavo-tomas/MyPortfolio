<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Courgette&display=swap');

* {
  margin: 0px;
  padding: 0px;
}

html {
  scroll-behavior: smooth;
}

:root {
  --color-primary-dark: #261C2C;
  --color-primary-purple: #3E2C41;
  --color-primary-anil: #5C527F;
  --color-primary-blue: #6E85B2;

  --color-primary-font: #C2CDE4;
}

#app {
  font-family: 'Courgette', cursive;
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-primary-font);
}
</style>
