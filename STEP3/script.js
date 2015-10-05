//APIキー
var APIKEY = '';

//ユーザーリスト
var userList = [];

//Callオブジェクト
var existingCall;

// Compatibility
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// PeerJSオブジェクトを生成
// ハンズオン

// PeerIDを生成
// ハンズオン

// 相手からのコールを受信したら自身のメディアストリームをセットして返答
// ハンズオン

// エラーハンドラー
// ハンズオン

// イベントハンドラー
$(function(){

    // 相手に接続
    $('#make-call').click(function(){
        // ハンズオン
        step3(call);

    });

    // 切断
    $('#end-call').click(function(){
        // ハンズオン
        step2();
    });

    // メディアストリームを再取得
    $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
    });

    // ステップ１実行
    step1();

    //ユーザリス取得開始
    setInterval(getUserList, 2000);

});

function step1 () {
    // メディアストリームを取得する
    // ハンズオン
}

function step2 () {
    //UIコントロール
    $('#step1, #step3').hide();
    $('#step2').show();
}

function step3 (call) {
    // すでに接続中の場合はクローズする
    if (existingCall) {
        // ハンズオン
    }

    // 相手からのメディアストリームを待ち受ける
    // ハンズオン

    // 相手がクローズした場合
    // ハンズオン

    // Callオブジェクトを保存
    existingCall = call;

    // UIコントロール
    $('#their-id').text(call.peer);
    $('#step1, #step2').hide();
    $('#step3').show();

}

function getUserList () {
    //ユーザリストを取得
    // ハンズオン
}
