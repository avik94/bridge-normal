<template>
  <v-container>
    <div class="text-right pb-2">
      <!-- <div class="text-center" v-if="loader">
        <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
      </div> -->
      <div v-if="noData" class="text-center">
        <p>No Data Found</p>
      </div>
      <!--<div v-if="view">
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
      </div>-->
      <div id="barGraph"></div>     
      <!-- <vue-plotly :data="linedata.data" :layout="linedata.layout" :options="linedata.options" /> -->
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Plotly from 'plotly.js'
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
import { Component, Prop, Watch } from "vue-property-decorator";
@Component({
  components: {
    VuePlotly
  }
})
export default class BarChart extends Vue {

  view = false;
  noData = false;
  loader = true; //prev code

  @Prop() myProps;
  @Prop() parameter;

  @Watch("myProps", { deep: true })
  async myPropsChanged() {
    await this.processData(this.myProps); 
    console.log("bar chart property chnage");
  }

  async mounted() {
    await this.processData(this.myProps);
    console.log("bar chart mounted");
  }

  destroyed() {
    console.log("Bar Plot Destroy");
    clearInterval(this.interval); 
  }

  // line-plot start
  linedata1: any = {
    data: [
      {
        type: 'bar',
        x: [1, 2, 3, 4],
        y: [5, 10, 2, 8],
        marker: {
            color: '#C8A2C8',
            line: {
                width: 2.5
            }
        }
      }
    ],
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
        xref: "paper",
        x: 0.05
      },
      yaxis: {
        title: {
          text: "",
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
  layoutLivePlot = {
      yaxis: {
          title: {
              text: "y-axis"
          }
      },
  }

  interval:any = "";

  async processData(myProps: any) {
    console.log(this.myProps)
    if(this.myProps.quickTime && this.myProps.quickTime !== "livePlot") {
      this.linedata1.data = [];
       clearInterval(this.interval);
       const data = {
        "Company name": this.$store.state.companyName,
        "Zone name": this.myProps.zone,
        "Machine id": this.myProps.machine,
        "Machine name": this.myProps.machinePositionName,
        "Sensor": this.myProps.sensor,
        "Subassembly Instance": this.myProps.subassembly,
        "Collector name": this.myProps.collector,
        "Stat name": this.myProps.stat,
        "Unit": this.myProps.unit,
        "Quick Time Range": this.myProps.quickTime
      };
      console.log(data);
      const responseData = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/seismic_data/${this.$store.state.companyId}`,data);
      console.log(responseData.data.Health);
      console.log(this.linedata1);
      this.linedata1.data = responseData.data.Health;
      this.linedata1.layout.yaxis.title.text = responseData.data.Unit;
      Plotly.react(
          'barGraph',
          this.linedata1.data, this.linedata1.layout
      );
    }else if(this.myProps.startTime && this.myProps.endTime) {
      clearInterval(this.interval);
      this.linedata1.data = [];
      console.log("")
      const data = {
        "Company name": this.$store.state.companyName,
        "Zone name": this.myProps.zone,
        "Machine id": this.myProps.machine,
        "Machine name": this.myProps.machinePositionName,
        "Subassembly Instance": this.myProps.subassembly,
        "Collector name": this.myProps.collector,
        "Stat name": this.myProps.stat,
        "Unit": this.myProps.unit,
        "Intercept": this.myProps.interceptValue,
        "Slop": this.myProps.slope,
        "start date_time": this.myProps.startTime.toString(),
        "end date_time": this.myProps.endTime.toString()
      };
      console.log(data);
      const responseData = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/seismic_data/${this.$store.state.companyId}`,data);
      console.log(responseData.data)
      this.linedata1.data = responseData.data.Health;
      this.linedata1.layout.yaxis.title.text = responseData.data.Unit;
      Plotly.newPlot(
          'barGraph',
          this.linedata1.data, this.linedata1.layout
      );
    }else if(this.myProps.day1startTime && this.myProps.day2startTime) {
      clearInterval(this.interval);
      this.linedata1.data = [];
      console.log("Compare")
      const data = {
        "Company name": this.$store.state.companyName, 
        "Zone name": this.myProps.zone, 
        "Machine id": this.myProps.machine, 
        "Machine name": this.myProps.machinePositionName,
        "Subassembly Instance": this.myProps.subassembly, 
        "Collector name": this.myProps.collector, 
        "Stat name": this.myProps.stat, 
        "Axis": this.myProps.axisName, 
        "Unit": this.myProps.unit,
        "day1_start_time": this.myProps.day1startTime.toString(), 
        "day1_end_time": this.myProps.day1endTime.toString(), 
        "day2_start_time": this.myProps.day2startTime.toString(),
        "day2_end_time": this.myProps.day2endTime.toString(),
      }
      console.log(data);
      const responseData = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/compare_data/${this.$store.state.companyId}`,data);
      console.log(responseData.data);
      this.linedata1.data = responseData.data.Health;
      this.linedata1.layout.yaxis.title.text = responseData.data.Unit;
      console.log("bar data")
      Plotly.newPlot(
          'barGraph',
          this.linedata1.data, this.linedata1.layout
      );
    }else if(this.myProps.quickTime === "livePlot") {
      this.liveUpdateChart();
      console.log("live Bar Plot")
    }
    
  }

  async liveUpdateChart() {
    clearInterval(this.interval);
    var time = new Date();

    var data = [{
        x: [],
        y: [],
        type: 'bar',
        line: {color: '#80CAF6'}
    }]
    console.log(data)
    // @ts-ignore
    Plotly.newPlot('barGraph', data, this.layoutLivePlot);
    this.interval = setInterval( async()=>{
            var time = new Date();
            // this.generateTimeData();
             const data = {
                "Company name": this.$store.state.companyName,
                "Zone name": this.myProps.zone,
                "Machine id": this.myProps.machine,
                "Machine name": this.myProps.machinePositionName,
                "Sensor": this.myProps.sensor,
                "Subassembly Instance": this.myProps.subassembly,
                "Collector name": this.myProps.collector,
                "Stat name": this.myProps.stat,
                "Unit": this.myProps.unit,
                "Quick Time Range": "2m"
              };
            let responseData = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/seismic_data/${this.$store.state.companyId}`, data);
            console.log(responseData.data.Health[0].y[responseData.data.Health[0].y.length-1]);
            this.layoutLivePlot.yaxis.title.text = responseData.data.Unit;
            
            const update = {
                  x:  [[time.getTime()]],
                  y: [[responseData.data.Health[0].y[responseData.data.Health[0].y.length-1]]]
              } 
            var olderTime = time.setMinutes(time.getMinutes() - 2);
            var futureTime = time.setMinutes(time.getMinutes() + 2);

            var minuteView = {
                    xaxis: {
                    type: 'date',
                    range: [olderTime,futureTime]
                    }
                };
            // @ts-ignore
            Plotly.relayout('barGraph', minuteView);
            console.log(update);
            // @ts-ignore
            Plotly.extendTraces('barGraph', update, [0])
        }, 3000)
  }
}
</script>
