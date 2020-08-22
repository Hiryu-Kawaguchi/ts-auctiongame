<template>
  <div class="home">
      <input v-model="name" name="name" label="name">
      <input v-model="gameId" name="gameId" label="gameId">
      <button v-on:click="onclick()">submit</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameService from "../service/game";
export default Vue.extend({
  name: "HelloGame",
  data() {
    return {
      name: "hoge",
      gameId: "gameid",
    };
  },
  async created() {
    const db = await GameService.connectDB();
    this.$store.commit('setDB',db);
  },
  methods: {
    async onclick() {
      this.$store.commit('setName', this.name);
      const db = this.$store.getters.db;
      try {
        const res = await db.collection("game").add({
          scoreCards: [1,2,3,4,5,6,7,8,9,10,-1,-2,-3,-4,-5],
          status: 0,
          round: 0,
          players: [{
            id: GameService.generateUuid(),
            name: this.name,
            hasCards: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
          }]
        });
        this.$store.commit('setId', res.docRef);
        this.$router.push("waiting");
      } catch (err){
        console.log("err",err);
      }
    }
  }
});
</script>