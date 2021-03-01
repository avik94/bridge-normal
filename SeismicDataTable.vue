<template>
  <v-container>
    <!-- <div v-if="showLoader" class="text-center">
      <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
    </div>-->
    <div v-if="noData">
      <p>No Data Found</p>
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
          <download-csv btn class="btn btn-default" :data="tableData" :name="fileName">
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
        <v-data-table :headers="headers" :items="tableData" :search="search" :items-per-page="5"></v-data-table>
      </v-card-text>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import JsonCSV from "vue-json-csv";
import axios from "axios";

@Component
export default class DataTable extends Vue {
  @Prop() myProps;

  search = "";
  tableData = [];
  // showLoader = false;
  showTable = false;
  fileName = " ";
  headers: any = [
      { text: "Time Stamp", value: "timeStamp" },
      { text: "Value", value: "value" },
    ];

  @Watch("myProps", { deep: true })
  async myPropsChanged(val: any, oldVal: string) {
    // console.log("data table props-lifecycle");
    // this.noData = false;
    this.showTable = false;

    let response = await this.dataFunction();
    this.showTable = true;
    // this.fileName = this.myProps.sensor+'.csv';
  }

  async created() {
    // console.log("data table created-lifecycle");
    // this.showLoader = true;
    this.showTable = false;

    let response = await this.dataFunction();
    this.showTable = true;
  }

  async dataFunction() {
    if(this.myProps.quickTime) {
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
      console.log(responseData.data)
      let dataSet:any = []
      responseData.data.Trend[0].x.forEach((el,index)=> {
        dataSet.push({
          timeStamp: el,
          value: responseData.data.Trend[0].y[index]
          /* xaxis: responseData.data.Trend[0].y[index],
          yaxis: responseData.data.Trend[1].y[index],
          zaxis: responseData.data.Trend[2].y[index], */
        })
      });
      console.log(dataSet)
      this.tableData = dataSet;
    }else{
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
      let dataSet:any = []
      responseData.data.Trend[0].x.forEach((el,index)=> {
        dataSet.push({
          timeStamp: el,
          xaxis: responseData.data.Trend[0].y[index],
          yaxis: responseData.data.Trend[1].y[index],
          zaxis: responseData.data.Trend[2].y[index],
        })
      });
      console.log(dataSet)
      this.tableData = dataSet;
    }
    this.fileName = this.myProps.machine+".csv";
  }
}
</script>
