<template>
  <div class="home">
    <div v-bind:click="goHome">
      <img class="avatar" alt="Peoples Image" v-bind:src="image">
    </div>

    <HelloWorld v-bind:msg="message" />
    <button v-on:click="logout">signout</button>
  </div>
</template>

<script>
  import * as _ from 'lodash';

  import firebaseWrapper from '../libs/firebaseWrapper';
  import HelloWorld from '../components/HelloWorld.vue';

  export default {
    name: 'home',
    components: {
      HelloWorld
    },
    data: () => ({
      message: 'Welcome ',
      image: '../assets/logo.png'
    }),
    created() {
      const user = firebaseWrapper.getCurrentUser();

      if (!_.isNil(user)) {
        this.message += ` ${user.displayName}`;
        this.image = user.photoURL;
      }
    },
    methods: {
      logout() {
        return firebaseWrapper.authentication.signOut();
      },
      goHome() {
        return this.$router.push({ name: 'home' });
      }
    }
  };
</script>

<style scoped>
  .avatar {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
</style>