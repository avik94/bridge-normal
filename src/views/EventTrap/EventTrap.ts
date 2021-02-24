import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import JsonCSV from "vue-json-csv";
import VuePlotly from "@statnett/vue-plotly";

import EventLinePlot from "../../components/EventLinePlot.vue";
import EventTrapRawData from "../../components/EventTrapRawData.vue";
import EventTrapFFTPlot from "../../components/EventTrapFFTPlot.vue";
import axios from 'axios';

Vue.component("downloadCsv", JsonCSV);

@Component({
    components: { VuePlotly, EventLinePlot, EventTrapRawData, EventTrapFFTPlot }
})

export default class EventTrap extends Vue {
    public paramItemValue = "";
    public parameterName = "";
    public unitName = "";
    public timeRange = "";
    public timeRangeVal = "";
    public linePlotObj = {};
    public eventTrapObj = {};
    public fftObj = {};
    locationName = "";
    data() {
        return {
            eventTrapForm: "",
            eventTimeForm: "",
            fftTimeForm: "",
            eventLinePlotData: {},
            eventTrapRawData: {},
            eventPlotFFTData: {},
            eventTimeItemValue: "",
            noEventOccurSnackbar: false,
            noEventOccurMsg: "No Event Occured, Please Select Different Quick Time To Get List of Event Times",
            timeout: 4000,
            fftTimeItem: "",
            loading: false,
            locationName: "",
            positionName: "",
            zoneName: "",
            eventTimeValid: true,
            eventTrapValid: true,
            fftTimeValid: true,
            search: "",
            zoneItems: [],

            bridgeItems: [],
            positionItems: [],
            // sensorItems: [
            //     "Sensor Type 1",
            //     "Sensor Type 2",
            //     "Sensor Type 3",
            // ],
            // unitItems: String[""] = [],
            unitItems: [],

            paramItems: [
                // "Deflection",
                // "Vibration",

                // "Deflection - Mean",
                "Deflection - Median",
                // "Vibration - Mean",
                "Vibration - Peak",
            ],
            quickTimeItems: [
                { "QuickTimeRange": "Last 5 mins", "QuickTime": "Last 5 mins" },
                { "QuickTimeRange": "Last 15 mins", "QuickTime": "Last 15 mins" },
                { "QuickTimeRange": "Last 30 mins", "QuickTime": "Last 30 mins" },
                { "QuickTimeRange": "Last 1 hour", "QuickTime": "Last 1 hour" },
                { "QuickTimeRange": "Last 3 hours", "QuickTime": "Last 3 hours" },
                { "QuickTimeRange": "Last 6 hours", "QuickTime": "Last 6 hours" },
                { "QuickTimeRange": "Last 12 hours", "QuickTime": "Last 12 hours" },
                { "QuickTimeRange": "Last 24 hours", "QuickTime": "Last 24 hours" },
                { "QuickTimeRange": "Last 2 days", "QuickTime": "Last 2 days" },
                { "QuickTimeRange": "Last 7 days", "QuickTime": "Last 7 days" },
                { "QuickTimeRange": "Last 12 days", "QuickTime": "Last 12 days" },
                { "QuickTimeRange": "Last 16 days", "QuickTime": "Last 16 days" },
                { "QuickTimeRange": "Last 30 days", "QuickTime": "Last 30 days" },


            ],
            // sensorItems: [
            //     "X",
            //     "Y",
            //     "Z",
            // ],
            eventTimeItems: [],
            fftTimeItems: [],
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
            //     (v: boolean) => !!v || "Please Select Sensor Type",
            // ],
            paramRequired: [
                (v: boolean) => !!v || "Please Select Parameter",
            ],
            quickTimeRequired: [
                (v: boolean) => !!v || "Please Select Quick Time Range",
            ],
            unitRequired: [
                (v: boolean) => !!v || "Please Select Unit",
            ],
            eventTimeRequired: [
                (v: boolean) => !!v || "Please Select Event Time",
            ],
            fftTimeRequired: [
                (v: boolean) => !!v || "Please Select FFT Time",
            ],
            // sensorRequired: [
            //     (v: boolean) => !!v || "Please Select Axis",
            // ],
        };

    }


    async initialize() {

        // get location based on company id
        try {
            // localStorage.setItem("cmpnyId", "5ef624a0fe970c52bc9a29b2");
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

    async created() {
        await this.initialize();
    }

    async geSubAssembly(machineName: string) {

        let responseData = {};
        let subAssemblyInstance = "";
        let statNameVal = "";
        if (this.$store.state.companyId) {
            //@ts-ignore
            responseData = await axios.post(
                `${this.$store.state.baseURL}/bridge/analytics/update_sa_collector/${this.$store.state.companyId}`,
                {
                    "Machine name": machineName
                }
            );
            // console.log(responseData.data);

            //@ts-ignore
            if (responseData.data["Subassembly Instance"]) {
                //@ts-ignore
                subAssemblyInstance = responseData.data["Subassembly Instance"];

                const subAssemblyIns = localStorage.getItem("subassemblyInstance");
                if (subAssemblyIns) {
                    localStorage.removeItem("subassemblyInstance");
                }

                localStorage.setItem("subassemblyInstance", subAssemblyInstance);
            }
        }
    }

    async setAdditionalParams(paramName: string) {

        if (paramName === "Deflection - Median") {
            this.eventTrapObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance");
            this.eventTrapObj["Collector name"] = "mg1";
            this.eventTrapObj["Stat name"] = "TUNED_NN_MEDIAN";
            this.eventTrapObj["Parameter name"] = "Z";

            localStorage.setItem("collectorName", "mg1");
            localStorage.setItem("statName", "TUNED_NN_MEDIAN");
            //@ts-ignore
            this.unitItems = [];
            //@ts-ignore
            this.unitItems.push("mm");
        } else {
            this.eventTrapObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance");
            this.eventTrapObj["Collector name"] = "ac1";
            this.eventTrapObj["Stat name"] = "PERCENTILE_95";
            this.eventTrapObj["Parameter name"] = "R";

            localStorage.setItem("collectorName", "ac1");
            localStorage.setItem("statName", "PERCENTILE_95");
            //@ts-ignore
            this.unitItems = [];
            //@ts-ignore
            this.unitItems.push("g");
        }
        //@ts-ignore
        await this.geSubAssembly(this.positionName);
    }

    async getUnit() {
        try {
            // get subassembly, collector, parameter, stat from browser
            let subAssemblyName = localStorage.getItem("subassemblyInstance");
            let collectorName = localStorage.getItem("collectorName");
            let paramName = "Z";
            let statName = localStorage.getItem("statName");
            if (subAssemblyName && collectorName &&
                paramName && statName) {

                // call api

                if (this.$store.state.companyId) {
                    //@ts-ignore
                    this.response = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/update_unit/${this.$store.state.companyId}`, {
                        "Subassembly Instance": subAssemblyName,
                        "Collector name": collectorName,
                        "Parameter name": paramName,
                        "Stat name": statName,
                    });
                    //@ts-ignore
                    this.unitItems = this.response.data.unit_list;
                    // console.log('Unit items: ', this.unitItems);
                }


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

    async genEventTrap() {
        //@ts-ignore
        if (this.$refs.eventTrapForm.validate()) {
            this.linePlotObj["Company name"] = "";
            this.linePlotObj["Zone name"] = "";
            this.linePlotObj["Machine name"] = "";
            this.linePlotObj["Parameter name"] = "";
            this.linePlotObj["Unit name"] = "";
            this.linePlotObj["Parameter name"] = "";

            this.linePlotObj["Quick Time Range"] = "";

            if (this.timeRange === "Last 5 mins") {
                // this.timeRange = "5m";
                this.timeRange = "Last 5 mins";
                this.timeRangeVal = "5m";
            } else if (this.timeRange === "Last 15 mins") {
                this.timeRange = "Last 15 mins";
                this.timeRangeVal = "15m";
            } else if (this.timeRange === "Last 30 mins") {
                this.timeRange = "Last 30 mins";
                this.timeRangeVal = "30m";
            } else if (this.timeRange === "Last 1 hour") {
                this.timeRange = "Last 1 hour";
                this.timeRangeVal = "1h";
            } else if (this.timeRange === "Last 3 hours") {
                this.timeRange = "Last 3 hours";
                this.timeRangeVal = "3h";
            } else if (this.timeRange === "Last 6 hours") {
                this.timeRange = "Last 6 hours";
                this.timeRangeVal = "6h";
            } else if (this.timeRange === "Last 12 hours") {
                this.timeRange = "Last 12 hours";
                this.timeRangeVal = "12h";
            } else if (this.timeRange === "Last 24 hours") {
                this.timeRange = "Last 24 hours";
                this.timeRangeVal = "24h";
            } else if (this.timeRange === "Last 2 days") {
                this.timeRange = "Last 2 days";
                this.timeRangeVal = "48h";
            } else if (this.timeRange === "Last 7 days") {
                this.timeRange = "Last 7 days";
                this.timeRangeVal = "168h";
            } else if (this.timeRange === "Last 12 days") {
                this.timeRange = "Last 12 days";
                this.timeRangeVal = "288h";
            } else if (this.timeRange === "Last 16 days") {
                this.timeRange = "Last 16 days";
                this.timeRangeVal = "384h";
            } else {
                this.timeRange = "Last 30 days";
                this.timeRangeVal = "720h";
            }

            if (this.paramItemValue === "Deflection - Median") {
                this.linePlotObj["Company name"] = this.$store.state.companyName;
                this.linePlotObj["Zone name"] = "Span15";
                this.linePlotObj["Machine name"] = "MidSpan15Old";
                this.linePlotObj["Parameter name"] = "Z";
                this.linePlotObj["Unit name"] = this.unitName;

                this.linePlotObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance");
                this.linePlotObj["Collector name"] = localStorage.getItem("collectorName");
                this.linePlotObj["Stat name"] = localStorage.getItem("statName");

                this.linePlotObj["Quick Time Range"] = this.timeRangeVal;

                if (this.timeRangeVal !== "Customize time") {
                    delete this.linePlotObj["start date_time"];
                    delete this.linePlotObj["end date_time"];
                    this.linePlotObj["Quick Time Range"] = this.timeRangeVal;
                } else {
                    delete this.linePlotObj["Quick Time Range"];
                    //@ts-ignore
                    this.linePlotObj["start date_time"] = this.fromDateEpoc;
                    //@ts-ignore
                    this.linePlotObj["end date_time"] = this.toDateEpoc;
                }
                //@ts-ignore
                // this.unitItems = [];
                //@ts-ignore
                // this.unitItems.push("cm", "mm");
            } else {
                this.linePlotObj["Company name"] = this.$store.state.companyName;
                this.linePlotObj["Zone name"] = "Span15";
                this.linePlotObj["Machine name"] = "MidSpan15Old";
                this.linePlotObj["Parameter name"] = "R";
                this.linePlotObj["Unit name"] = this.unitName;
                // this.linePlotObj["Intercept"] = this.interceptValue;
                // this.linePlotObj["Slop"] = this.slopeValue;

                this.linePlotObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance");
                this.linePlotObj["Collector name"] = localStorage.getItem("collectorName");
                this.linePlotObj["Stat name"] = localStorage.getItem("statName");

                this.linePlotObj["Quick Time Range"] = this.timeRangeVal;

                if (this.timeRangeVal !== "Customize time") {
                    delete this.linePlotObj["start date_time"];
                    delete this.linePlotObj["end date_time"];
                    this.linePlotObj["Quick Time Range"] = this.timeRangeVal;
                } else {
                    delete this.linePlotObj["Quick Time Range"];
                    //@ts-ignore
                    this.linePlotObj["start date_time"] = this.fromDateEpoc;
                    //@ts-ignore
                    this.linePlotObj["end date_time"] = this.toDateEpoc;
                }
                //@ts-ignore
                // this.unitItems = [];
                //@ts-ignore
                // this.unitItems.push("g");
            }

            // if (this.paramItemValue === "Deflection - Mean") {

            //     this.linePlotObj["Company name"] = "QCTest";
            //     this.linePlotObj["Zone name"] = "Span15";
            //     this.linePlotObj["Machine name"] = "MidSpan15Old";
            //     this.linePlotObj["Parameter name"] = this.parameterName;
            //     this.linePlotObj["Unit name"] = this.unitName;

            //     this.linePlotObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance");
            //     this.linePlotObj["Collector name"] = localStorage.getItem("collectorName");
            //     this.linePlotObj["Stat name"] = localStorage.getItem("statName");

            //     this.linePlotObj["Quick Time Range"] = this.timeRange;

            //     if (this.timeRange !== "Customize time") {
            //         delete this.linePlotObj["start date_time"];
            //         delete this.linePlotObj["end date_time"];
            //         this.linePlotObj["Quick Time Range"] = this.timeRange;
            //     } else {
            //         delete this.linePlotObj["Quick Time Range"];
            //         //@ts-ignore
            //         this.linePlotObj["start date_time"] = this.fromDateEpoc;
            //         //@ts-ignore
            //         this.linePlotObj["end date_time"] = this.toDateEpoc;
            //     }

            // } else if (this.paramItemValue === "Deflection - Median") {

            //     this.linePlotObj["Company name"] = "QCTest";
            //     this.linePlotObj["Zone name"] = "Span15";
            //     this.linePlotObj["Machine name"] = "MidSpan15Old";
            //     this.linePlotObj["Parameter name"] = this.parameterName;
            //     this.linePlotObj["Unit name"] = this.unitName;

            //     this.linePlotObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance");
            //     this.linePlotObj["Collector name"] = localStorage.getItem("collectorName");
            //     this.linePlotObj["Stat name"] = localStorage.getItem("statName");

            //     this.linePlotObj["Quick Time Range"] = this.timeRange;

            //     if (this.timeRange !== "Customize time") {
            //         delete this.linePlotObj["start date_time"];
            //         delete this.linePlotObj["end date_time"];
            //         this.linePlotObj["Quick Time Range"] = this.timeRange;
            //     } else {
            //         delete this.linePlotObj["Quick Time Range"];
            //         //@ts-ignore
            //         this.linePlotObj["start date_time"] = this.fromDateEpoc;
            //         //@ts-ignore
            //         this.linePlotObj["end date_time"] = this.toDateEpoc;
            //     }

            // } else if (this.paramItemValue === "Vibration - Mean") {

            //     this.linePlotObj["Company name"] = "QCTest";
            //     this.linePlotObj["Zone name"] = "Span15";
            //     this.linePlotObj["Machine name"] = "MidSpan15Old";
            //     this.linePlotObj["Parameter name"] = this.parameterName;
            //     this.linePlotObj["Unit name"] = this.unitName;
            //     // this.linePlotObj["Intercept"] = this.interceptValue;
            //     // this.linePlotObj["Slop"] = this.slopeValue;

            //     this.linePlotObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance");
            //     this.linePlotObj["Collector name"] = localStorage.getItem("collectorName");
            //     this.linePlotObj["Stat name"] = localStorage.getItem("statName");


            //     this.linePlotObj["Quick Time Range"] = this.timeRange;

            //     if (this.timeRange !== "Customize time") {
            //         delete this.linePlotObj["start date_time"];
            //         delete this.linePlotObj["end date_time"];
            //         this.linePlotObj["Quick Time Range"] = this.timeRange;
            //     } else {
            //         delete this.linePlotObj["Quick Time Range"];
            //         //@ts-ignore
            //         this.linePlotObj["start date_time"] = this.fromDateEpoc;
            //         //@ts-ignore
            //         this.linePlotObj["end date_time"] = this.toDateEpoc;
            //     }

            // } else {

            //     this.linePlotObj["Company name"] = "QCTest";
            //     this.linePlotObj["Zone name"] = "Span15";
            //     this.linePlotObj["Machine name"] = "MidSpan15Old";
            //     this.linePlotObj["Parameter name"] = this.parameterName;
            //     this.linePlotObj["Unit name"] = this.unitName;
            //     // this.linePlotObj["Intercept"] = this.interceptValue;
            //     // this.linePlotObj["Slop"] = this.slopeValue;

            //     this.linePlotObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance");
            //     this.linePlotObj["Collector name"] = localStorage.getItem("collectorName");
            //     this.linePlotObj["Stat name"] = localStorage.getItem("statName");

            //     this.linePlotObj["Quick Time Range"] = this.timeRange;

            //     if (this.timeRange !== "Customize time") {
            //         delete this.linePlotObj["start date_time"];
            //         delete this.linePlotObj["end date_time"];
            //         this.linePlotObj["Quick Time Range"] = this.timeRange;
            //     } else {
            //         delete this.linePlotObj["Quick Time Range"];
            //         //@ts-ignore
            //         this.linePlotObj["start date_time"] = this.fromDateEpoc;
            //         //@ts-ignore
            //         this.linePlotObj["end date_time"] = this.toDateEpoc;
            //     }

            // }
            // console.log(this.linePlotObj);
            //@ts-ignore
            this.eventLinePlotData = {
                "Company name": this.$store.state.companyName,
                //@ts-ignore
                "Zone name": this.zoneName,
                //@ts-ignore
                "Machine name": this.positionName,
                "Subassembly Instance": localStorage.getItem("subassemblyInstance"),
                "Collector name": localStorage.getItem("collectorName"),
                // "Parameter name": "Z",
                "Parameter name": this.linePlotObj["Parameter name"],
                "Stat name": localStorage.getItem("statName"),
                "Unit name": this.unitName,
                "Quick Time Range": this.timeRangeVal,
            };


            //@ts-ignore
            this.eventTimes = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/event_lineplot/${this.$store.state.companyId}`, {
                "Company name": this.$store.state.companyName,
                //@ts-ignore
                "Zone name": this.zoneName,
                //@ts-ignore
                "Machine name": this.positionName,
                "Subassembly Instance": localStorage.getItem("subassemblyInstance"),
                "Collector name": localStorage.getItem("collectorName"),
                // "Parameter name": "Z",
                "Parameter name": this.linePlotObj["Parameter name"],
                "Stat name": localStorage.getItem("statName"),
                "Unit name": this.unitName,
                "Quick Time Range": this.timeRangeVal,
            });

            // let currDate: any;
            // let currMonth: any;
            // let currYear: any;
            // let currTime: any;
            //@ts-ignore
            if (this.eventTimeItems !== "undefined") {
                //@ts-ignore
                if (this.eventTimes.data["Event Timepoints"] === "No Event occured") {
                    //@ts-ignore
                    this.eventTimeItems.splice(0, this.eventTimeItems.length);

                    //@ts-ignore
                    this.fftTimeItems.splice(0, this.fftTimeItems.length);

                    //@ts-ignore
                    this.noEventOccurSnackbar = true;


                } else {
                    //@ts-ignore
                    this.noEventOccurSnackbar = false;
                    //@ts-ignore
                    this.eventTimeItems = this.eventTimes.data["Event Timepoints"];
                    //@ts-ignore
                    this.fftTimeItems = this.eventTimes.data["Event Timepoints"];
                }

            }
        }
    }

    submitEventTime() {
        //@ts-ignore
        if (this.$refs.eventTimeForm.validate()) {
            this.eventTrapObj["Company name"] = "";
            this.eventTrapObj["Zone name"] = "";
            this.eventTrapObj["Machine name"] = "";
            this.eventTrapObj["Parameter name"] = "";
            this.eventTrapObj["Unit name"] = "";

            this.eventTrapObj["Quick Time Range"] = "";

            this.eventTrapObj["User chosen time"] = "";


            if (this.timeRange === "Last 5 mins") {
                this.timeRange = "Last 5 mins";
                this.timeRangeVal = "5m";
            } else if (this.timeRange === "Last 15 mins") {
                this.timeRange = "Last 15 mins";
                this.timeRangeVal = "15m";
            } else if (this.timeRange === "Last 30 mins") {
                this.timeRange = "Last 30 mins";
                this.timeRangeVal = "30m";
            } else if (this.timeRange === "Last 1 hour") {
                this.timeRange = "Last 1 hour";
                this.timeRangeVal = "1h";
            } else if (this.timeRange === "Last 3 hours") {
                this.timeRange = "Last 3 hours";
                this.timeRangeVal = "3h";
            } else if (this.timeRange === "Last 6 hours") {
                this.timeRange = "Last 6 hours";
                this.timeRangeVal = "6h";
            } else if (this.timeRange === "Last 12 hours") {
                this.timeRange = "Last 12 hours";
                this.timeRangeVal = "12h";
            } else if (this.timeRange === "Last 24 hours") {
                this.timeRange = "Last 24 hours";
                this.timeRangeVal = "24h";
            } else if (this.timeRange === "Last 2 days") {
                this.timeRange = "Last 2 days";
                this.timeRangeVal = "Last 2 days";
            } else if (this.timeRange === "Last 7 days") {
                this.timeRange = "Last 7 days";
                this.timeRangeVal = "168h";
            } else if (this.timeRange === "Last 12 days") {
                this.timeRange = "Last 12 days";
                this.timeRangeVal = "288h";
            } else if (this.timeRange === "Last 16 days") {
                this.timeRange = "Last 16 days";
                this.timeRangeVal = "384h";
            } else {
                this.timeRange = "Last 30 days";
                this.timeRangeVal = "720h";
            }

            if (this.paramItemValue === "Deflection - Median") {
                this.eventTrapObj["Company name"] = this.$store.state.companyName;
                // this.eventTrapObj["Zone name"] = "Span15";
                //@ts-ignore
                this.eventTrapObj["Zone name"] = this.zoneName;
                // this.eventTrapObj["Machine name"] = "MidSpan15Old";
                //@ts-ignore
                this.eventTrapObj["Machine name"] = this.positionName;
                this.eventTrapObj["Parameter name"] = "Z";
                this.eventTrapObj["Unit name"] = this.unitName;

                // this.eventTrapObj["Subassembly Instance"] = "componentAnalyzer1";
                this.eventTrapObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance")
                this.eventTrapObj["Collector name"] = "mg1";
                this.eventTrapObj["Stat name"] = "TUNED_NN_MEDIAN";

                this.eventTrapObj["Quick Time Range"] = this.timeRangeVal;
            } else {
                this.eventTrapObj["Company name"] = this.$store.state.companyName;
                // this.eventTrapObj["Zone name"] = "Span15";
                //@ts-ignore
                this.eventTrapObj["Zone name"] = this.zoneName;
                // this.eventTrapObj["Machine name"] = "MidSpan15Old";
                //@ts-ignore
                this.eventTrapObj["Machine name"] = this.positionName;
                this.eventTrapObj["Parameter name"] = "R";
                this.eventTrapObj["Unit name"] = this.unitName;


                // this.eventTrapObj["Subassembly Instance"] = "componentAnalyzer1";
                this.eventTrapObj["Subassembly Instance"] = localStorage.getItem("subassemblyInstance")
                this.eventTrapObj["Collector name"] = "ac1";
                this.eventTrapObj["Stat name"] = "PERCENTILE_95";

                this.eventTrapObj["Quick Time Range"] = this.timeRangeVal;
            }

            //@ts-ignore
            this.eventTrapObj["User chosen time"] = this.eventTimeItemValue;

            //@ts-ignore
            this.eventLinePlotData = this.eventTrapObj;

            //@ts-ignore
            // this.eventTrapRawData = {
            //     "Company name": this.eventTrapObj["Company name"],
            //     "Zone name": this.eventTrapObj["Zone name"],
            //     "Machine name": this.eventTrapObj["Machine name"],
            //     "Subassembly Instance": this.eventTrapObj["Subassembly Instance"],
            //     "Collector name": this.eventTrapObj["Collector name"],
            //     "Parameter name": this.eventTrapObj["Parameter name"],
            //     "Stat name": this.eventTrapObj["Stat name"],
            //     "Unit name": this.eventTrapObj["Unit name"],
            //     "Quick Time Range": this.eventTrapObj["Quick Time Range"],
            //     "User chosen time": this.eventTrapObj["User chosen time"]
            // }
            this.eventTrapRawData = this.eventTrapObj;

        }
    }

    submitFFTTime() {
        //@ts-ignore
        if (this.$refs.fftTimeForm.validate()) {

            this.fftObj["Company name"] = "";
            this.fftObj["Zone name"] = "";
            this.fftObj["Machine name"] = "";
            this.fftObj["Parameter name"] = "";
            this.fftObj["Unit name"] = "";

            this.fftObj["Quick Time Range"] = "";
            this.fftObj["User chosen time"] = "";

            //@ts-ignore
            if (this.fftTimeItem === "Last 5 mins") {
                this.fftObj["User chosen time"] = new Date().getTime() - 5 * 60000;
                //@ts-ignore
            } else if (this.fftTimeItem === "Last 15 mins") {
                this.fftObj["User chosen time"] = new Date().getTime() - 15 * 60000;
                //@ts-ignore
            } else if (this.fftTimeItem === "Last 30 mins") {
                this.fftObj["User chosen time"] = new Date().getTime() - 30 * 60000;
                //@ts-ignore
            } else if (this.fftTimeItem === "Last 1 hour") {
                this.fftObj["User chosen time"] = new Date().getTime() - 60 * 60000;
                //@ts-ignore
            } else if (this.fftTimeItem === "Last 3 hours") {
                this.fftObj["User chosen time"] = new Date().getTime() - 180 * 60000;
                //@ts-ignore
                //@ts-ignore
            } else if (this.fftTimeItem === "Last 6 hours") {
                this.fftObj["User chosen time"] = new Date().getTime() - 360 * 60000;
                //@ts-ignore
            } else if (this.fftTimeItem === "Last 12 hours") {
                this.fftObj["User chosen time"] = new Date().getTime() - 720 * 60000;
            } else {
                this.fftObj["User chosen time"] = new Date().getTime() - 1440 * 60000;
            }

            if (this.timeRange === "Last 5 mins") {
                this.timeRange = "Last 5 mins";
                this.timeRangeVal = "5m";
            } else if (this.timeRange === "Last 15 mins") {
                this.timeRange = "Last 15 mins";
                this.timeRangeVal = "15m";
            } else if (this.timeRange === "Last 30 mins") {
                this.timeRange = "Last 30 mins";
                this.timeRangeVal = "30m";
            } else if (this.timeRange === "Last 1 hour") {
                this.timeRange = "Last 1 hour";
                this.timeRangeVal = "1h";
            } else if (this.timeRange === "Last 3 hours") {
                this.timeRange = "Last 3 hours";
                this.timeRangeVal = "3h";
            } else if (this.timeRange === "Last 6 hours") {
                this.timeRange = "Last 6 hours";
                this.timeRangeVal = "6h";
            } else if (this.timeRange === "Last 12 hours") {
                this.timeRange = "Last 12 hours";
                this.timeRangeVal = "12h";
            } else if (this.timeRange === "Last 24 hours") {
                this.timeRange = "Last 24 hours";
                this.timeRangeVal = "24h";
            } else if (this.timeRange === "Last 2 days") {
                this.timeRange = "Last 2 days";
                this.timeRangeVal = "Last 2 days";
            } else if (this.timeRange === "Last 7 days") {
                this.timeRange = "Last 7 days";
                this.timeRangeVal = "168h";
            } else if (this.timeRange === "Last 12 days") {
                this.timeRange = "Last 12 days";
                this.timeRangeVal = "288h";
            } else if (this.timeRange === "Last 16 days") {
                this.timeRange = "Last 16 days";
                this.timeRangeVal = "384h";
            } else {
                this.timeRange = "Last 30 days";
                this.timeRangeVal = "720h";
            }

            this.fftObj["sample_rate"] = localStorage.getItem("sampleRate") || "40";

            if (this.paramItemValue === "Deflection - Median") {
                this.fftObj["Company name"] = this.$store.state.companyName;
                //@ts-ignore
                this.fftObj["Zone name"] = this.zoneName;
                //@ts-ignore
                this.fftObj["Machine name"] = this.positionName;
                this.fftObj["Parameter name"] = "Z";
                this.fftObj["Unit name"] = this.unitName;

                this.fftObj["Subassembly Instance"] = "componentAnalyzer1";
                this.fftObj["Collector name"] = "mg1";
                this.fftObj["Stat name"] = "TUNED_NN_MEDIAN";

                this.fftObj["Quick Time Range"] = this.timeRangeVal;
            } else {
                this.fftObj["Company name"] = this.$store.state.companyName;
                //@ts-ignore
                this.fftObj["Zone name"] = this.zoneName;
                //@ts-ignore
                this.fftObj["Machine name"] = this.positionName;
                this.fftObj["Parameter name"] = "R";
                this.fftObj["Unit name"] = this.unitName;

                this.fftObj["Subassembly Instance"] = "componentAnalyzer1";
                this.fftObj["Collector name"] = "ac1";
                this.fftObj["Stat name"] = "PERCENTILE_95";

                this.fftObj["Quick Time Range"] = this.timeRangeVal;
            }

            // if (this.paramItemValue === "Deflection - Mean") {

            //     this.fftObj["Company name"] = "QCTest";
            //     //@ts-ignore
            //     this.fftObj["Zone name"] = this.zoneName;
            //     //@ts-ignore
            //     this.fftObj["Machine name"] = this.positionName;
            //     this.fftObj["Parameter name"] = "Z";
            //     this.fftObj["Unit name"] = this.unitName;

            //     this.fftObj["Subassembly Instance"] = "componentAnalyzer1";
            //     this.fftObj["Collector name"] = "mg1";
            //     this.fftObj["Stat name"] = "MEAN";

            //     this.fftObj["Quick Time Range"] = this.timeRange;

            // } else if (this.paramItemValue === "Deflection - Median") {

            //     this.fftObj["Company name"] = "QCTest";
            //     //@ts-ignore
            //     this.fftObj["Zone name"] = this.zoneName;
            //     //@ts-ignore
            //     this.fftObj["Machine name"] = this.positionName;
            //     this.fftObj["Parameter name"] = "Z";
            //     this.fftObj["Unit name"] = this.unitName;

            //     this.fftObj["Subassembly Instance"] = "componentAnalyzer1";
            //     this.fftObj["Collector name"] = "mg1";
            //     this.fftObj["Stat name"] = "TUNED_NN_MEDIAN";

            //     this.fftObj["Quick Time Range"] = this.timeRange;

            // } else if (this.paramItemValue === "Vibration - Mean") {

            //     this.fftObj["Company name"] = "QCTest";
            //     //@ts-ignore
            //     this.fftObj["Zone name"] = this.zoneName;
            //     //@ts-ignore
            //     this.fftObj["Machine name"] = this.positionName;
            //     this.fftObj["Parameter name"] = "Z";
            //     this.fftObj["Unit name"] = this.unitName;

            //     this.fftObj["Subassembly Instance"] = "componentAnalyzer1";
            //     this.fftObj["Collector name"] = "ac1";
            //     this.fftObj["Stat name"] = "MEAN";
            //     this.fftObj["Quick Time Range"] = this.timeRange;

            // } else {

            //     this.fftObj["Company name"] = "QCTest";
            //     //@ts-ignore
            //     this.fftObj["Zone name"] = this.zoneName;
            //     //@ts-ignore
            //     this.fftObj["Machine name"] = this.positionName;
            //     this.fftObj["Parameter name"] = "Z";
            //     this.fftObj["Unit name"] = this.unitName;
            //     // this.fftObj["Intercept"] = this.interceptValue;
            //     // this.fftObj["Slop"] = this.slopeValue;

            //     this.fftObj["Subassembly Instance"] = "componentAnalyzer1";
            //     this.fftObj["Collector name"] = "ac1";
            //     this.fftObj["Stat name"] = "PERCENTILE_95";

            //     this.fftObj["Quick Time Range"] = this.timeRange;

            // }
            // console.log(this.fftObj);
            //@ts-ignore
            this.eventPlotFFTData = this.fftObj;
        }
    }
}
