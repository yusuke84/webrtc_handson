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
    // ハンズオン
}

// Answerを受信した際に発火
function onReceiveAnswer(desc){
    // ハンズオン

}

// ICE Candidateを受信した際に発火
function onReceiveCandidate(desc){
    // ハンズオン

}

// PeerConnectionを作成
function createPeerConnection(){
    // ハンズオン

}

// ICE Candidateをブラウザから取得した際に発火
function onIceCandidate(event){
    // ハンズオン

}

// CreateOfferを行う
function createOffer(){
    // ハンズオン
}

// ローカル（自分）のストリームを取得する
function getLocalStream(cb) {
    // ハンズオン
}

// Peerが切断した際に発火
function onReceiveHangup(desc){
    // ハンズオン

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