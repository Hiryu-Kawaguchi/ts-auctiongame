import firebase from "firebase";

export default class GameService {
  
  static async connectDB (){
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
    return firebase.firestore();
  }

  static async anonymousAuth (){
    firebase.auth().signInAnonymously()
      .then(() => {
        // Signed in..
        console.log("SUCCESS AUTHENTICATION");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("FAILED AUTHENTICATION", errorCode, errorMessage);
        // ...
      });
  }

  static generateUuid (){
    const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
      switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
      }
    }
    return chars.join("");
  }

  static shuffle ([...array]) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}