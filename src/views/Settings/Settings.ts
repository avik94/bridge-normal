import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import JsonCSV from "vue-json-csv";
import VuePlotly from "@statnett/vue-plotly";
import axios from 'axios';

Vue.component("downloadCsv", JsonCSV);

@Component({
    components: { VuePlotly }
})

export default class Settings extends Vue {
    public mroDataObj = {};
    public eventTrapDataObj = {};
    public redThresholdVal = 0;
    public yellowThresholdVal = 0;
    public paramNameVal = "";
    public deflectionVal = 0;
    mroDialog = false;
    eventDialog = false;
    calibrationDialog = false;
    locationName = "";
    deflectionVibration = false;
    alertThreshold= "";

    data() {
        return {
            response: {},
            locationName: "",
            zoneName: "",
            positionName: "",
            mroDataValid: true,
            mroForm: "",
            // calibrateDataValid: true,
            // calibrateForm: "",
            eventTrapForm: "",
            commonForm: "",
            calibrationForm: "",
            commonDataValid: true,
            calibrationDataValid: true,
            eventTrapDataValid: true,
            settingPanel: [0, 1, 2, 3],
            // settingPanel: [0, 1],
            thresholdSnackBar: false,
            eventTrapSnackBar: false,
            timeoutValue: 4000,
            // calibrationSnackBar: false,
            // mroThresholdForm: "",
            // mroThresholdValid: true,

            paramName: "",
            redThreshold: "0",
            yellowThreshold: "1",
            alertThreshold: "1",

            eventTrapThreshold: "0",
            refSensorHeight: "0",

            thresholdMsg: "Sending threshold",
            calibrationMsg: "Sending Height of Reference Sensor",
            eventTrapMsg: "Sending Event Trap Threshold",
            zoneItems: [],

            bridgeItems: [],
            positionItems: [],
            // sensorItems: [
            //     "X",
            //     "Y",
            //     "Z"
            // ],
            paramItems: ["Deflection", "Vibration" ,"SI", "PGA"],
            zoneRequired: [
                (v: boolean) => !!v || "Please Select Zone",
            ],
            bridgeRequired: [
                (v: boolean) => !!v || "Please Select Bridge",
            ],
            positionRequired: [
                (v: boolean) => !!v || "Please Select Position",
            ],
            paramRequired: [
                (v: boolean) => !!v || "Please Select Parameter",
            ],
            // sensorRequired: [
            //     (v: boolean) => !!v || "Please Select Axis",
            // ],
            redThresholdRequired: [
                // (v) => !!v || typeof v !== "number" && !isNaN(v) || 'Please Enter Scale'
                (v) => !!v.trim() || "Please Enter Threshold Value For Red Alert",
                // (v) => (!isNaN(parseFloat(v)) && (v < 0)) ? true : false || "Negative Values Are Not Allowed In Threshold Field",
                (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Threshold Field",

            ],
            yellowThresholdRequired: [
                (v) => !!v.trim() || "Please Enter Threshold Value For Yellow Alert",
                (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Threshold Field",
            ],
            refSensorRequired: [
                (v) => !!v.trim() || "Please Enter Height of The Reference Sensor",
                (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Height Field",
            ],
            eventThresholdRequired: [
                (v) => !!v.trim() || "Please Enter Threshold Value of The Event Trap",
                (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Threshold Field",
            ],
            refSensorHeightRequired: [
                (v) => !!v.trim() || "Please Enter Height of Reference Sensor",
                (v) => (!isNaN(parseFloat(v))) ? true : false || "Only Numbers Are Allowed In Height of Reference Sensor",
            ]
        };
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

    async created() {
        await this.initialize();
    }

    async submitThresholdData() {
        // when snackbar is displayed that means request is sent, response not come
        // so disable button when response not came
        // after response enable submit button again

        try {
            //@ts-ignore
            if (this.$refs.commonForm.validate()) {
                //@ts-ignore
                this.paramNameVal = this.paramName;
                //@ts-ignore
                this.redThresholdVal = this.redThreshold;
                //@ts-ignore
                this.yellowThresholdVal = this.yellowThreshold;

                // this.mroDataObj["Parameter"] = this.paramNameVal;
                // this.mroDataObj["Red"] = this.redThresholdVal;
                // this.mroDataObj["Yellow"] = this.yellowThresholdVal;
                // this.mroDataObj["Alert"]= this.alertThreshold;

                if (this.$store.state.companyId) {
                    //@ts-ignore
                    this.response = await this.$http.post(`/bridge/analytics/mro_threshold/${this.$store.state.companyId}`, {
                        "Parameter name": this.paramNameVal,
                        // @ts-ignore
                        "Machine id": this.positionName,
                        "Red": this.redThresholdVal,
                        "Yellow": this.yellowThresholdVal,
                        "Alert": this.alertThreshold
                    });
                    // show message indicating Threshold value sent, following line will change
                    // console.log(this.response.data);
                    //@ts-ignore
                    if (this.response.data) {
                        //@ts-ignore
                        this.thresholdSnackBar = true;
                        //@ts-ignore
                        this.mroDialog= false;
                        //@ts-ignore
                        this.thresholdMsg = this.response.data;
                       
                    }
                }

            }

        } catch (error) {
            console.log("Something went wrong, please try again later.");
        }

    }

    // submitCalibrationData() {
    //     this.calibrationSnackBar = true;
    // }

    submitcalibationData() {
        //@ts-ignore
        if (this.$refs.calibrationForm.validate()) {
            console.log("submit");
            this.calibrationDialog = false;
        }
    }

    async submitEventTrapData() {
        //@ts-ignore
        let bridgeName = this.$refs.commonForm.locationName;
        //@ts-ignore
        let zone = this.$refs.commonForm.zoneName;
        //@ts-ignore
        let position = this.$refs.commonForm.positionName;
        //@ts-ignore
        let param = this.$refs.commonForm.paramName;

        try {
            //@ts-ignore
            if (this.$refs.eventTrapForm.validate()) {

                //@ts-ignore
                this.deflectionVal = this.eventTrapThreshold;
                // localStorage.setItem("", this.deflectionVal);

                this.eventTrapDataObj["Deflection"] = this.deflectionVal;
                //@ts-ignore
                this.eventTrapDataObj["Parameter"] = this.paramName;

                // console.log(this.eventTrapDataObj);
                if (this.$store.state.companyId) {
                    // check if bridge, zone , position, parameter given or not

                    //@ts-ignore
                    this.response = await axios.post(`${this.$store.state.baseURL}/bridge/analytics/eventtrap_threshold/${this.$store.state.companyId}`, {
                        //@ts-ignore
                        "Parameter name": this.paramName,
                        //@ts-ignore
                        "Machine id": this.positionName,
                        "Threshold": this.deflectionVal,
                    });

                    //@ts-ignore
                    if (this.response.data) {
                        //@ts-ignore
                        this.eventTrapSnackBar = true;
                        //@ts-ignore
                        this.eventTrapMsg = this.response.data;
                        this.eventDialog = false;
                    }
                }
            }

        } catch (error) {
            console.log("Something went wrong, please try again later.");
        }


    }
    
    async gatParameter(data){
        console.log('data', data);
        if(data == 'Deflection' || data == 'Vibration') {
            this.deflectionVibration = true;
        }
        else{
            this.deflectionVibration = false;
        }
    }

}
