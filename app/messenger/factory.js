angular.module('app')
    .factory('MessageChannels', MessageChannels);

MessageChannels.$inject = [
    '$firebaseArray',
    '$timeout'
];
function MessageChannels($firebaseArray, $timout) {
    var IDGenerator = new IDGenerator();
    this.rooms = [];

    return {
        init: init,
        add: add,
        // addTemp: addTemp,
        close: close,

        fetchMessages: fetchMessages,
        addMessage: addMessage
    };

    function init(userId) {
        this.rooms = arrayRef(`users/${userId}`);
    }

    function add(roomId, userId, username) {
        // kalo udah ada, buka aja
        var existingRoom = this.rooms.find(t => t.userId == userId);
        if (existingRoom) {
            existingRoom.show = true;
            existingRoom.open = true;

            this.fetchMessages(existingRoom);

            toggleShowUserRoom(this.rooms.$ref().key, existingRoom.$id, true);

            // promptTargetToChat(existingRoom.roomId, this.rooms.$ref().key, userId, username);

            return;
        }

        this.rooms.$add({
            roomId: roomId,
            userId: userId,
            username: username,
            timestamp: (new Date()).getTime(),
            show: true,
            // open: false,
        });

    }

    function close(room) {
        toggleShowUserRoom(this.rooms.$ref().key, room.$id, false);
    }

    function toggleShowUserRoom(userId, roomKey, val) {
        return firebase.database()
            .ref(`users/${userId}/${roomKey}`)
            .update({ show: val });
    }

    function fetchMessages(room) {
        if (!room.messages) {
            room.messages = arrayRef(`rooms/${room.roomId}`);
        }
    }

    function addMessage(room, userId, username, content) {
        promptTargetToChat(room.roomId, room.userId, userId, username);

        room.messages.$add({
            userId: userId,
            username: username,
            content: content,
            timestamp: (new Date()).getTime()
        });


    }

    function promptTargetToChat(roomId, targetUserId, userId, username) {
        var targetRooms = arrayRef(`users/${targetUserId}`);

        targetRooms.$loaded(() => {
            var room = targetRooms.find(t => t.roomId == roomId);
            // console.log(room, userId);
            if (!room) {
                targetRooms.$add({
                    roomId: roomId,
                    userId: userId,
                    username: username,
                    timestamp: (new Date()).getTime(),
                    show: true,
                    // open: false
                });
            }
            else {
                toggleShowUserRoom(targetUserId, room.$id, true);
            }
        });


    }

    function arrayRef(identifier) {
        return $firebaseArray(ref(identifier));
    }

    function ref(identifier) {
        return firebase.database().ref(identifier);
    }

    function IDGenerator() {
        this.timestamp = +new Date;

        var _getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        this.generate = function (length = 8) {
            var ts = this.timestamp.toString();
            var parts = ts.split("").reverse();
            var id = "";

            for (var i = 0; i < length; ++i) {
                var index = _getRandomInt(0, parts.length - 1);
                id += parts[index];
            }

            return id;
        }
    }

}