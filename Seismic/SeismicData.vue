<template>
    <v-container>
        <v-form ref="bridgeDataForm" v-model="bridgeDataValid">
        <v-card elevation="0">
        <v-card-text>
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
                label="Select Zone"
                v-model="zoneName"
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
                @input="clickPosition($event)"
                v-model="positionName"
                label="Select Position"
                :rules="positionRequired"
                dense
              ></v-select>
            </v-col>

            <v-col cols="12" sm="3">
              <v-select
                :items="sensorItem"
                v-model="sensor"
                label="Select Sensor"
                @change="chooseSensor(sensor)"
                :rules="paramRequired"
                dense
              ></v-select>
            </v-col>

            <!-- dummy -->
            <v-col cols="12" sm="4" style="display: none">
              <v-text-field
                v-model="subassembly"
                label="Subassembly"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" style="display: none">
              <v-text-field
                v-model="collector"
                label="Collector"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
              <v-col cols="12" sm="3">
              <v-select
                :items="parameterItems"
                v-model="parameterName"
                item-text="name"
                item-value="value"
                label="Select Parameter"
                @change="setAdditionalParams($event)"
                :rules="paramRequired"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-select
                :items="unitItems"
                label="Select Unit"
                v-model="unitName"
                @input="selectUnitWithLive()"
                item-text="Unit"
                item-value="Unit"
                :rules="unitRequired"
                dense
              ></v-select>
            </v-col>

            <v-col cols="12" sm="3">
              <v-select
                :items="timeRangeItems"
                label="Select Time Ranges"
                @input="submitBridgeData()"
                v-model="timeRange"
                item-text="name"
                item-value="time"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3" style="display: flex;">
              <v-btn @click.stop="dialog = true" color="primary" small style="margin-right: 10px;">Custom Time</v-btn>
              <v-btn @click.stop="dialog2 = true" color="primary" small>Compare</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        
      </v-card>
      <v-dialog
        v-model="dialog"
        max-width="500">
        <v-card style="padding:10px">
          <v-row>
              <v-col cols="12" sm="12">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fromDate"
                      label="From Date"
                      hint="MM/DD/YYYY format"
                      persistent-hint
                      prepend-icon="mdi-calendar-outline"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fromDate"
                    no-title
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6" sm="6">
                <v-text-field
                  prepend-icon="mdi-calendar-outline"
                  label="Hours"
                  placeholder="Enter Hours"
                  v-model="fromDateHour"
                  :rules="fromHourRequired"
                ></v-text-field>
              </v-col>

              <v-col cols="6" sm="6">
                <v-text-field
                  label="Minutes"
                  prepend-icon="mdi-calendar-outline"
                  placeholder="Enter Minutes"
                  v-model="fromDateMinute"
                  :rules="fromMinuteRequired"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="toDate"
                      label="To Date"
                      hint="MM/DD/YYYY format"
                      persistent-hint
                      prepend-icon="mdi-calendar-outline"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="toDate" no-title @input="menu2 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6" sm="6">
                <v-text-field
                  label="Hours"
                  placeholder="Enter Hours"
                  prepend-icon="mdi-calendar-outline"
                  v-model="toDateHour"
                  :rules="toHourRequired"
                ></v-text-field>
              </v-col>

              <v-col cols="6" sm="6">
                <v-text-field
                  label="Minutes"
                  placeholder="Enter Minutes"
                  prepend-icon="mdi-calendar-outline"
                  v-model="toDateMinute"
                  :rules="toMinuteRequired"
                ></v-text-field>
              </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" align-self="center">
              <v-btn @click="submitCustomTime()" color="primary" small>Submit</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog2" max-width="500">
        <v-card style="padding:20px;">
          <v-row>
            <v-col cols="6" sm="6">
              <v-text-field
                label="From Hours"
                placeholder="Enter Hours"
                prepend-icon="mdi-clock-outline"
                v-model="fromDateCompare"
                :rules="fromHourRequired"
              ></v-text-field>
            </v-col>

            <v-col cols="6" sm="6">
              <v-text-field
                label="To Hours"
                placeholder="Enter Hours"
                prepend-icon="mdi-clock-outline"
                v-model="toDateCompare"
                :rules="fromMinuteRequired"
              ></v-text-field>
            </v-col>

            <v-col cols="6" sm="6">
              <!-- <v-select
                label="Choose Previous Day"
                placeholder="Choose Previous Day"
                :items="itemDays"
                item-text="name"
                item-value="value"
                v-model="previousDay"
                :rules="toHourRequired"
              ></v-select> -->
              <v-menu
                  v-model="menu1Two"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="fromDateTwo"
                    label="Day 1"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    prepend-icon="mdi-calendar-outline"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="fromDateTwo"
                  no-title
                  @input="menu1Two = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6" sm="6">
              <!-- <v-select
                label="Choose Previous Day"
                placeholder="Choose Previous Day"
                :items="itemDays"
                item-text="name"
                item-value="value"
                v-model="previousDay"
                :rules="toHourRequired"
              ></v-select> -->
              <v-menu
                  v-model="menu2Two"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="toDateTwo"
                    label="Day 2"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    prepend-icon="mdi-calendar-outline"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="toDateTwo"
                  no-title
                  @input="menu2Two = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6" sm="6" v-if="!health">
              <v-select
                label="Axis Name"
                placeholder="Choose Axis Name"
                prepend-icon="mdi-graph-outline"
                :items="axisNameList"
                item-text="name"
                item-value="value"
                v-model="axisName"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="12">
              <v-btn small color="primary" @click="sumbitCompare()">Submit</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-row v-if="tabResult">
        <v-col cols="12" md="12">
          <v-card elevation="0">
            <!-- end -->
            <div v-if="noHealth">
              <v-tabs background-color="indigo darken-4" dark centered  v-model="tab">
                <v-tab v-for="item of tableTitle" :key="item" >{{item}}</v-tab>
                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <!-- <LinePlot :myProps="linePlotData" /> -->
                        <SeismicLinePlot :myProps="allData" />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item>
                    <!-- DataTable -->
                    <SeismicDataTable :myProps="allData" />
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </div>
            <div v-if="health">
              <v-tabs background-color="indigo darken-4" dark centered  v-model="tab">
                <v-tab v-for="item of tableTitle" :key="1+item">{{item}}</v-tab>
                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <!-- <v-row>
                          <v-col cols="12"> -->
                            <SeismicBarChart :myProps="allData"/>
                          <!-- </v-col>
                        </v-row> -->
                      </v-card-text>
                    </v-card> 
                  </v-tab-item>
                  <v-tab-item>
                    <v-card>
                      <v-card-text>
                        <!-- <LinePlot :myProps="linePlotData" /> -->
                        <SeismicLinePlot :myProps="allData" />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item>
                    <!-- DataTable -->
                    <SeismicDataTable :myProps="allData" />
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-form>

      
    </v-container>
</template>


<style></style>

<script lang="ts" src="./SeismicData.ts">
</script>