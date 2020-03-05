import { Component } from '@angular/core';
declare var SkylinkWrapper: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private appKey = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
  private defaultRoom = 'defaultRoom';
  private enableDataChannel = true;
  private enableIceTrickle = true;
  private audioFallback = true;
  private forceSSL = true;
  private audio = true;
  private video = true;
  private streams = [];
  private isJoined = false;
  private isRecording = false;
  private test = undefined;

  constructor() {

  }

  checkValue(val: any){
    this[val] = val;
 }

 handleJoinRoom() {
  if(!this.isJoined) {
    this.isJoined = true;
    SkylinkWrapper.init({
      appKey: this.appKey,
      audio: this.audio,
      video: this.video,
      defaultRoom: this.defaultRoom,
      enableDataChannel: this.enableDataChannel,
      enableIceTrickle: this.enableIceTrickle,
      audioFallback: this.audioFallback,
      forceSSL: this.forceSSL
    });
  }
}

handleStartRecording() {
  if(this.isRecording) return;
  this.isRecording = true;
  SkylinkWrapper.startRecording(this.defaultRoom);
}

handleStopRecording() {
  if(!this.isRecording) return;
  SkylinkWrapper.stopRecording(this.defaultRoom);
}

}

