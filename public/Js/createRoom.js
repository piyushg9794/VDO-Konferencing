let peerConnection = null;
let roomId = null;
let localStream = null;
let remoteStream = null;

const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

export default async function createRoom() {

    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    document.querySelector('#localVideo').srcObject = stream;
    localStream = stream;
    remoteStream = new MediaStream();
    document.querySelector('#remoteVideo').srcObject = remoteStream;

    document.querySelector('#createBtn').disabled = true;
    document.querySelector('#joinBtn').disabled = true;
    document.querySelector('#hangupBtn').disabled = false;
    
    const db = firebase.firestore();
    const roomRef = await db.collection('rooms').doc();
  
    peerConnection = new RTCPeerConnection(configuration);
  
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  
    // collecting ICE candidates
    const callerCandidatesCollection = roomRef.collection('callerCandidates');
  
    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        return;
      }
      callerCandidatesCollection.add(event.candidate.toJSON());
    });

  
    // creating a room
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  
    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await roomRef.set(roomWithOffer);
    roomId = roomRef.id;
    document.querySelector('#currentRoom').innerText = `You are host of Room - ${roomRef.id}`;
  
  
    peerConnection.addEventListener('track', event => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    });
  
    // Listening for remote session description
    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });
  
    // Listening for remote ICE candidates
    roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }
  