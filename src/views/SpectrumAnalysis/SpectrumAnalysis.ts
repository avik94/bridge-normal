import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import JsonCSV from "vue-json-csv";
import VuePlotly from "@statnett/vue-plotly";

import SpecLinePlot from "../../components/SpecLinePlot.vue";

import SpecDataTable from "../../components/SpecDataTable.vue";
import axios from 'axios';

Vue.component("downloadCsv", JsonCSV);

@Component({
    components: { VuePlotly, SpecLinePlot, SpecDataTable }
})

export default class SpectrumAnalysis extends Vue {
    public sampleRateVal = "";
    public noOfSamplesVal = "";
    // public sensorItemValue = "";
    // public timeRangeValue = "";
    // public timeRange = "";
    public edgefftObj = {};
    locationName = "";
    data() {
        return {
            loading: false,
            isCustomTime: false,
            spectrumStat: true,
            specForm: true,
            locationName: "",
            zoneItems: [],
            positionName: "",
            zoneName: "",
            bridgeItems: [],
            response: {},
            specDataTableData: {},
            specChartData: {},
            positionItems: [],
            timeoutValue: 4000,
            specSnackBar: false,
            specMsg: "",
            // sensorItems: [
            //     "X",
            //     "Y",
            //     "Z"
            // ],
            sampleRateItems: [
                "40",
                "250",
                "750",
                "1000",
                "2000"
            ],

            noOfSampleItems: [
                "512",
                "1024",
                "2048",
                "4096",
            ],

            // durationItems: [
            //     { "Duration": "Last 1 min" },
            //     { "Duration": "Last 2 mins" },
            //     { "Duration": "Last 3 mins" },
            //     { "Duration": "Last 5 mins" },
            // ],

            search: "",
            zoneRequired: [
                (v: boolean) => !!v || "Please Select Zone",
            ],
            bridgeRequired: [
                (v: boolean) => !!v || "Please Select Bridge",
            ],
            positionRequired: [
                (v: boolean) => !!v || "Please Select Position",
            ],
            // sensorRequired: [
            //     (v: boolean) => !!v || "Please Select Sensor",
            // ],
            sampleRateRequired: [
                (v: boolean) => !!v || "Please Select Sample Rate",
            ],
            noOfSampleRequired: [
                (v: boolean) => !!v || "Please Select Number of Samples",
            ],
            // durationRequired: [
            //     (v: boolean) => !!v || "Please Select Duration",
            // ]
        };
    }

    selectTable(table: any) {
        console.log(table);
    }

    async created() {
        await this.initialize();
    }

    async initialize() {

        // get location based on company id
        try {
            if (this.$store.state.companyId) {
                //@ts-ignore
                this.response = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/update_location/${this.$store.state.companyId}`, {
                    "Company id": this.$store.state.companyId,
                });
                //@ts-ignore
                this.bridgeItems = this.response.data.location_list;
            }
        } catch (error) {
            console.log("Something went wrong, please try again later.");
        }

    }

    async getZoneFromLocation(locationName: string) {
        this.locationName = locationName;
        if (this.$store.state.companyId && locationName) {
            //@ts-ignore
            this.response = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/update_zone/${this.$store.state.companyId}`, {
                "Company id": this.$store.state.companyId,
                "Location name": locationName
            });
            //@ts-ignore
            this.zoneItems = this.response.data.zone_list;
        }
    }

    async getPositionFromZone(zoneName: string) {
        if (this.$store.state.companyId && zoneName) {
            //@ts-ignore
            this.response = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/update_machine/${this.$store.state.companyId}`, {
                "Company id": this.$store.state.companyId,
                "Zone name": zoneName,
                "Location": this.locationName
            });
            //@ts-ignore
            this.positionItems = this.response.data.machine_list;
        }
    }

    async genFftPlot() {
        try {
            //@ts-ignore
            if (this.$refs.specForm.validate()) {

                // if (this.timeRange === "Last 1 min") {
                //     this.timeRange = "1m";
                // } else if (this.timeRange === "Last 2 mins") {
                //     this.timeRange = "2m";
                // } else if (this.timeRange === "Last 3 mins") {
                //     this.timeRange = "3m";
                // } else {
                //     this.timeRange = "5m";
                // }

                // this.timeRangeValue = this.timeRange;


                this.edgefftObj["Company name"] = "BetaIndia";
                //@ts-ignore
                this.edgefftObj["Zone name"] = this.zoneName;
                //@ts-ignore
                this.edgefftObj["Machine name"] = this.positionName;
                // this.edgefftObj["Axis"] = this.sensorItemValue;
                this.edgefftObj["Machine id"] = "machine-068379d0-1ca6-11ea-ab46-63824fce8989";
                this.edgefftObj["sample rate"] = this.sampleRateVal;
                localStorage.setItem("sampleRate", this.sampleRateVal);
                this.edgefftObj["number of samples"] = this.noOfSamplesVal;
                // this.edgefftObj["Duration"] = this.timeRangeValue;

                // console.log(this.edgefftObj);
                if (this.$store.state.companyId) {
                    //@ts-ignore
                    this.response = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/edge_fft_info/${this.$store.state.companyId}`,
                        this.edgefftObj,
                    );
                    //@ts-ignore
                    this.specSnackBar = true;
                    //@ts-ignore
                    this.specMsg = this.response.data;
                }
                //@ts-ignore
                this.specChartData = {
                    "Company name": "BetaIndia",
                    //@ts-ignore
                    "Zone name": this.zoneName,
                    //@ts-ignore
                    "Machine name": this.positionName,
                    // "Axis": this.sensorItemValue,
                    "sample rate": this.sampleRateVal,
                    "number of samples": this.noOfSamplesVal,
                    //@ts-ignore
                    // "Duration": this.timeRangeValue
                };
                //@ts-ignore
                this.specDataTableData = {
                    "Company name": "BetaIndia",
                    //@ts-ignore
                    "Zone name": this.zoneName,
                    //@ts-ignore
                    "Machine name": this.positionName,
                    // "Axis": this.sensorItemValue,
                    "sample rate": this.sampleRateVal,
                    "number of samples": this.noOfSamplesVal,
                    //@ts-ignore
                    // "Duration": this.timeRangeValue
                };

            }
        } catch (error) {
            console.log("Something went wrong, please try again later.");
        }
    }

}
