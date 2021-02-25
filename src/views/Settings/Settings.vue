<template>
  <v-container>
    <v-form ref="commonForm" v-model="commonDataValid">
      <v-card elevation="0">
        <v-card-text>
              <v-expansion-panels v-model="settingPanel" multiple>
                <!-- <v-form ref="mroThresholdForm" v-model="mroThresholdValid"> -->
                <v-expansion-panel>
                  <v-expansion-panel-header>Input</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12" sm="3">
                        <v-select
                          :items="bridgeItems"
                          v-model="locationName"
                          @change="getZoneFromLocation($event)"
                          label="Select Bridge"
                          :rules="bridgeRequired"
                          dense
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="3">
                        <v-select
                          :items="zoneItems"
                          v-model="zoneName"
                          label="Select Zone"
                          @change="getPositionFromZone($event)"
                          :rules="zoneRequired"
                          dense
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-select
                          :items="positionItems"
                          item-text="name"
                          item-value="id"
                          v-model="positionName"
                          label="Select Position"
                          :rules="positionRequired"
                          dense
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="3">
                        <v-select
                          :items="paramItems"
                          @change="gatParameter($event)"
                          label="Select Parameter"
                          v-model="paramName"
                          :rules="paramRequired"
                          dense
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header>Additional Options</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12" sm="3">
                          <v-btn
                            color="primary"
                            :disabled="!eventTrapDataValid"
                            @click.stop="mroDialog = true" small 
                          >Threshold</v-btn>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-btn
                            color="primary"
                            :disabled="!eventTrapDataValid"
                            @click.stop="eventDialog = true" small
                          >Event Trap</v-btn>
                        </v-col>
                        <!-- <v-col cols="12" sm="3">
                          <v-btn
                            color="primary"
                            :disabled="!eventTrapDataValid"
                            @click.stop="calibrationDialog = true" small
                          >Calibration</v-btn>
                        </v-col> -->
                    </v-row>
                      
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
            <v-dialog v-model="mroDialog"
                    max-width="500">
                    <v-card style="padding:10px">
                      <v-row v-if="deflectionVibration">
                          <v-col cols="12" sm="6">
                                    <v-text-field
                                      label="Threshold for Red Alert"
                                      placeholder="Enter Threshold for Red Alert"
                                      :rules="redThresholdRequired"
                                      value="0"
                                      v-model="redThreshold"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6">
                                    <v-text-field
                                      label="Threshold for Yellow Alert"
                                      placeholder="Enter Threshold for Yellow Alert"
                                      :rules="yellowThresholdRequired"
                                      value="0"
                                      v-model="yellowThreshold"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" align-self="center">
                          <v-btn @click="submitThresholdData()" color="primary" :disabled="!commonDataValid" small>Submit</v-btn>
                        </v-col>
                      </v-row>
                      <v-row v-if="!deflectionVibration">
                          <v-col cols="12" sm="6">
                                    <v-text-field
                                      label="Threshold Alert"
                                      placeholder="Enter Alert"
                                      :rules="redThresholdRequired"
                                      value="0"
                                      v-model="alertThreshold"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" align-self="center">
                          <v-btn @click="submitThresholdData()" color="primary" :disabled="!commonDataValid" small>Submit</v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-dialog>
                  <v-snackbar v-model="thresholdSnackBar" :timeout="timeoutValue">
                      {{ thresholdMsg }}
                      <v-btn color="pink" text @click="thresholdSnackBar = false">Close</v-btn>
                    </v-snackbar>


                  <v-dialog v-model="eventDialog"
                    max-width="500">
                    <v-card style="padding:10px">
                      <v-form ref="eventTrapForm" v-model="eventTrapDataValid">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            label="Event Trap Threshold"
                            placeholder="Enter Event Trap Threshold"
                            :rules="eventThresholdRequired"
                            v-model="eventTrapThreshold"
                            value="0"
                          ></v-text-field>
                        </v-col>
                      
                        <v-col cols="12" sm="6">
                          <v-btn
                            color="primary"
                            :disabled="!eventTrapDataValid"
                            @click="submitEventTrapData()"
                          >Submit</v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                    </v-card>
                  </v-dialog>
                  <v-snackbar v-model="eventTrapSnackBar" :timeout="timeoutValue">
                        {{ eventTrapMsg }}
                        <v-btn color="pink" text @click="eventTrapSnackBar = false">Close</v-btn>
                      </v-snackbar>

                  <!-- <v-dialog v-model="calibrationDialog"
                    max-width="500">
                    <v-card style="padding:10px">
                      <v-form ref="calibrationForm" v-model="calibrationDataValid">
                      <v-row>
                        <v-col cols="12" sm="6">                          <v-text-field
                            label="Height of Reference Sensor"
                            placeholder="Enter Height of Reference Sensor"
                            :rules="refSensorHeightRequired"
                            v-model="refSensorHeight"
                            value="0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-btn
                            color="primary"
                            :disabled="!calibrationDataValid"
                            @click="submitcalibationData()"
                          >Submit</v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                    </v-card>
                  </v-dialog> -->
    </v-form>
  </v-container>
</template>

<style></style>

<script lang="ts" src="./Settings.ts"></script>