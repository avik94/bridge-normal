<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="8" offset-sm="2">
                <v-card flat>
                    <v-card-title color-secondary>Sensor Hierarchy</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-text-field label="Location" class="font-weight-medium"></v-text-field>
                        <v-text-field label="Designation of road" class="font-weight-medium"></v-text-field>
                        <v-row>
                            <v-col cols="6">
                                <v-text-field label="Chainage" class="font-weight-medium"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field label="Value" class="font-weight-medium"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-text-field label="Bridge type" class="font-weight-medium"></v-text-field>
                        <v-text-field label="Total length of the bridge" class="font-weight-medium"></v-text-field>
                        <v-text-field label="Number of span" class="font-weight-medium"></v-text-field>
                        <v-text-field label="Super structure" class="font-weight-medium"></v-text-field>
                        <v-row>
                            <v-col cols="10" offset="2">
                                <v-text-field label="Width of the Carriageway"
                                              class="font-weight-medium"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="10" offset="2" class="d-inline-flex">
                                <v-checkbox
                                        label="Have Median"
                                        color="green"
                                ></v-checkbox>
                                <v-checkbox
                                        label="Footpath"
                                        color="green"
                                        class="pl-2"
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-title color-secondary>Position of sensor</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-select
                                label="Span number"
                                class="font-weight-medium"
                        ></v-select>
                        <v-text-field label="Sensor Id" class="font-weight-medium"></v-text-field>
                        <v-select
                                label="Position of sensor"
                                class="font-weight-medium"
                        ></v-select>
                        <v-select
                                label="Location of sensor on the girder"
                                class="font-weight-medium"
                        ></v-select>
                    </v-card-text>

                    <div class="text-center pa-5">
                        <v-btn color="primary" to="/">Submit</v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style></style>

<script lang="ts">

    import Vue from "vue";
    import {Component} from "vue-property-decorator";

    @Component({

    })
    export default class AddSensor extends Vue {

    }
</script>
