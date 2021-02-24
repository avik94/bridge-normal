<template>
  <v-container>
    <div class="text-right pb-2">
      <!-- <div class="text-center" v-if="loader">
        <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
      </div> -->
      <div v-if="noData" style="text-align: center;">
        <p>No Data Found</p>
      </div>
      <div v-if="livePlotView">
        <v-select 
              label="Choose Axis" 
              item-text="name"
              item-value="value"
              v-model="chooseAxis"
              @input="liveUpdateChart()" 
              :items="axisItem">
        </v-select>
        <div id="LiveGraph"></div>
      </div>

      <div v-if="staticPlotView">
        <div id="statcGraph"></div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Plotly from 'plotly.js';
import {Component, Prop, Watch} from "vue-property-decorator";

@Component
export default class LinePlot extends Vue {
  @Prop() myProps;
  livePlotView = false;
  staticPlotView = false;
  interval:any = "";
  chooseAxis:any = "";
  axisItem = [{ name:"X-axis", value: 0 }, { name:"Y-axis", value: 1 }, { name:"Z-axis", value: 2 }];
  noData = false;
  loader = true;
  propChange: boolean | undefined;
 
  $http: any;

  xAxis: object = {};
  yAxis: object = {};
  zAxis: object = {};

  @Watch("myProps", {deep: true})
  async myPropsChanged() {
    clearInterval(this.interval);
    this.livePlotView = true;
    this.noData = false;
    //@ts-ignore
    this.loader = true;
    console.log("props Changed");
    await this.processData(this.myProps);
    console.log("hi")
  }

  linedata2:any = {
    data: [ ],
    layout: {
      autosize: false,
      width: 1010,
      height: 450,
      title: {
        text: "",
        font: {
          family: "Courier New, monospace",
          size: 17,
          align: 'center'
        },
        xref: "paper",
        x: 0.5
      },
      yaxis: {
        title: {
          text: '',
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

  layoutLivePlot = {
      yaxis: {
          title: {
              text: "y-axis"
          }
      },
  }

  async mounted() {
    console.log("mounted in line plot");
    await this.processData(this.myProps);
  }

  destroyed() {
    console.log("line Plot Destroy");
    clearInterval(this.interval);
  }

  async processData(myProps: any) {
    if (this.myProps.quickTime && this.myProps.quickTime !== "livePlot") {
      this.livePlotView = false;
      this.staticPlotView = true;
      const data = {
          "Company name": this.$store.state.companyName,
          "Zone name": this.myProps.zone,
          "Machine name": this.myProps.machine,
          "Sensor": this.myProps.sensor,
          "Subassembly Instance": this.myProps.subassembly,
          "Collector name": this.myProps.collector,
          "Stat name": this.myProps.stat,
          "Unit": this.myProps.unit,
          "Quick Time Range": this.myProps.quickTime
        };
        let responseData = await this.$http.post(`/bridge/analytics/processed_data/${localStorage.getItem("cmpnyId")}`, data);
        clearInterval(this.interval);
        this.linedata2.data = [];
        setTimeout(()=>{
          this.generateChart(responseData.data);
        }, 500)
    } else if(this.myProps.quickTime === "livePlot") {
      console.log("live Chart")
    //   Plotly.newPlot(
    //     'statcGraph',
    //     []
    // );
      this.livePlotView = true;
      this.staticPlotView = false;
      this.chooseAxis = 2;
      setTimeout(()=>{
        this.liveUpdateChart();
      }, 500)
    }else if(this.myProps.startTime && this.myProps.endTime) {
      console.log("Custom Time")
      this.livePlotView = false;
      this.staticPlotView = true;
      clearInterval(this.interval);
      const data = {
        "Company name": this.$store.state.companyName,
        "Zone name": this.myProps.zone,
        "Machine name": this.myProps.machine,
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
      let responseData = await this.$http.post(`/bridge/analytics/processed_data/${localStorage.getItem("cmpnyId")}`, data);
      clearInterval(this.interval);
      this.linedata2.data = [];
      setTimeout(()=>{
        this.generateChart(responseData.data);
      }, 500)
    }else if(this.myProps.day1startTime && this.myProps.day2startTime) {
      console.log("compare");
      this.livePlotView = false;
      this.staticPlotView = true;
      const data = {
        "Company name": this.$store.state.companyName, 
        "Zone name": this.myProps.zone, 
        "Machine name": this.myProps.machine, 
        "Subassembly Instance": this.myProps.subassembly, 
        "Collector name": this.myProps.collector, 
        "Stat name": this.myProps.stat, 
        "Axis": this.myProps.axisName, 
        "Unit": this.myProps.unit,
        "day1_start_time": this.myProps.day1startTime.toString(), 
        "day1_end_time": this.myProps.day1endTime.toString(), 
        "day2_start_time": this.myProps.day2startTime.toString(),
        "day2_end_time": this.myProps.day2endTime.toString(),
        // "time_range": this.myProps.previousday.toString()
      }
      console.log(data);
      let responseData = await this.$http.post(`/bridge/analytics/compare_data/${localStorage.getItem("cmpnyId")}`, data);
      clearInterval(this.interval);
      this.linedata2.data = [];
      setTimeout(()=>{
        this.generateChart(responseData.data);
      }, 500)
    }
  }

  async generateChart(data) {
    console.log(data)
    if (data["TimeStamp"] === "No Data Found" || data["X-Axis"] === "No Data Found" || data["Y-Axis"] === "No Data Found" || data["Z-Axis"] === "No Data Found") {
        console.log('No Data');
    }else {
      this.linedata2.data = data.Trend
      if(this.myProps.unit === "Unitless"){
        this.linedata2.layout.yaxis.title.text = "";
      }else{
        this.linedata2.data = data.Trend
        console.log(this.linedata2.data)
        this.linedata2.layout.yaxis.title.text = this.myProps.unit;  
      }
    }
    console.log(this.linedata2.data)
    Plotly.newPlot(
        'statcGraph',
        this.linedata2.data, this.linedata2.layout
    );
  }

  async liveUpdateChart() {
    clearInterval(this.interval);
    if(this.myProps.unit === "Unitless") {
      this.layoutLivePlot.yaxis.title.text = "";
    }else{
      this.layoutLivePlot.yaxis.title.text = this.myProps.unit;
    }
    console.log(this.myProps.unit);
    var time = new Date();
    // var data  = responseData.data.Trend[1];
    // x: responseData.data.Trend[1].x,
    // y: responseData.data.Trend[1].y,

    var data = [{
        x: [],
        y: [],
        type: 'lines',
        line: {color: '#80CAF6'}
    }]
    console.log(data)
    // @ts-ignore
    Plotly.newPlot('LiveGraph', data, this.layoutLivePlot);
    this.interval = setInterval( async()=>{
            var time = new Date();
            // this.generateTimeData();
             const data = {
                "Company name": this.$store.state.companyName,
                "Zone name": this.myProps.zone,
                "Machine name": this.myProps.machine,
                "Sensor": this.myProps.sensor,
                "Subassembly Instance": this.myProps.subassembly,
                "Collector name": this.myProps.collector,
                "Stat name": this.myProps.stat,
                "Unit": this.myProps.unit,
                "Quick Time Range": "2m"
              };
            let responseData = await this.$http.post(`/bridge/analytics/processed_data/${this.$store.state.companyId}`, data);
            console.log(responseData.data.Trend[this.chooseAxis].y[responseData.data.Trend[this.chooseAxis].y.length-1]);
            // const update = {
            //       x:  [[time.getTime()]],
            //       y: [[Math.random()]]
            //   }
            const update = {
                  x:  [[time.getTime()]],
                  y: [[responseData.data.Trend[this.chooseAxis].y[responseData.data.Trend[this.chooseAxis].y.length-1]]]
              }  
            // setTimeout(async ()=>{
            //   this.update = {
            //       x:  [[time.getTime()]],
            //       y: [[Math.random()]]
            //   }
            // }, 2000)
            var olderTime = time.setMinutes(time.getMinutes() - 2);
            var futureTime = time.setMinutes(time.getMinutes() + 2);

            var minuteView = {
                    xaxis: {
                    type: 'date',
                    range: [olderTime,futureTime]
                    }
                };
            // @ts-ignore
            Plotly.relayout('LiveGraph', minuteView);
            console.log(update);
            // @ts-ignore
            Plotly.extendTraces('LiveGraph', update, [0])
        }, 3000)
  }
}
</script>
