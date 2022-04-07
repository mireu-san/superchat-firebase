import './App.css';

// firebase sdk
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Firestore } from 'firebase/firestore';

firebase.initializeApp({
  // my config
  apiKey: "AIzaSyBQkOk7riNlultd2MiksBZHeqHy1uIPqWM",
  authDomain: "superchat-firebase-f35df.firebaseapp.com",
  projectId: "superchat-firebase-f35df",
  storageBucket: "superchat-firebase-f35df.appspot.com",
  messagingSenderId: "1015200352687",
  appId: "1:1015200352687:web:4406c22179155fdd11875a",
  measurementId: "G-D19RE2L6YQ"
})

function App() {

  const [user] = useAuthState(auth);


  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit">Send!</button>

      </form>
    </>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}> Sign out </button>
  )
}

function ChatRoom() {
  const messagesRef = Firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idFIeld: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
  }
}

function ChatMessage(props) {
  const { text, uid } = props.message;
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )

  return <p>{text}</p>
}

export default App;
