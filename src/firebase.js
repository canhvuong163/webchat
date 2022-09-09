import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import Filter from 'bad-words'
import {ref, onUnmounted, computed} from 'vue'

firebase.initializeApp({
    apiKey: "AIzaSyD_hd9WSFB4z9ZHrfXEXrTGShkUQBCUDIY",
    authDomain: "chatting-with-my-friends-9df89.firebaseapp.com",
    projectId: "chatting-with-my-friends-9df89",
    storageBucket: "chatting-with-my-friends-9df89.appspot.com",
    messagingSenderId: "86623293465",
    appId: "1:86623293465:web:0b48543125a3849db0da88",
    measurementId: "G-92HXEQQ90B"
})

const auth = firebase.auth()


export function useAuth() {
    const user = ref(null)
    const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
    onUnmounted(unsubscribe)
    const isLogin = computed(() => user.value !== null)

    const signIn = async () => {
        
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        await auth.signInWithPopup(googleProvider)
        
    }
    const signOut = () => auth.signOut()

    return {user, isLogin, signIn, signOut}
}

const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100);
const filter = new Filter()

export function useChat() {
    const messages = ref([])
    const unsubscribe = messagesQuery.onSnapshot(snapshot => {
        messages.value = snapshot.docs
        .map(doc => ({id: doc.id, ...doc.data() }))
        .reverse()
    })
    onUnmounted(unsubscribe)

    const{user, isLogin } = useAuth()
    const sendMessage = text => {
        if(!isLogin.value) return 
        const {photoURL, uid, displayName } = user.value
        messagesCollection.add({
            userName: displayName,
            userId: uid,
            userPhotoURL: photoURL,
            text: filter.clean(text),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }
    return {messages, sendMessage}
}
