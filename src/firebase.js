import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import Filter from 'bad-words'
import {ref, onUnmounted, computed} from 'vue'

//file tuong tac vơi firebase
firebase.initializeApp({
    apiKey: "AIzaSyD_hd9WSFB4z9ZHrfXEXrTGShkUQBCUDIY",
    authDomain: "chatting-with-my-friends-9df89.firebaseapp.com",
    projectId: "chatting-with-my-friends-9df89",
    storageBucket: "chatting-with-my-friends-9df89.appspot.com",
    messagingSenderId: "86623293465",
    appId: "1:86623293465:web:0b48543125a3849db0da88",
    measurementId: "G-92HXEQQ90B"
})
//ham xu ly xac thuc, lang nghe cac thay doi trạng thái
const auth = firebase.auth()

export function useAuth() {
    const user = ref(null)
    const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user)) //gán giá trị người dùng nhập vào
    onUnmounted(unsubscribe) //hủy đăng ký khi logout
    const isLogin = computed(() => user.value !== null) //kiểm tra người dùng đã đăng nhập hay chưa, trả về "null" nếu không login

    //Ghi nhật ký sử dụng
    const signIn = async () => {
        
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        await auth.signInWithPopup(googleProvider)
        
    }

    //Logout
    const signOut = () => auth.signOut()

    return {user, isLogin, signIn, signOut}
}

//tạo hook cho fire
const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')//chữa dữ liệu người dùng nhập vào
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100);//hiển thị 100 tin nhắn gần nhất
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
