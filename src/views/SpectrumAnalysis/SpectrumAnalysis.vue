<template>
  <v-container>
    <v-card elevation="0">
      <v-form ref="specForm" v-model="spectrumStat">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="3">
              <v-select
                :items="bridgeItems"
                label="Select Bridge"
                v-model="locationName"
                @change="getZoneFromLocation($event)"
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
                v-model="positionName"
                label="Select Position"
                :rules="positionRequired"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-select
                :items="sampleRateItems"
                label="Select Sample Rate"
                v-model="sampleRateVal"
                :rules="sampleRateRequired"
                dense
              ></v-select>
            </v-col>
          </v-row>

          <v-row>  
            <v-col cols="12" sm="3">
              <v-select
                :items="noOfSampleItems"
                label="Select Number of Samples"
                v-model="noOfSamplesVal"
                :rules="noOfSampleRequired"
                dense
              ></v-select>
            </v-col>
             <v-btn color="primary" :disabled="!spectrumStat" @click="genFftPlot()">Submit</v-btn>
          </v-row>
          <!-- <div>
            <v-row align="center">
              <v-col cols="12" sm="12">
                <v-select
                  :items="durationItems"
                  label="Select Duration"
                  v-model="timeRange"
                  item-text="Duration"
                  item-value="Duration"
                  :rules="durationRequired"
                ></v-select>
              </v-col>
            </v-row>
          </div>-->
        </v-card-text>
        <v-snackbar v-model="specSnackBar" :timeout="timeoutValue">
          {{ specMsg }}
          <v-btn color="pink" text @click="specSnackBar = false">Close</v-btn>
        </v-snackbar>
      </v-form>
    </v-card>

    <!-- FFT plot  -->
    <v-row>
      <v-col cols="12" md="12">
        <v-card elevation="0" :loading="loading">
          <v-tabs background-color="indigo darken-4" dark centered>
            <v-tab>FFT Plot</v-tab>
            <v-tab @click="selectTable('table')">Table</v-tab>

            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <!-- SpecLinePlot -->
                  <SpecLinePlot :myProps="specChartData" />
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <!-- SpecDataTable -->
              <SpecDataTable :myProps="specDataTableData" />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
    <!-- end FFT plot -->
  </v-container>
</template>

<style></style>

<script lang="ts" src="./SpectrumAnalysis.ts">
</script>