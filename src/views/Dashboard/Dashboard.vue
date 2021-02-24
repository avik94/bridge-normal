<template>
  <v-container>
    <v-row>
      <!-- <v-col sm="5" md="6" lg="6"> -->

      <div v-if="showLoader" class="loc-loader">
        <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
      </div>
      <!-- <v-col v-for="bridge in bridgeItems" :key="bridge"> -->
      <v-col v-for="(bridge) in bridgeData" :key="bridge.location">
        <v-card v-if="showBridges" elevation="0">
          <v-list-item>
            <v-list-item-avatar tile size="80" color="indigo darken-4" class="elevation-4">
              <v-icon color="white" size="50">mdi-bridge</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <!-- <div class="headline mb-1">Bridge 1</div> -->
              <div class="headline mb-1">{{ bridge.location }}</div>
              </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <div class="subtitle-2 font-weight-bold">Functional Sensors: ( {{ bridge.sensors }} )</div>
          </v-list-item>
          <!--<v-list-item v-for="i in sensorIng">
                        <v-img :src="i.img"></v-img>
          </v-list-item>-->
          <!--<v-list-item>
            <div class="subtitle-2 font-weight-bold">Total Alarms</div>
          </v-list-item>-->
          <v-list-item>
            <v-row>
              <v-col cols="6" class="pt-0">
                <!--<v-list-item class="pl-0">
                  &lt;!&ndash;<img src='../../assets/images/red_warning.png' width="40">
                                    <img src='../../assets/images/green_warning.png' width="40">
                  <img src='../../assets/images/yellow_warning.png' width="40">&ndash;&gt;

                  <v-icon color="red accent-4" size="40" class="pr-4">mdi-alarm-light</v-icon>2
                  <v-icon color="amber darken-1" size="40" class="pr-4">mdi-alarm-light</v-icon>2
                  <v-icon color="light-green accent-4" size="40">mdi-alarm-light</v-icon>2
                </v-list-item>-->
              </v-col>
              <v-col cols="6">
                <div class="my-2 float-right">
                  <v-btn
                    outlined
                    color="primary"
                    @click ="routeBridge('/view-bridge-data/'+bridge.location)"
                  >
                    <v-icon>mdi-arrow-right-bold</v-icon>
                  </v-btn>
                  <!-- <v-btn outlined color="primary">
                    <router-link :to="'/view-bridge/${route.params.locationName}'"></router-link>
                  </v-btn>-->
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.loc-loader {
  margin: 0 auto;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class Dashboard extends Vue {
  data() {
    return {
      showLoader: false,
      showBridges: false,
      bridgeItems: [],
      bridgeData: []
    };
  }

  async initialize() {
    try {
      //@ts-ignore
      this.showLoader = true;
      //@ts-ignore
      this.showBridges = false;
      if (this.$store.state.companyId) {
        //@ts-ignore
        this.response = await this.$http.post(
          `/bridge/analytics/update_location/${this.$store.state.companyId}`,
          {
            "Company id": this.$store.state.companyId
          }
        );
        //@ts-ignore
        this.bridgeItems = this.response.data.location_list;

        //@ts-ignore
        this.response.data["location_list"].forEach((item, index) => {
          //@ts-ignore
          this.bridgeData.push({
            location: item,
            //@ts-ignore
            sensors: this.response.data["functional_sensors"][index]
          });
        });

        //@ts-ignore
        if (this.bridgeItems) {
          //@ts-ignore
          this.showLoader = false;
          //@ts-ignore
          this.showBridges = true;
        }
      }
    } catch (error) {
      console.log("Something went wrong, please try again later.");
    }
  }

  async created() {
    await this.initialize();
  }

  routeBridge(routeName){
    this.$router.push(routeName);
    // let x = routeName.split('/');
    // this.$store.commit('storeLocation', x[x.length-1]);
    // console.log(this.$store.state.location)
  }
}
</script>
