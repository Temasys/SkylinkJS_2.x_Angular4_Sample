import { Component } from "@angular/core";
declare var SkylinkWrapper: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private appKey = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
  private defaultRoom = "Default";
  private enableDataChannel = true;
  private enableIceTrickle = true;
  private audioFallback = true;
  private forceSSL = true;
  private audio = true;
  private video = true;
  private streams = [];
  private isJoined = false;
  private isRecording = false;
  private textValue = "Default";
  private message = "";

  constructor() {
    if (!this.isJoined) {
      this.isJoined = true;
      SkylinkWrapper.init({
        appKey: this.appKey,
        audio: this.audio,
        video: this.video,
        defaultRoom: this.textValue,
        enableDataChannel: this.enableDataChannel,
        enableIceTrickle: this.enableIceTrickle,
        audioFallback: this.audioFallback,
        forceSSL: this.forceSSL
      });
    }
  }

  checkValue(val: any) {
    this[val] = val;
  }

  handleJoinRoom() {
    SkylinkWrapper.start({
      audio: this.audio,
      video: this.video,
      defaultRoom: this.textValue
    });
  }

  handleLeaveRoom() {
    SkylinkWrapper.leaveRoom(this.textValue);
  }

  handleGetObject() {
    console.log(SkylinkWrapper.getObject());
  }

  handleLeaveAllRoom() {
    SkylinkWrapper.leaveAllRoom();
  }

  handleStartRecording() {
    if (this.isRecording) return;
    this.isRecording = true;
    SkylinkWrapper.startRecording(this.textValue);
  }

  handleStopRecording() {
    if (!this.isRecording) return;
    SkylinkWrapper.stopRecording(this.textValue);
  }

  sendMessage() {
    SkylinkWrapper.sendMessageP2P(this.textValue, this.message);
    this.message = "";
  }
}
