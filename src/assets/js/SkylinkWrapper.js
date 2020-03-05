
let SkylinkWrapper = {
    skylink: undefined,
    skylinkEventManager: undefined,
    skylinkConstants: undefined,

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
            video: options.video
          })
    },

    startRecording: function(roomName) {
        skylink.startRecording(roomName);
    },

    stopRecording: function(roomName) {
        skylink.stopRecording(roomName);
    },

    onIncomingStream: function() {
        skylinkEventManager.addEventListener(skylinkConstants.EVENTS.ON_INCOMING_STREAM, evt => {
            
            const { stream, isSelf, peerId, room, isReplace, streamId, isVideo, isAudio } = evt.detail;
            if(isSelf) {
                const localVideoElem = document.getElementById("localVideoEl");
                const videoElem = document.createElement('video');
                
                videoElem.setAttribute('muted', true);
                videoElem.setAttribute('id', peerId);
                videoElem.className = 'peer-video ';
                videoElem.className += peerId;
                videoElem.setAttribute("playsinline", true);
                videoElem.setAttribute("autoplay", true);
                videoElem.setAttribute('style', "height: 250px; width: 300px");
                if(!isAudio) {
                    videoElem.setAttribute('muted', true);
                    localVideoElem.appendChild(videoElem);
                    window.attachMediaStream(videoElem, stream);
                }
            } if(!isSelf) {
                const remoteVideoElem = document.getElementById("remoteVideoEl");
                const videoElem = document.createElement('video');

                videoElem.setAttribute('muted', false);
                videoElem.setAttribute('id', peerId);
                videoElem.className = 'peer-video ';
                videoElem.className += peerId;
                videoElem.setAttribute("playsinline", true);
                videoElem.setAttribute("autoplay", true);
                videoElem.setAttribute('style', "height: 250px; width: 300px");
                if(isAudio) {
                    videoElem.setAttribute('muted', false);
                    videoElem.setAttribute('style', "display: none");
                }
                remoteVideoElem.appendChild(videoElem);
                window.attachMediaStream(videoElem, stream);
            }
          });

          skylinkEventManager.addEventListener(skylinkConstants.EVENTS.PEER_LEFT, evt => {
              [].forEach.call(document.querySelectorAll(`.${evt.detail.peerId}`), function(e) {
                  e.parentNode.removeChild(e);
              })
          })
    }
}

