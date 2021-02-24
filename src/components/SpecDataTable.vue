<template>
  <v-container>
    <!-- <div v-if="showLoader" class="text-center">
      <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
    </div>-->
    <div v-if="noData">
      <p>No FFT Frequency and Amplitude Found</p>
    </div>
    <div>
      <v-card-text>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <div class="flex-grow-1"></div>
          <download-csv btn class="btn btn-default" :data="tableData" name="filename.csv">
            <v-hover>
              <template v-slot="{ hover }">
                <v-btn
                  fab
                  small
                  text
                  :elevation="hover ? 4 : 0"
                  color="light-green accent-4"
                  title="Download"
                >
                  <v-icon size="30">mdi-download</v-icon>
                </v-btn>
              </template>
            </v-hover>
          </download-csv>
        </v-card-title>
        <v-data-table :headers="headers" :items="tableData" :search="search" items-per-page="5"></v-data-table>
      </v-card-text>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { Component, Prop, Watch } from "vue-property-decorator";
import JsonCSV from "vue-json-csv";

@Component
export default class SpecDataTable extends Vue {
  @Prop() myProps;

  search = "";
  headers = [];
  tableData = [];
  showLoader = false;
  showTable = false;
  noData = false;

  @Watch("myProps", { deep: true })
  async myPropsChanged(val: any, oldVal: string) {
    // console.log("data table props-lifecycle");
    this.showLoader = true;
    //@ts-ignore
    this.noData = false;
    this.showTable = false;

    // function for api calling
    let responseData = await this.dataFunction(this.myProps);
    // console.log(responseData.data);

    let header: any = [
      { text: "Frequency", value: "frequency" },
      { text: "X-fft Amplitude", value: "xfftAmplitude" },
      { text: "Y-fft Amplitude", value: "yfftAmplitude" },
      { text: "Z-fft Amplitude", value: "zfftAmplitude" }
    ];

    this.headers = header;

    this.tableData = responseData.data["Frequency"];

    this.showLoader = false;
    this.showTable = true;
  }

  async created() {
    this.showLoader = true;
    this.showTable = false;

    let response = await this.dataFunction(this.myProps);

    let header: any = [
      { text: "Frequency", value: "frequency" },
      { text: "X-fft Amplitude", value: "xfftAmplitude" },
      { text: "Y-fft Amplitude", value: "yfftAmplitude" },
      { text: "Z-fft Amplitude", value: "zfftAmplitude" }
    ];

    this.headers = header;
    //@ts-ignore
    if (responseData.data) {
      //@ts-ignore
      this.tableData = responseData.data["Frequency"];
    }
    this.showLoader = false;
    this.showTable = true;
  }

  async dataFunction(myProps: any) {
    try {
      let allData = {
        "Company name": this.$store.state.companyName,
        "Zone name": myProps["Zone name"],
        "Machine name": myProps["Machine name"],
        // Axis: myProps["Axis"],
        "sample rate": myProps["sample rate"],
        "number of samples": myProps["number of samples"],
        Duration: myProps["Duration"]
      };

      let responseData = {};
      let data: any = [];

      // api call
      let companyId = this.$store.state.companyId;
      if (companyId) {
        //@ts-ignore
        responseData = await this.$http.post(
          `/bridge/analytics/edge_fft_data/${companyId}`,
          allData
        );

        //@ts-ignore
        if (responseData.data) {
          //@ts-ignore
          responseData.data["Frequency"].forEach((item, index) => {
            //@ts-ignore
            data.push({
              frequency: item,
              //@ts-ignore
              xfftAmplitude: responseData.data["X_fft"][index],
              //@ts-ignore
              yfftAmplitude: responseData.data["Y_fft"][index],
              //@ts-ignore
              zfftAmplitude: responseData.data["Z_fft"][index]
            });
          });
        }
        //@ts-ignore
        console.log("DATA GOT: ", data);
        //@ts-ignore
        this.tableData = data;
      }
      //@ts-ignore
      if (responseData.data) {
        if (
          //@ts-ignore
          responseData.data["Frequency"] === "No FFT Frequency" ||
          //@ts-ignore
          responseData.data["X_fft"] === "No FFT Amplitude" ||
          //@ts-ignore
          responseData.data["Y_fft"] === "No FFT Amplitude" ||
          //@ts-ignore
          responseData.data["Z_fft"] === "No FFT Amplitude"
        ) {
          this.noData = true;
          //@ts-ignore
          this.loader = false;
          //@ts-ignore
          this.view = false;
        } else {
          // populate data table
          //@ts-ignore
          return responseData.data;
        }
      }
    } catch (error) {
      console.log("Something went wrong, please try again later.", error);
    }
  }
}
</script>
