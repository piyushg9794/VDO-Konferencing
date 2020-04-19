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
2) peer to peer mesh architecture
3) public STUN server ('stun:stun1.l.google.com:19302')
