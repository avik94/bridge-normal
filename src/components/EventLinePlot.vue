<template>
  <v-container>
    <div class="text-right pb-2">
      <div class="text-center" v-if="loader">
        <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
      </div>
      <div v-if="noData" style="text-align:center;">
        <p>No Data Found</p>
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
export default class EventLinePlot extends Vue {
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
  eventTrapThresholdVal = 0;
  // loader = true;

  data() {
    return {
      eventTrapValue: 0
    };
  }

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
      },
      // working sectiom, dont remove
      shapes: [
        {
          type: "line",
          xref: "paper",
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 0,

          line: {
            color: "",
            width: 0,
            dash: ""
          }
        }
      ],

      annotations: [
        {
          x: 0,
          y: 0,
          xref: "x",
          yref: "y",
          text: "",
          showarrow: false,
          arrowhead: 4,
          ax: 0,
          ay: -80,
          font: {
            size: 16,
            color: "#000"
          },
          arrowcolor: "#000"
        }
      ]
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
        "Quick Time Range": myProps["Quick Time Range"]
      };

      // console.log("Data got in eventline plot component: ", allData);

      let responseData = {};
      this.linedata.data = [];

      // api call
      let companyId = this.$store.state.companyId;
      if (companyId) {
        //@ts-ignore
        responseData = await this.$http.post(
          `/bridge/analytics/event_lineplot/${companyId}`,
          allData
        );
        // console.log(responseData.data);
      }

      /*  */
      // end call
      if (
        //@ts-ignore
        responseData.data["Lineplot data"]["TimeStamp"] === "No Data Found" ||
        //@ts-ignore
        responseData.data["Lineplot data"]["values"] === "No Data Found"
      ) {
        this.noData = true;
        //@ts-ignore
        this.loader = false;
        this.view = false;
      } else {
        //@ts-ignore
        let xAxis: any = responseData.data["Lineplot data"]["TimeStamp"];
        //@ts-ignore
        let yAxis: any = responseData.data["Lineplot data"]["values"];
        let d: any;
        let currDate: any;
        let currMonth: any;
        let currYear: any;
        let currTime: any;
        //@ts-ignore
        this.eventTrapValue = responseData.data["Eventtrap Threshold"];
        //@ts-ignore
        this.eventTrapThresholdVal = this.eventTrapValue;
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

        let data = {
          x: xAxis,
          y: yAxis,
          type: "line",
          name: "Value",
          // mode: "text", //
          // text: "lower threshold", //
          showlegend: true
        };

        this.linedata["layout"]["shapes"][0].y0 = this.eventTrapThresholdVal;
        this.linedata["layout"]["shapes"][0].y1 = this.eventTrapThresholdVal;
        this.linedata["layout"]["shapes"][0]["line"]["color"] =
          "rgb(255, 0, 0)";
        this.linedata["layout"]["shapes"][0]["line"]["width"] = 2;
        this.linedata["layout"]["shapes"][0]["line"]["dash"] = "line";

        this.linedata["layout"]["annotations"][0]["text"] = "Threshold";
        this.linedata["layout"]["annotations"][0]["showarrow"] = true;
        this.linedata["layout"][
          "annotations"
        ][0].x = this.eventTrapThresholdVal;
        this.linedata["layout"][
          "annotations"
        ][0].y = this.eventTrapThresholdVal;

        this.linedata.data.push(data);
      }
      this.view = true;
      //@ts-ignore
      this.loader = false;
      this.noData = false;
    } catch (error) {
      console.log("Something went wrong, please try again later.", error);
    }
  }
}
</script>