# WebRTC手動シグナリング

## このコードを動かす目的

- WebRTCにおけるシグナリングのイメージを体感する
- SDPとICE Candidateがどういうものなのかイメージを掴む

## 解説

### WebRTCにおけるシグナリング

シグナリングとは、WebRTCによるP2Pの通信を開始する前に必要な行為である。
P2P通信に必要な以下の様な情報（一部を紹介）を予め交換する。

 - 送信しあう映像、音声の種類やコーデック情報等（SDP情報の交換）
 - P2P通信で利用するIPアドレス、ポート番号（ICE Candidate情報の交換）

交換する情報を読み解くにはかなりの知識量が必要とされるため、ここでは扱わない。
シグナリングの手法はW3Cでは定められていないため、どのような手法で実施してもよい。
一番ポピュラーなやり方はWebSocketを利用するものである。

### WebRTC手動シグナリングの使い方

WebRTC手動シグナリングは、シグナリングを手動でやれるように実装されたWebアプリケーションである。

1.  ローカルサーバを立ちあげ `manual_signaling.html` を `Chrome` で `2つ` 開く（P2Pで動作するため）

 - １つを発信側、もう一つを受信側と呼ぶ

2. 発信側、受信側双方で `Start video` をクリック

3. 発信側で `Connect` をクリック

4. 発信側の `SDP to send:` を cmd+a(macの場合) ですべて選択してコピーし、受信側の `SDP to receive` に貼り付けて `Receive SDP` をクリック

5. 受信側の `SDP to send` を cmd+a(macの場合) ですべて選択してコピーし、送信側の `SDP to receive` に貼り付けて `Receive SDP` をクリック

6. 送信側の `ICE Candidate to send` を cmd+a(macの場合) ですべて選択してコピーし、受信側の `ICE Candidates to receive` に貼り付けて `Receive ICE Candidates` をクリック

7. 受信側の `ICE Candidate to send` を cmd+a(macの場合) ですべて選択してコピーし、送信側の `ICE Candidates to receive` に貼り付けて `Receive ICE Candidates` をクリック

8. ビデオ映像の隣にもう一つのビデオ映像が現れたら成功


### 技術要素の説明

#### オファーアンサーモデル

WebRTCでは、Offer・Answerモデルを採用している。
映像や音声を送りたい（発信側）が、送りたい相手にOfferを送り、相手はそれに応える形でAnswerを返す。
そのため、通信前のネゴシエーションには順序がある。（この辺りがややこしいところ）

#### SDPとは

SDP（Session Description Protocol）の略で、SIPの頃から使われているプロトコル。
柔軟にメディア（映像や音声）を疎通させるために、通信条件のネゴシエーションを行うもの。
WebRTCではSIPの頃から使われているSDPに独自の拡張を加えて利用している。
Offer側が自分が対応可能なネゴシエーション条件をOffer SDPとしてシグナリングを通じて相手に提案、Answer側はそれを受けて受信可能な条件をAnswer SDPで応答する。

##### 例：OfferのSDP

```
{"type":"offer","sdp":"v=0\r\no=- 5327200005322978304 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE audio video\r\na=msid-semantic: WMS 1jQwfefxYMb4YbpqgALIXDWriUkqUQ4t5Ta3\r\nm=audio 9 RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:Qg1jI38ik+AGB/TQ\r\na=ice-pwd:gFhUlgNmAOQ1xOrX/Qzl6dGs\r\na=fingerprint:sha-256 C5:52:D2:58:A7:0A:DF:23:58:0A:ED:17:C9:D1:16:89:3F:32:07:CE:60:96:C3:2E:D0:2D:DD:2F:5A:AC:68:42\r\na=setup:actpass\r\na=mid:audio\r\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=recvonly\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10; useinbandfec=1\r\na=rtpmap:103 ISAC/16000\r\na=rtpmap:104 ISAC/32000\r\na=rtpmap:9 G722/8000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:106 CN/32000\r\na=rtpmap:105 CN/16000\r\na=rtpmap:13 CN/8000\r\na=rtpmap:126 telephone-event/8000\r\na=maxptime:60\r\nm=video 9 RTP/SAVPF 100 116 117 96\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:Qg1jI38ik+AGB/TQ\r\na=ice-pwd:gFhUlgNmAOQ1xOrX/Qzl6dGs\r\na=fingerprint:sha-256 C5:52:D2:58:A7:0A:DF:23:58:0A:ED:17:C9:D1:16:89:3F:32:07:CE:60:96:C3:2E:D0:2D:DD:2F:5A:AC:68:42\r\na=setup:actpass\r\na=mid:video\r\na=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:4 urn:3gpp:video-orientation\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:100 VP8/90000\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=rtcp-fb:100 goog-remb\r\na=rtpmap:116 red/90000\r\na=rtpmap:117 ulpfec/90000\r\na=rtpmap:96 rtx/90000\r\na=fmtp:96 apt=100\r\na=ssrc-group:FID 2320103026 1973795079\r\na=ssrc:2320103026 cname:F/1qoGGxgJk6fcFU\r\na=ssrc:2320103026 msid:1jQwfefxYMb4YbpqgALIXDWriUkqUQ4t5Ta3 b315b3d8-7c15-4074-99ac-e157ee5cfdc4\r\na=ssrc:2320103026 mslabel:1jQwfefxYMb4YbpqgALIXDWriUkqUQ4t5Ta3\r\na=ssrc:2320103026 label:b315b3d8-7c15-4074-99ac-e157ee5cfdc4\r\na=ssrc:1973795079 cname:F/1qoGGxgJk6fcFU\r\na=ssrc:1973795079 msid:1jQwfefxYMb4YbpqgALIXDWriUkqUQ4t5Ta3 b315b3d8-7c15-4074-99ac-e157ee5cfdc4\r\na=ssrc:1973795079 mslabel:1jQwfefxYMb4YbpqgALIXDWriUkqUQ4t5Ta3\r\na=ssrc:1973795079 label:b315b3d8-7c15-4074-99ac-e157ee5cfdc4\r\n"}
```

SDPについて詳しく知りたい方は http://www.slideshare.net/iwashi86/20150311-web-rtcmeetup7sdp

#### ICEとは

食べるアイスではない。
Interactive Connectivity Establishmentの略で、ざっくり言うと、NAT等がある現実のネットワーク環境下で、互いにP2Pの通信を行うための通信経路を選択する仕組み。
ICEにはSTUN、TURNという仕組みがる。

##### STUN

自分のIPアドレスとポート番号を調べる。
そのIPアドレスとポート番号を利用してUDPホールパンチングを行い、通信経路確立する。

##### UDPホールパンチング

NATに穴を開ける仕組み。
詳しくはこちらを参照 http://www.slideshare.net/yusukenaka52/webrtcortc-50153479#31

##### TURN

UDPホールパンチングでは通信できない場合に、サーバを中継させる仕組み。
また、ファイアウォールやWifiのプライバシセパレーターが入っている環境でも繋がる可能性がある。
尚、TURNサーバはメディアを中継するだけであり、暗号化を解かないため通信内容が漏れることもない。

ICEについて詳しく知りたい方は http://www.slideshare.net/iwashi86/webrtcice

#### ICE Candidateとは

クライアント同士がP2Pで通信するためには、ICEの仕組みを使いNATの壁を超える必要がある。
WebRTCでは、各クライアントが自分の端末が持っているIPアドレスと、通信可能なポート番号、プロトコル（TCP/UDP）を `ICE Candidate（つまり）` として収集する。

##### 例：ICE Candidateの一例

```
{"type":"candidate","sdpMLineIndex":0,"sdpMid":"audio","candidate":"candidate:1489021687 1 udp 2122194687 192.168.0.100 52790 typ host generation 0"}
```

収集したICE Candidateはシグナリングを通じて相手と交換する。交換後、ブラウザは相手からもらったICE Candidateの情報に基づき、UDPホールパンチング等を試行して、通信できる経路を探す。

## 手動シグナリングのソースコード引用元

引用させていただきました。有難うございます。

 - WebRTCに触ってみたいエンジニア必見！手動でWebRTC通信をつなげてみよう@がねこまさし（インフォコム株式会社）
   - https://html5experts.jp/mganeko/5181/