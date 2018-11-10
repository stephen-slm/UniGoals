<template>
    <div>
        <v-navigation-drawer app v-if="show" v-model="drawer">
            <v-list dense class="lighten-4" >
                <v-list-tile>
                    <v-list-tile-action>
                        <v-avatar :size="32"color="grey lighten-4">
                            <img class="avatar" alt="Peoples Image" v-bind:src="image">
                        </v-avatar>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="subheading font-weight-medium"> {{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon>home</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title class="subheading">Home</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>notifications</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="subheading">Notifications</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>person</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="subheading">My Profile</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="subheading">Settings</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="subheading">Sign out</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app v-if="show">
            <v-toolbar-title>
                <v-toolbar-side-icon v-if="$vuetify.breakpoint.mdAndDown" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-sm-and-down">UniGoals</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon color="rgba(0, 0, 0, 0.75)">notifications</v-icon>
            </v-btn>
            <v-btn icon large>
                <v-avatar size="32px" tile>
                    <img src="../assets/logo.png" alt="UniGoals">
                </v-avatar>
            </v-btn>
        </v-toolbar>
    </div>
</template>

<script>
  import firebaseWrapper from '../libs/firebaseWrapper';

  export default {
    name: 'ToolBarNavigation',
    props: {
      show: false
    },
    data: () => ({
      drawer: null,
      name: "",
      image: "",
    }),
    created() {
      this.$watch("drawer", (newVal) => {
        if (newVal != null) {
          const user = firebaseWrapper.getCurrentUser();

          if (!_.isNil(user)) {
            this.name = `${user.email}`;
            this.image = user.photoURL;
          }
        }
      });
    },
  };
</script>

<style scoped>
</style>