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

  data: function() {
    return {
      name: '',
      image: ''
    };
  },

  components: {
    HelloWorld
  },

  created: function() {
    // get the currenlty authenticated user.
    const user = firebaseWrapper.getCurrentUser();

    // if we are authenticated and the user object exists, set the name and image from the
    // authenticated object.
    if (!_.isNil(user)) {
      this.name = user.displayName || '';
      this.image = user.photoURL || '';
    }
  },

  methods: {
    logout: async function() {
      return await firebaseWrapper.authentication.signOut();
    },

    goHome: function() {
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

