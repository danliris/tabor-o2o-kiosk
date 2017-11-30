'use strict';

angular.module('app')
    .controller('MessengerController', MessengerController);

MessengerController.$inject = ['MessageChannels', 'AuthenticationState', '$location', '$anchorScroll', '$timeout', '$rootScope'];

function MessengerController(MessageChannels, AuthenticationState, $location, $anchorScroll, $timeout, $rootScope) {
    var vm = this;
    vm.currentDate = new Date();

    vm.currentUser = AuthenticationState.getUser();

    MessageChannels.init(vm.currentUser.id);

    vm.rooms = MessageChannels.rooms;

    vm.rooms.$loaded(() => {
        $rootScope.$settings.firebaseReady = true;
        // vm.rooms.forEach(room => {
        //     fetchMessages(room);
        // });
    });

    vm.sendMessage = sendMessage;
    function sendMessage(room) {
        if (!room.inputMessage) return;

        MessageChannels.addMessage(room, vm.currentUser.id, vm.currentUser.username, room.inputMessage);
        room.inputMessage = '';

        scrollBottom(room.$id);
    }

    vm.toggleOpenRoom = toggleOpenRoom;
    function toggleOpenRoom(room) {
        room.open = !room.open;

        if (room.open) {
            MessageChannels.fetchMessages(room);

        }
    }

    vm.removeRoom = removeRoom;
    function removeRoom(room) {
        MessageChannels.close(room);
    }

    function scrollBottom(id, time = 100) {
        $timeout(() => {
            $location.hash(`anchor_${id}`);

            $anchorScroll();

        }, time);
    }
}