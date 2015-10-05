// シグナリングサーバ設定
var config = {
    signalingServerUrl: "ws://localhost:9001",
    apikey: 'test'
};

// シグナリングコールバック登録
var signalling = {
    'offer': onReceiveOffer,
    'answer': onReceiveAnswer,
    'icecandidate': onReceiveCandidate,
    'bye': onReceiveHangup
};

// シグナリングサーバへ接続
var signalingServer = new WebSocket(config.signalingServerUrl + '/' + config.apikey);

// シグナリングサーバとの接続を開始
signalingServer.onopen = function (e) {
    console.log("Connection established!");
};

//　シグナリングサーバからメッセージを受信
signalingServer.onmessage = function (e) {
    var mes = JSON.parse(e.data);
    window.signalling[mes.type](mes);
    console.log(mes);
};

// シグナリングサーバにメッセージを送信
function wsSend(msg){
    signalingServer.send(JSON.stringify(msg));
}


// PeerConnectionオブジェクト
var peerConnection;

// Offerを受信した際に発火する
function onReceiveOffer(desc){
    window.peerConnection.setRemoteDescription(new RTCSessionDescription(desc), function(){
        console.log("STEP2 Receive Offer from peer.");
        window.peerConnection.createAnswer(function(description){
            console.log("STEP3 Create Answer succeeded. Send it to peer.");
            window.peerConnection.setLocalDescription(description);
            window.wsSend(description);
        },function(){
            console.log('Create Answer failed');
        },{'mandatory': {'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }});
    });
}

// Answerを受信した際に発火
function onReceiveAnswer(desc){
    console.log("STEP4 Receive Answer from peer.");
    window.peerConnection.setRemoteDescription(new RTCSessionDescription(desc));

}

// ICE Candidateを受信した際に発火
function onReceiveCandidate(desc){
    console.log("STEP5 Receive Candidate from peer.");
    var candidate = new RTCIceCandidate({sdpMLineIndex:desc.sdpMLineIndex, sdpMid:desc.sdpMid, candidate:desc.candidate});
    window.peerConnection.addIceCandidate(candidate);

}

// PeerConnectionを作成
function createPeerConnection(){

    this.stunServerURL = "stun:stun.skyway.io:3478";

    var __config = { iceServers: [{ urls: this.stunServerURL }] };

    window.peerConnection = new webkitRTCPeerConnection(__config);
    window.peerConnection.onaddstream = window.onAddRemoteStream;
    window.peerConnection.onicecandidate = window.onIceCandidate;
    console.log("Create PeerConnetion");

}

// ICE Candidateをブラウザから取得した際に発火
function onIceCandidate(event){
    if (event.candidate) {
        console.log("STEP4 Found candidate. Send it to peer.");
        window.wsSend({
            type: event.type,
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    } else {
        console.log("End of candidate");
    }

}

// CreateOfferを行う
function createOffer(){
    window.peerConnection.createOffer(function(description){
        console.log("STEP1 create Offer succeed. Send it to peer.");
        window.peerConnection.setLocalDescription(description);
        window.wsSend(description);
    }, function() {
        console.log('Create Offer failed');
    });
}

// ローカル（自分）のストリームを取得する
function getLocalStream(cb) {
    navigator.webkitGetUserMedia({audio: true, video: true}, function(stream){
        $('#my-video').prop('src', URL.createObjectURL(stream));
        cb(stream);
    }, function(){ $('#step1-error').show(); });
}

// Peerが切断した際に発火
function onReceiveHangup(desc){
    console.log("STEP6 Receive Hangup from peer.");
    window.peerConnection.close();
    window.peerConnection = null;

}

$(function(){

    createPeerConnection();
    getLocalStream(function(localStream){
        window.peerConnection.addStream(localStream);
        $('#step1, #step3').hide();
        $('#step2').show();

    });

    // 相手に接続
    $('#make-call').click(function(){
        createOffer();
        $('#step1, #step2').hide();
        $('#step3').show();

    });

    // 切断
    $('#end-call').click(function(){
        window.peerConnection.close();
        window.wsSend({'type':'bye'});

    });

});

// リモートのストリームを取得した際に発火
function onAddRemoteStream(ev) {
    $('#their-video').prop('src', URL.createObjectURL(ev.stream));
    $('#step1, #step2').hide();
    $('#step3').show();
}