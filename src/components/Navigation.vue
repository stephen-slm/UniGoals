<template>
  <div>
    <v-navigation-drawer app v-model="drawer"></v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-title>
        <v-toolbar-side-icon v-if="$vuetify.breakpoint.mdAndDown" @click.stop="drawer = !drawer"/>
        <span class="hidden-sm-and-down">UniGoals</span>
      </v-toolbar-title>
      <v-spacer/>

      <v-btn icon>
        <v-badge overlap>
          <span v-if="notificationCount > 0" slot="badge" small>{{ notificationCount }}</span>
          <v-icon color="rgba(41, 41, 41, 0.54)">notifications</v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img src="../assets/logo.svg" alt="Dogber">
        </v-avatar>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import * as _ from 'lodash';
import firebaseWrapper from '@/libs/FirebaseWrapper.ts';

export default {
  name: 'ToolBarNavigation',
  props: {
    // show is passed through by the application, this is determined if we are authenticated or not,
    // which results in displaying the navigation ui.
    show: false
  },

  data: () => ({
    // The notification count that will be displayed above the navigation icon within the nav bar.
    notificationCount: 0,
    drawer: null
  }),

  created() {
    // validate that we are authenticated before we attempt to get the notifications
    if (_.isNil(firebaseWrapper.getCurrentUser())) {
      const notificationReference = firebaseWrapper.getNotificationReference();

      // If we are authenticated, then when a new notification is added we will automatically update
      // the ui to display the new notification count.
      notificationReference.on('value', snapshot => {
        notificationCount: _.size(snapshot.val());
      });
    }
  },

  methods: {}
};
</script>

<style scoped>
.avatar {
  vertical-align: middle;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
</style>
