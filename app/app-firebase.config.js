angular
    .module('app')
    .config(() => {
        // // DEV
        /*
        firebase.initializeApp({
            apiKey: "AIzaSyD1NNv6unTGmyCb8ESkoA_Z3Qxh1qZIaTA",
            authDomain: "o2o-dev.firebaseapp.com",
            databaseURL: "https://o2o-dev.firebaseio.com",
            projectId: "o2o-dev",
            storageBucket: "o2o-dev.appspot.com",
            messagingSenderId: "174807202396"
        });*/

        // PRD
        firebase.initializeApp({
            apiKey: "AIzaSyAocf61QRJ5oa8rWSoc5SyaIsVaEi5eW_0",
            authDomain: "o2o-7cb1f.firebaseapp.com",
            databaseURL: "https://o2o-7cb1f.firebaseio.com",
            projectId: "o2o-7cb1f",
            storageBucket: "o2o-7cb1f.appspot.com",
            messagingSenderId: "920639585652"
        });
    });
