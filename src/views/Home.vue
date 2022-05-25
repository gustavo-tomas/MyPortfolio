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
  <!-- <Project 
    projectName="DiscordBot"
    projectDescription="A music bot for discord"
    projectPicture="github_logo.png"
  /> -->
</template>

<script>
import Project from "../components/Project.vue";
import Campfire from "../components/Campfire.vue";

export default {
  name: "Home",
  components: {
    Campfire,
    Project,
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
  left: 50%;
  bottom: 30%;
}

#welcome-section {
  position: fixed;
}

#title {
  font-size: 8.0vh;
}

#subtitle {
  font-size: 3.0vh;
}

#description {
  font-size: 2.0vh;
  padding: 1vh;
}
</style>
