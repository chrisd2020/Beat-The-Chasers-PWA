<script>
  export default {
  data() {
    return {
      message: 'Hello Vue!'
    };
  },

  methods: {
    onClick(clicker) {
      console.log(clicker);
    }
  }
};

</script>

<template>
  <div class="container">
    <img class="logo" src="./assets/beat_the_chasers.jpg" />
    <button @click="onClick('player')">
      Player
    </button>
    <button @click="onClick('chaser')">
      Chaser
    </button>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

button {
  width: 200px;
  height: 50px;
  display: block;
}

.container {
  height: auto;
  width: 100%;
}

h1 {
  margin: 0;
}

.logo {
  width: 100%;
  height: auto;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
