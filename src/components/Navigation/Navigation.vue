<template>
  <div>
    <v-app-bar app class="elevation-0">
      <v-hover>
        <template v-slot="{ hover }">
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
            :elevation="hover ? 6 : 0"
            color="amber darken-4"
          ></v-app-bar-nav-icon>
        </template>
      </v-hover>
      <v-toolbar-title title="title">{{pageTitle}}</v-toolbar-title>
      <div class="flex-grow-1"></div>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" class="elevation-0">
      <v-card :raised="raise">
        <v-list color="indigo darken-4" dark>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                <v-img src="../../assets/images/logo.png"></v-img>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-list dense shaped>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.url">
          <v-list-item-icon>
            <v-icon color="amber darken-4" size="20">{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<!--TypeScript-->
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Navigation extends Vue {
  @Prop(String)
  public pageTitle!: string; 
  data() {
    return {
      raise: true,
      drawer: null,
      items: [
        { title: "View Bridge", icon: "mdi-view-dashboard", url: "/view-bride" },
        // { title: "Add Sensor", icon: "mdi-leak", url: "/add-sensor" },
        // { title: "Add Bridge", icon: "mdi-bridge", url: "/add-bridge" },
        // { title: "Alarm", icon: "mdi-alarm-light", url: "" },
        { title: "Alert Settings", icon: "mdi-cog", url: "/bridge/settings" },
        {
          title: "Spectrum Analysis",
          icon: "mdi-bridge",
          url: "/bridge/spectrum-analysis"
        },
        {
          title: "Event Trap",
          icon: "mdi-kubernetes",
          url: "/bridge/event-trap"
        }
      ],
      fav: true,
      menu: false,
      message: false,
      hints: true
      // title: "Page title"
    };
  }
}
</script>
<style lang="scss">
.theme--light.v-card {
  border-radius: 0;
}
</style>
