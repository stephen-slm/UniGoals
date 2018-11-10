<template>
  <v-app>
    <Navigation v-bind:show="userAuthenticated" />
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    <Footer />
    </v-content>
  </v-app>
</template>

<script>
  import * as _ from 'lodash';
  import firebaseWrapper from './libs/firebaseWrapper';
  import Navigation from './components/Navigation.vue';
  import Footer from './components/Footer.vue';
  export default {
    data: () => {
      return {
        userAuthenticated: false
      }
    },
    components: {
      Navigation,
      Footer,
    },
    created: function() {
      this.userAuthenticated = !_.isNil(firebaseWrapper.getCurrentUser());
      const { authentication } = firebaseWrapper;

      if (_.isNil(firebaseWrapper.getCurrentUser())) {
        this.$router.push({ name: 'login', params: {} });
      }
      authentication.onAuthStateChanged(() => {
        if (!_.isNil(firebaseWrapper.getCurrentUser())) {
          this.userAuthenticated = true;
        } else {
          this.userAuthenticated = false;
          this.$router.push({ name: 'login', params: {} });
        }
      });
    },
    methods: {}
  };
</script>



<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-align: center;
    background-color: #f9f9f9;
  }

  p {
    margin: 0;
    padding: 0;
  }
</style>