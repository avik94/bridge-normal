<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="5">
        <v-hover>
          <template v-slot="{ hover }">
            <v-card :elevation="hover ? 6 : 0">
              <v-img
                class="white--text"
                height="200px"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              ></v-img>
              <v-card-text>
                <v-row>
                  <v-col cols="9">
                    <div class="d-inline-flex">
                      <gallery :images="images" :index="index" @close="index = null"></gallery>
                      <div
                        class="image"
                        v-for="(image, imageIndex) in images"
                        :key="imageIndex"
                        @click="index = imageIndex"
                        :style="{ backgroundImage: 'url(' + image + ')', width: '50px', height: '50px' }"
                      ></div>
                    </div>
                  </v-col>
                  <v-col cols="3" class="d-flex align-self-center">
                    <div>
                      <v-btn outlined fab color="amber darken-4">
                        <v-icon>mdi-cloud-upload</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </template>
        </v-hover>
        <div class="mt-6">
          <v-textarea
            outlined
            name="input-7-4"
            label="Outlined textarea"
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          ></v-textarea>
          <div class="text-end">
            <v-btn color="primary">Submit</v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="7">
        <v-hover>
          <template v-slot="{ hover }">
            <v-card :elevation="hover ? 6 : 0">
              <v-card-title color-secondary font-1-4-em class="font-nunito">
                Sensor details
                <div class="flex-grow-1"></div>
                <v-btn icon color="amber darken-4">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <p class="font-weight-medium">Location:</p>
                <p class="font-weight-medium">Designation of road:</p>
                <p class="font-weight-medium">Chainage(0 at):</p>
                <p class="font-weight-medium">Value:</p>
                <p class="font-weight-medium">Bridge type:</p>
                <p class="font-weight-medium">Total length of the bridge:</p>
                <p class="font-weight-medium">Number of span:</p>
                <p class="font-weight-medium">Super structure:</p>
                <p class="font-weight-medium">Width of the Carriageway:</p>
              </v-card-text>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>

    <v-btn fixed right bottom fab color="amber darken-4" to="/view-bridge-data">
      <v-icon>mdi-filter</v-icon>
    </v-btn>
  </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import VueGallery from "vue-gallery";

@Component({
  components: {
    gallery: VueGallery
  }
})
export default class ViewBridge extends Vue {
  sensorIng = [
    { img: require("../../assets/images/sensor.png") },
    { img: require("../../assets/images/sensor.png") },
    { img: require("../../assets/images/sensor.png") },
    { img: require("../../assets/images/sensor.png") },
    { img: require("../../assets/images/sensor.png") }
  ];

  data() {
    return {
      images: [
        "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
        "https://dummyimage.com/1600/ffffff/000000",
        "https://dummyimage.com/1280/000000/ffffff",
        "https://dummyimage.com/400/000000/ffffff"
      ],
      index: null,
      loading5: false
    };
  }
}
</script>

<style lang="scss">
.image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 5px;
}
</style>
