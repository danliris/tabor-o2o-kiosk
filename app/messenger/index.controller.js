'use strict';

angular.module('app.messenger')
    .controller('MessengerController', MessengerController);

MessengerController.$inject = ['ChatMessage'];

function MessengerController(ChatMessage) {
    var vm = this;
    vm.user = `Guest ${Math.round(Math.random() * 100)}`;
    // we add chatMessages array to the scope to be used in our ng-repeat
    vm.messages = ChatMessage;


    // a method to create new messages; called by ng-submit
    vm.addMessage = function () {
        // calling $add on a synchronized array is like Array.push(),
        // except that it saves the changes to our database!
        vm.messages.$add({
            from: vm.user,
            content: vm.message
        });

        // reset the message input
        vm.message = "";
    };

    // if the messages are empty, add something for fun!
    vm.messages.$loaded(function () {
        if (vm.messages.length === 0) {
            vm.messages.$add({
                from: "Firebase Docs",
                content: "Hello world!"
            });
        }
    });
}