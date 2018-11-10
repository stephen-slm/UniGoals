<template>
    <div class="login">
        <img width="64px" class="avatar" src="../assets/logo.svg" alt="UniGoals">
        <h6 class="title">UniGoals</h6>
        <div>
            <p class="subheading">Full Course & Unit Tracking</p>
            <p class="caption">built by a University <a href="https://www.linkedin.com/in/stephen-lineker-miller/" rel="noopener" target="_blank">Student</a> for University Students</P>
        </div>
        <Loading v-if="loading" v-bind:message="loadingMessage" />
        <div v-if="!loading" class="loginContainer">
            <v-btn :loading="loading" :disabled="loading" color="primary" v-on:click="loginWithGoogle">Login | Register</v-btn>
        </div>
    </div>
</template>

<script>
  import * as _ from 'lodash';
  import firebaseWrapper from '../libs/firebaseWrapper';
  import Loading from '../components/Loading.vue';

  export default {
    name: 'Login',
    data: () => {
      return {
        loading: true,
        isMobile: typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1,
        loadingMessage: 'Getting redirection results if any.'
      };
    },
    components: {
      Loading
    },
    created: function() {
      const { authentication } = firebaseWrapper;

      authentication.getRedirectResult().then((login) => {
        if (!_.isNil(login.user)) {
          this.loadingMessage = 'authenticating redirection';

          authentication
            .signInAndRetrieveDataWithCredential(login.credential)
            .then(() => this.completeAuthentication(login))
            .then(() => this.navigateHome())
            .catch((error) => this.handleAuthenticationError(error));
        }
      });

      // This will wait for the redirection results to complete as the state would not be checked
      // during the login process, this means that its safe to not have a check for this as it
      // would never be hit if a device was logging in from the home page, otherwise it will get
      // the local session and login again if it exists.
      authentication.onAuthStateChanged((login) => {
        if (!_.isNil(login)) {
          this.completeAuthentication(login, true)
            .then(() => this.navigateHome())
            .catch((error) => this.handleAuthenticationError(error));
        } else {
          this.loading = false;
        }
      });
    },

    methods: {
      /**
       * Completes the authentication from firebase.
       * @param {object} login The authentication login returned from firebase.
       * @param {boolean} auth If its not a re-authentication.
       */
      completeAuthentication(login, auth = false) {
        if (_.isNil(login)) return Promise.resolve();

        this.loadingMessage = `Authenticating user${login.displayName == null ? '' : ` ${login.displayName}`}`;

        return new Promise((resolve, reject) => {
          if (!auth && login.additionalUserInfo.isNewUser) {
            firebaseWrapper
              .createNewUser()
              .then(() => {
                this.loading = false;
                resolve();
              })
              .catch((error) => reject(error));
          } else {
            this.loading = false;
            resolve();
          }
        });
      },

      /**
       * Authenticates the user with Google.
       */
      loginWithGoogle() {
        this.loading = true;
        this.loadingMessage = 'Attempting to authenticate with Google.';

        return firebaseWrapper
          .authenticateWithGoogle(this.isMobile)
          .then((login) => this.completeAuthentication(login))
          .catch((error) => this.handleAuthenticationError(error))
          .finally(() => (this.loading = false));
      },

      /**
       * Handles a authentication error.
       * @param {object} error the error that occurred during the authentication.
       */
      handleAuthenticationError(error) {
        console.error(error.message);
        this.loading = false;
      },

      /**
       * Navigates back to the home page.
       */
      navigateHome() {
        this.$router.push({ name: 'home', params: {} });
      }
    }
  };
</script>

<style scoped>
    p {
        margin: 0;
    }

    .login {
        padding: 30px 25px;
        margin: 25px auto;
    }

    .loginContainer a {
        display: block;
        font-size: 1.5em;
        text-decoration: none;
        color: white;
        width: 9em;
        padding: 0.55em 0.3em;
        text-align: center;
        cursor: pointer;
        margin: 0.5em auto;
    }
</style>