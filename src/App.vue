<template>
  <!--<v-app>
      <v-app-bar app>
        <v-toolbar-title class="headline text-uppercase">
          <span>Vuetify</span>
          <span class="font-weight-light">MATERIAL DESIGN</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          text
          href="https://github.com/vuetifyjs/vuetify/releases/latest"
          target="_blank"
        >
          <span class="mr-2">Latest Release</span>
        </v-btn>
      </v-app-bar>

      <v-content>
      </v-content>
  </v-app>-->
  <v-app>
    <Navigation :pageTitle="pageTitle" />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Navigation from "./components/Navigation/Navigation.vue";
import axios from 'axios';

@Component({
  components: {
    Navigation
  },
})
export default class App extends Vue {
  pageTitle!: string;

  @Watch("$route")
  onRouteChanged(to: string, from: string) {
    //@ts-ignore
    this.pageTitle = to.meta.title;
    //@ts-ignore
    if(to.meta.title === "Variable Mart"){
      //@ts-ignore
      this.pageTitle = to.params.bridgeName;
    }
  }
  async created() {
    //@ts-ignore
    this.pageTitle = this.$router.currentRoute.meta.title;
    // console.log(this.pageTitle)
    // console.log(this.$route.params.companyId);
    this.$store.commit('storeCompanyId', this.$route.params.companyId);
    const companyName = await axios.get(`http://40.87.93.175:5000/api/company/${this.$route.params.companyId}`);
    // console.log(companyName.data.name);
    this.$store.commit('storeCompanyName', companyName.data.name);

    console.log(this.$store.state.companyId);
    console.log(this.$store.state.companyName);

  }
}
</script>
