import jszip from "https://cdn.skypack.dev/jszip@3.10.1";
var recorder; // globally accessible
var blobs = [];
var result_container = document.querySelector("#results");
var record_button = document.querySelector("#record");
var stop_button = document.querySelector("#stop");
var download_button = document.querySelector("#download");
var randomTextBtn = document.querySelector("#random_text");
var zip = new jszip();
var randomText;
var files;
    
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function showNextRandom(){
  randomText = makeid(5);
  randomTextBtn.innerText = randomText;
}


function captureMicrophone(callback) {
  navigator.mediaDevices
    .getUserMedia({ audio: true})
    .then(callback)
    .catch(function(error) {
      alert("Unable to access your microphone.");
      console.error(error);
    });
}
var index = 1;
function stopRecordingCallback() {
  var blob = recorder.getBlob();
  var audio_element = document.createElement("a");
  audio_element.innerText = randomText;
  audio_element.className = "collection-item";
  audio_element.href = URL.createObjectURL(blob);
  audio_element.onclick = function(e) {
    e.preventDefault();
    var file = new File([blob], audio_element.innerText, {
      type: "audio/wav"
    });

    invokeSaveAsDialog(file, file.name);
  };
  var file = new File([blob], audio_element.innerText, {
    type: "audio/wav"
  });
  zip.file( audio_element.innerText + ".wav", file)
  recorder.microphone.stop();
  result_container.appendChild(audio_element);
  console.log("BLOBS:" + blobs.length);
  blobs = [];
  index++;
  record_button.disabled = false;
  showNextRandom();
}

record_button.onclick = function() {
  this.disabled = true;
  captureMicrophone(function(microphone) {
    recorder = RecordRTC(microphone, {
      type: "audio",
      mimeType: 'audio/wav',
      // audioBitsPerSecond: 128000,
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 1,
      disableLogs: true,
      desiredSampRate: 16000,
      // sampleRate: 96000,
      // bufferSize:2048,
      timeSlice: 250,
      // getNativeBlob: true,
      ondataavailable: function(blob) {
        console.log("BLOBS" + blob.size);
        blobs.push(blob);
      }
    });
    recorder.startRecording();
    recorder.microphone = microphone;
    stop_button.disabled = false;
  });
};
stop_button.onclick = function() {
  this.disabled = true;
  recorder.stopRecording(stopRecordingCallback);
};
showNextRandom();

download_button.onclick = function(){
  zip.generateAsync({type:"blob"})
  .then(function (blob) {
      invokeSaveAsDialog(blob, "recordings.zip");
  });
}
// recorder.destroy();
// recorder.clearRecordedData();
// recorder.pauseRecording();
// recorder.resumeRecording();
