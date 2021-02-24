<template>
  <v-container>
    <div class="text-right pb-2">
      <div class="text-center" v-if="loader">
        <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
      </div>
      <div v-if="noData" style="text-align:center;">
        <p>No Raw Data found</p>
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
export default class EventTrapRawData extends Vue {
  @Prop() myProps;

  @Watch("myProps", { deep: true })
  async myPropsChanged() {
    this.view = false;
    this.noData = false;
    //@ts-ignore
    this.loader = true;
    await this.processData(this.myProps); // threshold may change later
  }

  view = false;
  noData = false;
  // loader = true;

  async mounted() {
    await this.processData(this.myProps);
  }

  // line-plot start
  linedata: any = {
    data: [],
    layout: {
      autosize: false,
      width: 1010,
      height: 450,
      title: {
        // text: "Timestamp",
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
          // text: "Values",
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

  async processData(myProps: any) {
    try {
      let allData = {
        "Company name": this.$store.state.companyName,
        "Zone name": myProps["Zone name"],
        "Machine name": myProps["Machine name"],
        "Subassembly Instance": myProps["Subassembly Instance"],
        "Collector name": myProps["Collector name"],
        "Parameter name": myProps["Parameter name"],
        "Stat name": myProps["Stat name"],
        "Unit name": myProps["Unit name"],
        "Quick Time Range": myProps["Quick Time Range"],
        "User chosen time": myProps["User chosen time"]
      };

      // console.log("Data got in eventtrap raw data component: ", allData);

      let responseData = {};
      this.linedata.data = [];

      // api call
      let companyId = this.$store.state.companyId;
      if (companyId) {
        //@ts-ignore
        responseData = await this.$http.post(
          `/bridge/analytics/event_rawdata/${companyId}`,
          allData
        );
      }

      /*  */
      // end call

      if (
        //@ts-ignore
        responseData.data["Eventtrap_X"].length == 0 &&
        //@ts-ignore
        responseData.data["Eventtrap_Y"].length == 0 &&
        //@ts-ignore
        responseData.data["Eventtrap_Z"].length == 0
      ) {
        console.log("empty array");
        this.noData = true;
        //@ts-ignore
        this.loader = false;
        this.view = false;
      } else {
        let xAxis: any = [];
        let yAxis: any = [];
        let zAxis: any = [];
        let d: any;
        let currDate: any;
        let currMonth: any;
        let currYear: any;
        let currTime: any;

        //@ts-ignore
        if (responseData.data["Eventtrap_X"]) {
          //@ts-ignore
          responseData.data["Eventtrap_X"].forEach(
            (item: string, lineIndex: number) => {
              xAxis.push(item);
            }
          );
        }

        //@ts-ignore
        if (responseData.data["Eventtrap_Y"]) {
          //@ts-ignore
          responseData.data["Eventtrap_Y"].forEach(
            (item: string, lineIndex: number) => {
              yAxis.push(item);
            }
          );
        }

        //@ts-ignore
        if (responseData.data["Eventtrap_Z"]) {
          //@ts-ignore
          responseData.data["Eventtrap_Z"].forEach(
            (item: string, lineIndex: number) => {
              zAxis.push(item);
            }
          );
        }

        //@ts-ignore
        // if (responseData.data["Lineplot data"]["TimeStamp"]) {
        //   //@ts-ignore
        //   responseData.data["Lineplot data"]["TimeStamp"].forEach(
        //     (item: string, lineIndex: number) => {
        //       d = new Date(item);
        //       d = d
        //         .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        //         .toString();

        //       currDate = new Date(d).getDate();

        //       currMonth = new Date(d).getMonth();
        //       currYear = new Date(d).getFullYear();
        //       currTime = new Date(d).toString().split(" ")[4];

        //       xAxis.push(
        //         currDate + "-" + currMonth + "-" + currYear + " " + currTime
        //       );
        //     }
        //   );
        // }
        //@ts-ignore
        // if (responseData.data["Lineplot data"]["values"]) {
        //   //@ts-ignore
        //   responseData.data["Lineplot data"]["values"].forEach(
        //     (item: string, lineIndex: number) => {
        //       yAxis.push(item);
        //     }
        //   );
        // }

        let xData = {
          y: xAxis,
          type: "line",
          showlegend: true,
          name: "X"
        };

        let yData = {
          y: yAxis,
          type: "line",
          showlegend: true,
          name: "Y"
        };

        let zData = {
          y: zAxis,
          type: "line",
          showlegend: true,
          name: "Z"
        };

        this.linedata.data.push(xData);
        this.linedata.data.push(yData);
        this.linedata.data.push(zData);

        // this.linedata.data.push(data); // previous code
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

