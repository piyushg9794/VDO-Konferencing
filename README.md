# VDO-Konferencing

## Brief Intro of Web Real Time Communication

### Giants of Real Time Communication

1) XMPP (whatsapp)
2) Websocket (Wechat)
3) WebRTC (hangouts, Google, facebook)

### WebRTC Architectures

1) Peer to peer (1 to 1)
2) Peer to peer mesh (good for 2-5 people)
3) Using media servers (good for large no. of participants)

#### Servers

1) Signaling server ( good for LAN, where no NAT)
2) STUN server (used if NAT)
3) TURN server (use if NAT + firewall ie. cases where STUN fails)
4) Media Servers
  i) MCU
  ii) SFU
  
### Some WebRTC Libraries/frameworks :

1) webRTC.io
2) simple-peer
3) easyRTC
4) rtc.io

## What is used in this application?

1) WebRTC.io
2) peer to peer
3) public STUN server ('stun:stun1.l.google.com:19302')
4) firebase cloud store as a database
5) Firebase hosting 
6) Material.io components for faster UI development

### Still in progress :

1) P2P mesh implementation 
2) RTCDataChannel Implementation

## How to use :

1) clone the repository
2) create a project in firebase with firestore support
3) install firebase CLI in your system
4) Authenticate firebase CLI and navigate to your project
5) provide an alias fro your project
6) run firebase serve --only hosting
7) enjoy!

![](https://github.com/piyushg9794/VDO-Konferencing/blob/master/ss/img1.png)
![](https://github.com/piyushg9794/VDO-Konferencing/blob/master/ss/img2.png)
