<template>
  <div class="home">
    <div v-bind:click="goHome">
      <img class="avatar" alt="Peoples Image" v-bind:src="image">
    </div>

    <HelloWorld v-bind:name="name"/>
    <v-btn @click="logout">Sign out</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';

import firebaseWrapper from '@/libs/FirebaseWrapper.ts';
import HelloWorld from '@/components/HelloWorld.vue';

export default Vue.extend({
  name: 'home',

  data: () => ({
    // the name of the authenticated user to display for preview reasons.
    name: null,
    // the current profile image of the authenticated user
    image: null
  }),

  components: {
    HelloWorld
  },

  created() {
    // get the currenlty authenticated user.
    const user = firebaseWrapper.getCurrentUser();

    // if we are authenticated and the user object exists, set the name and image from the
    // authenticated object.
    if (!_.isNil(user)) {
      this.name = user.displayName;
      this.image = user.photoURL;
    }
  },

  methods: {
    /**
     * triggers firebase to logout and disolve all authentication tokens.
     */
    async logout() {
      return await firebaseWrapper.authentication.signOut();
    },
    /**
     * Redirects the current user to the home page.
     */
    goHome() {
      return this.$router.push({ name: 'home' });
    }
  }
});
</script>

<style scoped>
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>

