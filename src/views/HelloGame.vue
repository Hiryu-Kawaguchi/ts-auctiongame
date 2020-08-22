<template>
  <div class="home">
      <input v-model="name" name="name" label="name">
      <input v-model="gameId" name="gameId" label="gameId">
      <button v-on:click="onclick()">submit</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBTjRfyuO0SPuGj4hxD9ZjB_xUTkLaB6wk",
  authDomain: "vue-chat-69814.firebaseapp.com",
  databaseURL: "https://vue-chat-69814.firebaseio.com",
  projectId: "vue-chat-69814",
  storageBucket: "vue-chat-69814.appspot.com",
  messagingSenderId: "560217022470",
  appId: "1:560217022470:web:3ac3dd96b2db4a7c6c6387",
  measurementId: "G-TWT9JQ2277"
};
firebase.initializeApp(firebaseConfig);

// const db = firebase.firestore();

export default Vue.extend({
  name: "HelloGame",
  data() {
    return {
      name: "hoge",
      gameId: "gameid"
    };
  },
  methods: {
    onclick() {
      this.$store.commit('setName', this.name);
      const name = this.$store.getters.name;
      console.log("name",name);
      // db.collection("game").add({
      //   createUserName: this.name,
      // })
      //   .then(function(docRef) {
      //     console.log("Document written with ID: ", docRef.id);
      //   })
      //   .catch(function(error) {
      //     console.error("Error adding document: ", error);
      //   });
    }
  }
});
</script>