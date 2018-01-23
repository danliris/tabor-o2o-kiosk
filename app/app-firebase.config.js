angular
    .module('app')
    .config(() => {
        firebase.initializeApp({
            apiKey: "AIzaSyD1NNv6unTGmyCb8ESkoA_Z3Qxh1qZIaTA",
            authDomain: "o2o-dev.firebaseapp.com",
            databaseURL: "https://o2o-dev.firebaseio.com",
            projectId: "o2o-dev",
            storageBucket: "o2o-dev.appspot.com",
            messagingSenderId: "174807202396"
        });
    });