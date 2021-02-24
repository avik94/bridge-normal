<template>
  <v-container>
    <div class="text-right pb-2">
      <div class="text-center" v-if="loader">
        <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
      </div>
      <div v-if="noData" style="text-align: center;">
        <p>No FFT Frequency and Amplitude Found</p>
      </div>
      <div v-if="view">
        <v-hover>
          <template v-slot="{ hover }">
            <v-btn
              fab
              small
              text
              :elevation="hover ? 4 : 0"
              color="light-green accent-4"
              title="compare"
            >
              <v-icon size="30">mdi-compare</v-icon>
            </v-btn>
          </template>
        </v-hover>
      </div>
      <vue-plotly :data="linedata.data" :layout="linedata.layout" :options="linedata.options" />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
import { Component, Prop, Watch } from "vue-property-decorator";
@Component({
  components: {
    VuePlotly
  }
})
export default class LinePlot extends Vue {
  @Prop() myProps;

  @Watch("myProps", { deep: true })
  async myPropsChanged() {
    this.view = false;
    this.noData = false;
    //@ts-ignore
    this.loader = true;
    await this.processData();
  }

  view = false;
  noData = false;
  loader = true;

  async mounted() {
    await this.processData();
  }

  // line-plot start
  linedata: any = {
    data: [],
    layout: {
      autosize: false,
      width: 1010,
      height: 450,
      title: {
        // text: "Frequency",
        // font: {
        //   family: "Courier New, monospace",
        //   size: 17,
        //   align: "center"
        // },
        /* shapes: [ // newly added array
          type: "line",
          xref: "paper",
          x0: 0,
          y0: 12.0,
          x1: 1,
          y1: 12.0,
          line: {
            color: "red",
            width: 4
          }
        ] */
        xref: "paper", // previously added
        x: 0.05 // previously added
      },
      xaxis: {
        title: {
          text: "Frequency",
          font: {
            family: "Courier New, monospace",
            size: 17,
            align: "center"
          }
        }
      },
      yaxis: {
        title: {
          text: "Amplitude",
          font: {
            family: "Courier New, monospace",
            size: 17,
            color: "#7f7f7f"
          }
        }
      }
    },
    options: {}
  };
  // line-plot end

  async processData() {
    try {
      let allData = {
        "Company name": this.$store.state.companyName,
        "Zone name": this.myProps["Zone name"],
        "Machine name": this.myProps["Machine name"],
        // Axis: this.myProps["Axis"],
        "sample rate": this.myProps["sample rate"],
        "number of samples": this.myProps["number of samples"],
        Duration: this.myProps["Duration"]
      };

      // api call
      let responseData = {};
      this.linedata.data = [];

      // api call
      let companyId = this.$store.state.companyId;
      if (companyId) {
        //@ts-ignore
        responseData = await this.$http.post(
          `/bridge/analytics/edge_fft_data/${companyId}`,
          allData
        );
        // console.log("Spec Line Plot data:", responseData.data);
      }
      //@ts-ignore
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
        this.view = false;
      } else {
        let xAxis: any = [];
        let xfftData: any = [];
        let yfftData: any = [];
        let zfftData: any = [];

        // @ts-ignore
        if (responseData.data["Frequency"]) {
          //@ts-ignore
          responseData.data["Frequency"].forEach(
            (item: string, lineIndex: number) => {
              // yAxis.push(item); //previous code
              xAxis.push(item);
            }
          );
        }

        //@ts-ignore
        if (responseData.data["X_fft"]) {
          //@ts-ignore
          responseData.data["X_fft"].forEach(
            (item: string, lineIndex: number) => {
              // yAxis.push(item); //previous code
              xfftData.push(item);
            }
          );
        }

        //@ts-ignore
        if (responseData.data["Y_fft"]) {
          //@ts-ignore
          responseData.data["Y_fft"].forEach(
            (item: string, lineIndex: number) => {
              // yAxis.push(item); //previous code
              yfftData.push(item);
            }
          );
        }

        //@ts-ignore
        if (responseData.data["Z_fft"]) {
          //@ts-ignore
          responseData.data["Z_fft"].forEach(
            (item: string, lineIndex: number) => {
              // yAxis.push(item); //previous code
              zfftData.push(item);
            }
          );
        }

        // let data = {
        //   x: xAxis,
        //   y: yAxis,
        //   type: "line",
        //   showlegend: true
        // };

        // let freqData = {
        //   x: xAxis,
        //   type: "line",
        //   showlegend: true
        //   name: "Frequency"
        // };

        let xFFTData = {
          x: xAxis,
          y: xfftData,
          type: "line",
          showlegend: true,
          name: "X-FFT"
        };

        let yFFTData = {
          x: xAxis,
          y: yfftData,
          type: "line",
          showlegend: true,
          name: "Y-FFT"
        };

        let zFFTData = {
          x: xAxis,
          y: zfftData,
          type: "line",
          showlegend: true,
          name: "Z-FFT"
        };

        //@ts-ignore
        // this.linedata.data.push(freqData);
        this.linedata.data.push(xFFTData);
        this.linedata.data.push(yFFTData);
        this.linedata.data.push(zFFTData);

        this.view = true;
        //@ts-ignore
        this.loader = false;
        this.noData = false;
      }
    } catch (error) {
      console.log("Something went wrong, please try again later.", error);
    }
  }
}
</script>

