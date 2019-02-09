<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Welcome to Awesome App</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <blockquote class="blockquote text-xs-center">It's a basic Single Page application
          <br>with Google Firebase authentication
        </blockquote>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 class="text-xs-center" mt-5>
        <v-btn @click="loginWithGoogleAsync">Sign In</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';

import firebaseWrapper from '@/libs/FirebaseWrapper.ts';
import Loading from '@/components/Loading.vue';
import { isMobileDevice } from '@/utils';

export default Vue.extend({
  name: 'Login',
  data: () => {
    return {
      loading: true,
      isMobile: isMobileDevice(),
      loadingMessage: 'Getting redirection results if any.'
    };
  },
  components: {
    Loading
  },

  /**
   * When the page first loads, validate that we are not redirecting from a authentication page with
   * the authentication data. Additionally setting up the authentication state change, in case we
   * authenticate on the current page.
   */
  async created() {
    const { authentication } = firebaseWrapper;

    // This will wait for the redirection results to complete as the state would not be checked
    // during the login process, this means that its safe to not have a check for this as it
    // would never be hit if a device was logging in from the home page, otherwise it will get
    // the local session and login again if it exists.
    authentication.onAuthStateChanged(async login => {
      if (_.isNil(login)) return this.setLoading(false);

      try {
        await this.completeAuthenticationAsync(login, true);
        this.navigateHome();
      } catch (error) {
        this.handleAuthenticationError(error);
      }
    });

    // get the drection result if any.
    const redirectionResult = await authentication.getRedirectResult();

    // if we didnt have any redirection authentication, then just exist early.
    if (_.isNil(redirectionResult) || _.isNil(redirectionResult.user)) return;

    this.loadingMessage = 'authenticating redirection';

    try {
      if (!_.isNil(redirectionResult.credential)) {
        await authentication.signInAndRetrieveDataWithCredential(redirectionResult.credential);

        await this.completeAuthenticationAsync(redirectionResult);
        this.navigateHome();
      }
    } catch (error) {
      this.handleAuthenticationError(error);
    }
  },

  methods: {
    /**
     * Completes the authentication from firebase.
     * @param {object} login The authentication loginr returned from firebase.
     * @param {bool} reauth If its not a reauthentication.
     */
    async completeAuthenticationAsync(login: any, reauth = false) {
      if (_.isNil(login)) return;

      const name = _.isNil(login.displayName) ? '' : login.displayName;
      this.loadingMessage = `Authenticating user${name}`;

      if (reauth || !login.additionalUserInfo.isNewUser) {
        return this.setLoading(false);
      }

      await firebaseWrapper.createNewUserAsync();
    },

    /**
     * Authenticates the user with Google.
     */
    async loginWithGoogleAsync() {
      this.loadingMessage = 'Attempting to authenticate with Google.';
      this.setLoading(true);

      try {
        const login = await firebaseWrapper.authenticateWithGoogleAsync(this.isMobile);
        await this.completeAuthenticationAsync(login);
      } catch (error) {
        this.handleAuthenticationError(error);
      }

      return this.setLoading(false);
    },

    /**
     * Authenticates the user with Facebook.
     */
    async loginWithFacebookAsync() {
      this.loadingMessage = 'Attempting to authenticate with Facebook.';
      this.setLoading(true);

      try {
        const login = await firebaseWrapper.authenticateWithFacebookAsync(this.isMobile);
        await this.completeAuthenticationAsync(login);
      } catch (error) {
        this.handleAuthenticationError(error);
      }

      return this.setLoading(false);
    },

    /**
     * Authenticates the user with Github.
     */
    async loginWithGithubAsync() {
      this.loadingMessage = 'Attempting to authenticate with Github.';
      this.setLoading(true);

      try {
        const login = await firebaseWrapper.authenticateWithGithubAsync(this.isMobile);
        await this.completeAuthenticationAsync(login);
      } catch (error) {
        this.handleAuthenticationError(error);
      }

      return this.setLoading(false);
    },

    /**
     * Handles a authentication error.
     * @param {error} error the error that occured during the authenication.
     */
    handleAuthenticationError(error: Error) {
      console.error(error.message);
      this.setLoading(false);
    },

    /**
     * Navigates back to the home page.
     */
    navigateHome() {
      this.$router.push({ name: 'home', params: {} });
    },

    /**
     * Sets the loading value of the data prop loading. adjusting this will adjust if the loading panel
     * is showing or not.
     */
    setLoading(value: boolean) {
      this.loading = value;
    }
  }
});
</script>


<style scoped>
.login {
  padding: 30px 25px;
  margin: 25px auto;
  width: 250px;
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
.loginContainer a.facebook {
  background: #3a589a;
}
.loginContainer a.facebook:hover {
  background: rgba(58, 88, 154, 0.8);
}
.loginContainer a.github {
  background: #333;
}
.loginContainer a.github:hover {
  background: rgba(51, 51, 51, 0.8);
}
.loginContainer a.google {
  background: #e9544f;
}
.loginContainer a.google:hover {
  background: rgba(233, 84, 79, 0.8);
}
</style>
