import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import JsonCSV from "vue-json-csv";

import SeismicBarChart from "../../components/SeismicBarChart.vue";
import SeismicLinePlot from "../../components/SeismicLinePlot.vue";
import SeismicDataTable from "../../components/SeismicDataTable.vue";
import axios from 'axios';

Vue.component("downloadCsv", JsonCSV);

@Component({
    components: {
        SeismicBarChart,
        SeismicLinePlot,
        SeismicDataTable,
    }
})

export default class SeismicData extends Vue { 
    allData:{} = "";
    tab = 0;
    parameterName = "";
    parameterItems = [ 
        { name: "SI", value: "SI" },
        { name: "PGA", value: "PGA" }
    ];
    positionName = "";
    machinePositionName = "";
    positionItems = [];
    zoneName = "";
    zoneItems = [];
    bridgeItems = [];
    unitName = "";
    unitItems = [];
    interceptValue = 0;
    scale = 1;
    subassembly = "";
    collector:any = "";
    timeRange = "";
    timeRangeItems = [
        { name: "Live Plot", time: "livePlot" },
        { name: "Last 5 mins", time: "5m" },
        { name: "Last 15 mins", time: "15m" },
        { name: "Last 30 mins", time: "30m" },
        { name: "Last 1 hour",  time:  "60m" },
        { name: "Last 3 hours", time: "180m" },
        { name: "Last 6 hours", time: "360m" },
        { name: "Last 12 hours", time: "720m" },
        { name: "Last 24 hours", time: "1440m" },
        { name: "Last 2 days", time: "2880m" },
        { name: "Last 7 days",  time: "10080m" },
        { name: "Last 30 days", time: "43200m" },
    ]
    sensor = "";
    sensorItem = ["Seismic"];
    locationName = "";
    // for only custome times for one
    fromDate = "";
    fromDateHour = "";
    fromDateMinute = "";
    toDate = "";
    toDateHour = "";
    toDateMinute = "";
    fromDateTwo = "";
    toDateTwo = "";

    // dialog open close variable
    dialog = false;
    dialog2 = false;
    // for only compare time
    itemDays = [{ name: "1 day ago", value: 1 }, { name: "2 days ago", value: 2 }, { name: "3 days ago", value: 3 },
        { name: "4 days ago", value: 4 }, { name: "5 days ago", value: 6 }, { name: "7 days ago", value: 7 }
    ]
    previousDay = "";
    axisName = "Z";
    axisNameList = ["X", "Y", "Z"]
    fromDateCompare = "";
    toDateCompare = "";

    bridgeDataValid = true;
    menu1 = false;
    menu2 = false;
    menu1Two = false;
    menu2Two = false;

    startTime:any = "";
    endTime:any = "";
    
    startTimeTwo:any = "";
    endTimeTwo:any = "";

    tabResult = false;
    health = false;
    noHealth = true;
    tableTitle = ["Trend", "Table"];
    
    data(){
        return{
            bridgeItems: [],
            bridgeRequired: [
                (v: boolean) => !!v || "Please Select Bridge",
            ],
        }
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
        this.tabResult = false;
        this.timeRange = "";
        let companyId = this.$store.state.companyId;
        let locationName = this.$route.params.bridgeName;
        if (companyId && zoneName) {
            //@ts-ignore
            this.response = await this.$http.post(`/bridge/analytics/update_machine/${companyId}`, {
                "Company id": companyId,
                "Zone name": zoneName,
                "Location": this.locationName
            });
            //@ts-ignore
            this.positionItems = this.response.data.machine_list;
        }
    }

    clickPosition(data){
        let name:any = this.positionItems.find((dataItem:any)=>{
            return dataItem.id === data;
        });
        this.machinePositionName = name.name;
        console.log(this.machinePositionName);
    }

    async chooseSensor(sensor) {
        this.tabResult = false;
        this.timeRange = "";
            this.collector = 0
            this.parameterItems = [
                { name: "SI", value: "SI" },
                { name: "PGA", value: "PGA" }
            ]
    }

    async setAdditionalParams(paramName: string) { 
        this.tabResult = false;
        this.timeRange = "";
        console.log(paramName);
        if(paramName === "Deflection_Magnitude"){
            this.tableTitle = ["Bar", "Trend", "Table"];
            this.noHealth = false;
            this.health = true;
        }else{
            this.noHealth = true;
            this.health = false;
            this.tableTitle =  ["Trend", "Table"];
        }
         //@ts-ignore
        const responseData = await axios.post(
            `${this.$store.state.baseURL}/bridge/analytics/update_sa_collector/${this.$store.state.companyId}`,
            {
                "Machine name": this.positionName
            }
        );
        this.subassembly = responseData.data["Subassembly Instance"];
        //@ts-ignore
        const responseForUnit = await axios.post(
            `${this.$store.state.baseURL}/bridge/analytics/update_unit/${this.$store.state.companyId}`,
            {
                "Stat name": this.parameterName,
                "Collector name": this.collector,
                "Subassembly Instance": this.subassembly
            }
        )
        console.log(this.subassembly, this.collector);
        this.unitItems = responseForUnit.data["unit_list"]
    }

    async selectUnitWithLive() {
        this.timeRange  = "livePlot";
        await this.submitBridgeData();
    }

    async created() {
        await this.initialize();
    }

    async submitBridgeData() {
        this.tabResult = true;
        setTimeout(()=>{
            const allData = {
                machine: this.positionName,
                machinePositionName: this.machinePositionName,
                sensor: this.sensor,
                stat: this.parameterName,
                unit: this.unitName,
                quickTime: this.timeRange
            }
            console.log(allData)
            this.allData = allData;
        }, 100)
    }

    async submitCustomTime() {
        this.tabResult = true;
        this.timeRange = "";
        console.log("custom")
            this.startTime = new Date(this.fromDate+" "+this.fromDateHour+":"+this.fromDateMinute).getTime();
            console.log(this.startTime);
            this.endTime = new Date(this.toDate+" "+this.toDateHour+":"+this.toDateMinute).getTime();
            console.log(this.endTime);
            const allData = {
                machine: this.positionName,
                machinePositionName: this.machinePositionName,
                sensor: this.sensor,
                stat: this.parameterName,
                unit: this.unitName,
                quickTime: this.timeRange,
                startTime: this.startTime,
                endTime: this.endTime,
            }
            console.log(allData)
            this.allData = allData;
            this.dialog= false;
    }
    
    async sumbitCompare() {
        this.tabResult = true;
        // const fulldate = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
        // console.log(new Date(fulldate+" "+this.fromDateCompare+":00").getTime());
        // console.log(new Date(fulldate+" "+this.toDateCompare+":00").getTime());
        const fromDateFromHour = new Date(this.fromDateTwo+" "+this.fromDateCompare+":00").getTime();
        const fromDateToHour = new Date(this.fromDateTwo+" "+this.toDateCompare+":00").getTime();
        const toDateFromHour = new Date(this.toDateTwo+" "+this.fromDateCompare+":00").getTime();;
        const toDateToHour = new Date(this.toDateTwo+" "+this.toDateCompare+":00").getTime();;
        const allData = {
            zone: this.zoneName,
            machine: this.positionName,
            machinePositionName: this.machinePositionName,
            sensor: this.sensor,
            stat: this.parameterName,
            subassembly: this.subassembly,
            collector: this.collector,
            unit: this.unitName,
            interceptValue: this.interceptValue,
            slope: this.scale,
            previousday: this.previousDay,
            axisName: this.axisName,
            day1startTime : fromDateFromHour,
            day1endTime : fromDateToHour,
            day2startTime : toDateFromHour,
            day2endTime: toDateToHour
        }
        console.log(allData)
        this.allData = allData;
        this.dialog2 = false;
    }

    zoneRequired = [
        (v: boolean) => !!v || "Please Select Zone",
    ]
    positionRequired = [
        (v: boolean) => !!v || "Please Select Position",
    ]
    paramRequired = [
        (v: boolean) => !!v || "Please Select Parameter",
    ]
    unitRequired = [
        (v: boolean) => !!v || "Please Select Unit",
    ]
    originRequired = [
        // (v) => !!v || "Please Enter Origin",
        (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Origin Field",
    ]
    scaleRequired = [
        (v) => !!v || "Please Enter Scale",
        (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Scale Field",
    ]
    timeRequired = [
        (v: boolean) => !!v || "Please Select Time Ranges",
    ]
    sensorRequired = [
        (v: boolean) => !!v || "Please Select Axis",
    ]
    fromHourRequired = [
        (v) => !!v || "Please Enter Hour",
        (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Hour Field",
        (v) => (!isNaN(parseFloat(v)) && (v >= 0 && v <= 23)) ? true : false || "Hour Must Be Between 0 to 23",
    ]
    fromMinuteRequired = [
        (v) => !!v || "Please Enter Minute",
        (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Minute Field",
        (v) => (!isNaN(parseFloat(v)) && (v >= 0 && v <= 59)) ? true : false ||
            "Minute Must Be Between 0 to 59",
    ] 
    fromSecondRequired = [
        (v) => !!v || "Please Enter Second",
        (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Second Field",
        (v) => (!isNaN(parseFloat(v)) && (v >= 0 && v <= 59)) ? true : false ||
            "Second Must Be Between 0 to 59",
    ]
    toHourRequired = [
        (v) => !!v || "Please Enter Hour",
        (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Hour Field",
        (v) => (!isNaN(parseFloat(v)) && (v >= 0 && v <= 23)) ? true : false || "Hour Must Be Between 0 to 23",
    ]
    toMinuteRequired = [
        (v) => !!v || "Please Enter Minute",
        (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Minute Field",
        (v) => (!isNaN(parseFloat(v)) && (v >= 0 && v <= 59)) ? true : false ||
            "Minute Must Be Between 0 to 59",
    ]
    toSecondRequired = [
        (v) => !!v || "Please Enter Second",
        (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Second Field",
        (v) => (!isNaN(parseFloat(v)) && (v >= 0 && v <= 59)) ? true : false ||
            "Second Must Be Between 0 to 59",
    ]

}