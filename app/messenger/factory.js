angular.module('app.messenger').factory('ChatMessage', ChatMessage);
ChatMessage.$inject = [
    '$firebaseArray'
];

function ChatMessage($firebaseArray) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref();

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
}