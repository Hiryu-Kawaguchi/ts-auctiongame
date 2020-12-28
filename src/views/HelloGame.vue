<template>
  <div class="home">
      <input v-model="name" placeholder="yourname..." name="name" label="name">
      <input :disabled="!isJoin" v-model="gameId" placeholder="join gameid" name="gameId" label="gameId">
      <b-switch v-model="isJoin">
        JoinGame
      </b-switch>
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
      name: "",
      gameId: "",
      isJoin: false
    };
  },
  async created() {
    const db = await GameService.connectDB();
    this.$store.commit('setDB',db);
  },
  methods: {
    alert(title:string) {
      this.$buefy.dialog.alert(title);
    },
    async onclick() {
      if(!this.name){
        this.alert("Fill Out name");
        return;
      }
      this.$store.commit('setName', this.name);
      const db = this.$store.getters.db;
      if(this.isJoin){
        if(!this.gameId){
          this.alert("Fill Out gameID");
          return;
        }
        const gameDoc = await db.collection("game").doc(this.gameId).get();
        if(!gameDoc.exists){
          this.alert("not exists game");
          return;
        }
        const newUser = {
          id: GameService.generateUuid(),
          name: this.name,
          hasCards: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        };
        const players = gameDoc.data().players;
        players.push(newUser);
        await db.collection("game").doc(this.gameId).update({players});
        this.$store.commit('setId', gameDoc.id);
      }else{
        try {
          const res = await db.collection("game").add({
            scoreCards: [1,2,3,4,5,6,7,8,9,10,-1,-2,-3,-4,-5],
            status: "0",
            round: 0,
            players: [{
              id: GameService.generateUuid(),
              name: this.name,
              hasCards: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
            }]
          });
          this.$store.commit('setId', res.id);
        } catch (err){
          console.log("err",err);
        }
      }
      this.$router.push("waiting");
    }
  }
});
</script>