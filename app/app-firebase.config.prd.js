angular
    .module('app')
    .config(() => {
        firebase.initializeApp({
            apiKey: "AIzaSyAocf61QRJ5oa8rWSoc5SyaIsVaEi5eW_0",
            authDomain: "o2o-7cb1f.firebaseapp.com",
            databaseURL: "https://o2o-7cb1f.firebaseio.com",
            projectId: "o2o-7cb1f",
            storageBucket: "o2o-7cb1f.appspot.com",
            messagingSenderId: "920639585652"
        });
    });