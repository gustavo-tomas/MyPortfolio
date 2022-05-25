<template>
<div id="card">
  <div id="title">
    {{ projectName }}
  </div>
  <div id="content">
    <!-- :src="require(`public/assets/images/${projectPicture}`)" -->
    <img
      id="picture"
      src="public/assets/images/github_logo.png"
      alt="project-picture"
    />
    <div id="description">
      {{ projectDescription }}
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "Project",
  props: {
    projectName: String,
    projectDescription: String,
    projectPicture: String,
  }
}
</script>

<style scoped>
#card {
  background-color: black;
  width: 50vw;
  height: 40vh;
  border-radius: 10px;
  padding: 20px;
}

#title {
  font-size: 2rem;
}

#content {
  display: flex;
  align-items: flex-end;
}

#picture {
  width: 30vh;
  height: 30vh;
  border-radius: 10px;
}

#description {
  width: 50%;
  height: 50%;
  margin: auto auto auto 20px;
  text-align: left;
}

</style>