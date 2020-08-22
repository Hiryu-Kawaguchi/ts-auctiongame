<template>
  <div class="home">
    <p>Waiting......</p>
    <p>JoinMenber:</p>
    <button v-on:click="onclick()">submit</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Waiting",
  data() {
    return {
    };
  },
  created() {
    console.log("GettingData");
  },
  methods: {
    onclick() {
      alert("a");
    }
  }
});
</script>