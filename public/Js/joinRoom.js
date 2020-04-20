let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomId = null;
let roomDialog = null;
roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));

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

export default async function joinRoom() {

    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    document.querySelector('#localVideo').srcObject = stream;
    localStream = stream;
    remoteStream = new MediaStream();
    document.querySelector('#remoteVideo').srcObject = remoteStream;

    document.querySelector('#createBtn').disabled = true;
    document.querySelector('#joinBtn').disabled = true;
    document.querySelector('#hangupBtn').disabled = false;
    
  
    document.querySelector('#confirmJoinBtn').
        addEventListener('click', async () => {
          roomId = document.querySelector('#room-id').value;
          await joinRoomLogic(roomId);
        }, {once: true});
    roomDialog.open();
  }
  
  async function joinRoomLogic(roomId) {
  
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(`${roomId}`);
    const roomSnapshot = await roomRef.get();
  
    if (roomSnapshot.exists) {
      peerConnection = new RTCPeerConnection(configuration);
  
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      document.querySelector('#currentRoom').innerText = `You joined Room ${roomId} !`;
  
      // collecting ICE candidates
      const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
      peerConnection.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          return;
        }
        calleeCandidatesCollection.add(event.candidate.toJSON());
      });
  
      peerConnection.addEventListener('track', event => {
        event.streams[0].getTracks().forEach(track => {
          remoteStream.addTrack(track);
        });
      });
  
      // creating SDP answer
      const offer = roomSnapshot.data().offer;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
  
      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await roomRef.update(roomWithAnswer);
  
      // Listening for remote ICE candidates
      roomRef.collection('callerCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }

    else{
        document.querySelector('#currentRoom').innerText = `Are you kidding ! It's an invalid RoomID`;
    }
  }
  