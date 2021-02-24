<template>
  <v-container>
    <div class="text-right pb-2">
      <div class="text-center" v-if="loader">
        <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
      </div>
      <div v-if="noData" style="text-align: center;">
        <p>No Event data available for FFT</p>
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
    </div>
    <vue-plotly :data="linedata.data" :layout="linedata.layout" :options="linedata.options" />
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
export default class EventTrapFFTPlot extends Vue {
  @Prop() myProps;

  @Watch("myProps", { deep: true })
  async myPropsChanged() {
    this.view = false;
    this.noData = false;
    //@ts-ignore
    this.loader = true;
    await this.processData(); // threshold may change later
  }

  view = false;
  noData = false;
  // loader = true;

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
        text: "Timestamp",
        font: {
          family: "Courier New, monospace",
          size: 17,
          align: "center"
        },
        xref: "paper", // previous code
        x: 0.05 // previous code
      },
      // xaxis: {
      //   title: {
      //     text: "Timestamp",
      //     font: {
      //       family: "Courier New, monospace",
      //       size: 17,
      //       align: "center"
      //     }
      //   }
      // },
      yaxis: {
        title: {
          text: "Values",
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
        "Subassembly Instance": this.myProps["Subassembly Instance"],
        "Collector name": this.myProps["Collector name"],
        "Parameter name": this.myProps["Parameter name"],
        "Stat name": this.myProps["Stat name"],
        "Unit name": this.myProps["Unit name"],
        "Quick Time Range": this.myProps["Quick Time Range"],
        "User chosen time": this.myProps["User chosen time"],
        sample_rate: this.myProps["sample_rate"]
      };

      //   console.log("Data got in eventtrapfftplot data component: ", allData);

      let responseData = {};
      this.linedata.data = [];

      // api call
      let companyId = this.$store.state.companyId;
      if (companyId) {
        //@ts-ignore
        responseData = await this.$http.post(
          `/bridge/analytics/event_fft_plot/${companyId}`,
          allData
        );
      }

      /*  */
      // end call
      //@ts-ignore
      if (responseData.data.Reason === "No Event data available for FFT") {
        this.noData = true;
        //@ts-ignore
        this.loader = false;
        this.view = false;
      } else {
        let xAxis: any = [];
        let yAxis: any = [];
        let d: any;
        let currDate: any;
        let currMonth: any;
        let currYear: any;
        let currTime: any;
        //@ts-ignore
        if (responseData.data["TimeStamp"]) {
          //@ts-ignore
          responseData.data["TimeStamp"].forEach(
            (item: string, lineIndex: number) => {
              d = new Date(item);
              d = d
                .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                .toString();

              currDate = new Date(d).getDate();

              currMonth = new Date(d).getMonth();
              currYear = new Date(d).getFullYear();
              currTime = new Date(d).toString().split(" ")[4];

              xAxis.push(
                currDate + "-" + currMonth + "-" + currYear + " " + currTime
              );
            }
          );
        }
        //@ts-ignore
        if (responseData.data["Amplitude"]) {
          //@ts-ignore
          responseData.data["Amplitude"].forEach(
            (item: string, lineIndex: number) => {
              yAxis.push(item);
            }
          );
        }
        //@ts-ignore
        if (responseData.data["Frequency"]) {
          //@ts-ignore
          responseData.data["Frequency"].forEach(
            (item: string, lineIndex: number) => {
              yAxis.push(item);
            }
          );
        }

        let data = {
          x: xAxis,
          y: yAxis,
          type: "line",
          showlegend: true
        };

        this.linedata.data.push(data);
        // this.linedata.layout.title.text = responseData["TimeStamp"].Title[0];
        // this.linedata.layout.yaxis.title.text = responseData["values"].Unit[0];
      }

      this.view = true;
      //@ts-ignore
      this.loader = false;
      this.noData = false;
    } catch (error) {
      console.log("Something went wrong, please try again later.");
    }
  }
}
</script>
