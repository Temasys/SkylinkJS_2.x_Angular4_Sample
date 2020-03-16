
let SkylinkWrapper = {
    skylink: undefined,
    skylinkEventManager: undefined,
    skylinkConstants: undefined,
    leaveRoomName: undefined,

    /**
     * Initializes the SkylinkWrapper. Internally, it executes
     * a command of queries to initialize the Skylink events.
     *
     * @param options Attributes to initialize Skylink framework.
     */
    init: function(options) {
        this.initWindowConfigs(options);
        this.instantiateSkylinkFramework();
        this.start(options);
        this.onIncomingStream();
    },

    /**
     * It adds the options to the window. This is needed
     * by the Skylink framework.
     *
     * @params options Options to initialize Skylink framework.
     */
    initWindowConfigs: (options) => {
        window.config = {
            appKey: options.appKey || "",
            defaultRoom: options.defaultRoom || "default_room",
            enableDataChannel: options.enableDataChannel || true,
            enableIceTrickle: options.enableDataChannel || true,
            audioFallback: options.audioFallback || true,
            forceSSL: options.forceSSL || true,
            audio: options.audio || true,
            video: options.video || true,
            localVideoEl: options.localVideoEl || "localVideoEl",
            remoteContainerEl: options.remoteContainerEl || "remoteContainerEl"
        };
    },

    instantiateSkylinkFramework: () => {
        skylink = new Skylink.default(window.config);
        skylinkEventManager = Skylink.SkylinkEventManager;
        skylinkConstants = Skylink.SkylinkConstants;
    },

    start: function (options) {
        skylink.joinRoom({
            audio: options.audio,
            video: options.video,
            roomName: options.defaultRoom
          })
    },

    startRecording: function(roomName) {
        skylink.startRecording(roomName).then(() => {
            console.log("Recording started")
        })
    },

    stopRecording: function(roomName) {
        skylink.stopRecording(roomName).then(() => {
            console.log("Recording stopped")
        });
    },

    leaveRoom: function(location) {
        this.leaveRoomName = location;
        skylink.leaveRoom(location).then(() => {
            console.log("LEAVEROOM")
        })
    },

    leaveAllRoom: function() {
        skylink.leaveAllRooms().then(() => {
            console.log("LEAVE ALL ROOM")
        })
    },

    sendMessageP2P: function(room, message) {
        const elem = document.getElementById("messageContent");
        const msg = document.createElement('p');
        msg.setAttribute("style", "display: block; font-size: 14px; text-align: left; padding: 0 10px;");
        msg.innerHTML = "<span style='color: #2ba9a1; font-size: 1rem'>(Self ) </span>" + message;
        elem.appendChild(msg);
        skylink.sendP2PMessage(room, message, null);
    },

    onIncomingStream: function() {
        skylinkEventManager.addEventListener(skylinkConstants.EVENTS.ON_INCOMING_STREAM, evt => {

            const { stream, isSelf, peerId, room, isReplace, streamId, isVideo, isAudio } = evt.detail;
            if(isSelf) {
                const localVideoElem = document.getElementById("localVideoEl");
                const videoElem = document.createElement('video');
                console.log("IS SELF")
                videoElem.setAttribute('muted', true);
                videoElem.setAttribute('id', peerId);
                videoElem.className = 'peer-video ';
                videoElem.className += peerId;
                videoElem.className += ' ' +room.roomName;
                videoElem.setAttribute("playsinline", true);
                videoElem.setAttribute("autoplay", true);
                videoElem.setAttribute('style', "height: 150px; width: 150px");
                if(!isAudio) {
                    videoElem.setAttribute('muted', true);
                    localVideoElem.appendChild(videoElem);
                    window.attachMediaStream(videoElem, stream);
                }
            } if(!isSelf) {
                const remoteVideoElem = document.getElementById("remoteVideoEl");
                const videoElem = document.createElement('video');
                console.log("IS REMOTE")
                videoElem.setAttribute('muted', false);
                videoElem.setAttribute('id', peerId);
                videoElem.className = 'peer-video ';
                videoElem.className += peerId;
                videoElem.className += ' ' +room.roomName;
                videoElem.setAttribute("playsinline", true);
                videoElem.setAttribute("autoplay", true);
                videoElem.setAttribute('style', "height: 150px; width: 150px");
                if(isAudio) {
                    videoElem.setAttribute('muted', false);
                    videoElem.setAttribute('style', "display: none");
                }
                remoteVideoElem.appendChild(videoElem);
                window.attachMediaStream(videoElem, stream);
            }
          });

          skylinkEventManager.addEventListener(skylinkConstants.EVENTS.PEER_LEFT, evt => {
              console.log("PEERLEFT", evt.detail)
            if(this.leaveRoomName !== undefined) {
                let peerInfo = evt.detail.peerInfo;
                let elem = document.getElementsByClassName(peerInfo.room);
                if(elem.length > 1) {
                    for(let i = 0 ; i < elem.length; i++) {
                        elem[i].parentNode.removeChild(elem[i]);
                    }
                } else {
                    elem[0].parentNode.removeChild(elem[0]);
                }
                this.leaveRoomName = undefined;
                return;
            }

            Array.from(document.getElementsByClassName(evt.detail.peerId)).forEach(function(item) {
                item.parentNode.removeChild(item)
                });

          });

          skylinkEventManager.addEventListener(skylinkConstants.EVENTS.ON_INCOMING_MESSAGE, function(e) {
            const {message, peerId, isSelf} = e.detail;
            if(!isSelf) {
                const elem = document.getElementById("messageContent");
                const msg = document.createElement('p');
                msg.setAttribute("style", "display: block; font-size: 14px; text-align: right; padding: 0 10px;");
                msg.innerHTML = "<span style='color: #ec2526; font-size: 1rem'>(Remote ) </span>" + message.content;
                elem.appendChild(msg);
            }

          });
    }
}

