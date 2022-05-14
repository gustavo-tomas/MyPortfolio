<template>
  <div id="campfire">
    <Campfire />
  </div>
  <div id="home">
    <div id="welcome-section">
      <p id="title">Welcome</p>
      <p id="subtitle">to my porfolio!</p>
      <p id="description">My name is Gustavo. Here are some of my projects!</p>
    </div>
  </div>
</template>

<script>
import Campfire from "../components/Campfire.vue";

export default {
  name: "Home",
  components: {
    Campfire,
  }
};
</script>

<style scoped>
#home {
  pointer-events: none; /* disable events */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  height: 100vh;
  width: 100vw;
}

#welcome-section {
  position: fixed;
  bottom: 0;
  width: 100vw;
}

#title {
  font-size: 8.0vw;
}

#subtitle {
  font-size: 3.0vw;
}

#description {
  font-size: 2.0vw;
  padding: 1vw;
}
</style>
