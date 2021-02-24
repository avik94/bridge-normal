<template>
  <v-container>
    <v-card elevation="0">
      <v-form ref="eventTrapForm" v-model="eventTrapValid">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="3">
              <v-select
                :items="bridgeItems"
                label="Select Bridge"
                v-model="locationName"
                @change="getZoneFromLocation($event)"
                :rules="bridgeRequired"
                required
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
                required
                dense
              ></v-select>
            </v-col>

            <v-col cols="12" sm="3">
              <v-select
                :items="positionItems"
                v-model="positionName"
                label="Select Position"
                :rules="positionRequired"
                required
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-select
                :items="paramItems"
                label="Select Parameter"
                v-model="paramItemValue"
                @change="setAdditionalParams($event)"
                :rules="paramRequired"
                required
                dense
              ></v-select>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" sm="3">
              <v-select
                :items="unitItems"
                label="Select Unit"
                v-model="unitName"
                item-text="Unit"
                item-value="Unit"
                :rules="unitRequired"
                required
                dense
              ></v-select>
            </v-col>

            <v-col cols="12" sm="3">
              <v-select
                :items="quickTimeItems"
                label="Select Quick Time Ranges"
                v-model="timeRange"
                item-text="QuickTimeRange"
                item-value="QuickTime"
                :rules="quickTimeRequired"
                required
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-btn color="primary" :disabled="!eventTrapValid" @click="genEventTrap()">Submit</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-card-actions class="justify-center">
          <v-btn color="primary" :disabled="!eventTrapValid" @click="genEventTrap()">Submit</v-btn>
        </v-card-actions> -->
        <v-snackbar v-model="noEventOccurSnackbar" :timeout="timeout">
          {{ noEventOccurMsg }}
          <v-btn color="pink" text @click="noEventOccurSnackbar = false">Close</v-btn>
        </v-snackbar>
      </v-form>
    </v-card>

    <!-- Event Trap plot  -->
    <v-row>
      <v-col cols="12" md="12">
        <v-card elevation="0" :loading="loading">
          <v-tabs background-color="indigo darken-4" dark centered>
            <v-tab>Line Plot</v-tab>
            <v-tab>Event Trap</v-tab>
            <v-tab>FFT Plots</v-tab>

            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <!-- EventLinePlot -->
                  <EventLinePlot :myProps="eventLinePlotData" />
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-text>
                  <!-- <v-card-actions class="justify-center"> -->
                  <v-form ref="eventTimeForm" v-model="eventTimeValid">
                    <v-row>
                      <v-col cols="3" offset="2" sm="5" offset-sm="1">
                        <v-select
                          :items="eventTimeItems"
                          v-model="eventTimeItemValue"
                          label="Select Event Time"
                          :rules="eventTimeRequired"
                          dense
                        ></v-select>
                      </v-col>
                      <v-col cols="4" offset="3" sm="4" offset-sm="2">
                        <v-btn
                          color="primary"
                          :disabled="!eventTimeValid"
                          @click="submitEventTime()"
                        >Submit</v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                  <!-- </v-card-actions> -->

                  <!-- raw data plot section -->
                  <v-card-title class="justify-center">Raw Data Plot</v-card-title>
                  <v-divider></v-divider>

                  <!-- EventTrap -->
                  <EventTrapRawData :myProps="eventTrapRawData" />

                  <!-- end -->
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title></v-card-title>
                <v-card-text>
                  <v-form ref="fftTimeForm" v-model="fftTimeValid">
                    <v-row>
                      <v-col cols="3" offset="2" sm="5" offset-sm="1">
                        <v-select
                          :items="fftTimeItems"
                          label="Select FFT Time"
                          v-model="fftTimeItem"
                          :rules="fftTimeRequired"
                          dense
                        ></v-select>
                      </v-col>
                      <v-col cols="4" offset="3" sm="4" offset-sm="2">
                        <v-btn
                          color="primary"
                          :disabled="!fftTimeValid"
                          @click="submitFFTTime()"
                        >Submit</v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  <!-- 3 fft plots section -->
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-tabs background-color="indigo darken-1" dark centered>
                    <v-tab>FFT Plot of X</v-tab>
                    <v-tab>FFT Plot of Y</v-tab>
                    <v-tab>FFT Plot of Z</v-tab>

                    <v-tab-item>
                      <EventTrapFFTPlot :myProps="eventPlotFFTData" />
                    </v-tab-item>

                    <v-tab-item>
                      <EventTrapFFTPlot :myProps="eventPlotFFTData" />
                    </v-tab-item>

                    <v-tab-item>
                      <EventTrapFFTPlot :myProps="eventPlotFFTData" />
                    </v-tab-item>
                  </v-tabs>

                  <!-- end -->
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
    <!-- end Event Trap plot -->
  </v-container>
</template>

<style></style>

<script lang="ts" src="./EventTrap.ts"></script>