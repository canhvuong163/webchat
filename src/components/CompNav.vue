<template>
    <nav>
        <div class="container">
            <h1><strong>CHAT</strong> với bạn bè hoặc người lạ</h1>
            <div v-if="isLogin" class="login">
            <Avatar :src="user.photoURL" />
            <button class="text-gray-400 hover:text-white" @click="signOut">
                Đăng xuất
            </button>
            </div>
            <button v-else class="bg-green-400 hover:bg-green-600" @click="signIn">
                Đăng nhập
            </button>
        </div>
    </nav>
</template>

<script>
    import Avatar from './CompAvatar.vue';
    import { useAuth } from "@/firebase";
    export default {
        components: {
            Avatar,
   
},
        setup() {
            const {user, isLogin, signIn, signOut} = useAuth()
            return {user, isLogin, signIn, signOut}
        }
    }

</script>