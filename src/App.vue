<template>
    
    <CompNav />
    <CompChat />
    <CopyRight />
   
</template>

<script>
import CompNav from './components/CompNav.vue';
import CompChat from './components/CompChat.vue';
import CopyRight from './components/CopyRight.vue';

export default {
  name: 'App',
  components: {
    CompNav,
    CompChat,
    CopyRight
}
}
</script>
