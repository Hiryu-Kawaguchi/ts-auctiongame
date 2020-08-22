<template>
  <div class="home">
    <p>palet</p>
      <input v-model="name" name="name" label="name">
      <input v-model="gameId" name="gameId" label="gameId">
      <button v-on:click="onclick()">submit</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Palet",
  data() {
    return {
      name: "hoge",
      gameId: "gameid"
    };
  },
  methods: {
    onclick() {
      alert("a");
    }
  }
});
</script>