<template>
    <v-card>
        <v-row class="pa-2">
            <v-col cols="12" class="py-0">
                <span class="font-weight-bold headline">
                    Patient Charts
                </span>
                <v-btn icon title="Create Patient" class="float-right" color="contrast" to="patients/details">
                    <v-icon>mdi-account-plus</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="12" class="py-0">
                <v-card-title class="float-right">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" 
                        hide-details class="half-width" dense></v-text-field>
                </v-card-title>
            </v-col>
            <v-col cols="12" class="py-0">
                <v-data-table :items="patients" :loading="loading" :headers="headers" :search="search">
                    <template v-slot:item.printID="{ item }">
                        <v-btn icon :color="item.printID? 'success' : 'blue-grey'" :disabled="item.printID">
                            <v-icon>mdi-account-card-details</v-icon>
                        </v-btn>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn class="float-right" icon color="contrast" :to="'patients/details/'+item.id">
                            <v-icon>mdi-arrow-right-bold-box</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { Alert } from "../../Class/Alert";
import { eGetPatients } from "../../String";
import { TypeAlert } from "../../DataStatic";
export default {
    async mounted() {
        this.loading = true;
        try {
            await this.GetAllPatients({$http:this.$api});
        } 
        catch(e){
            this.$alerts.CreateAlert(new Alert(eGetPatients, TypeAlert.Alert, "error", e));
        }
        this.loading = false;
    },
    data() {
        return {
            search: '',
            headers: [
                {
                    text: 'Patient',
                    value:"fullName"
                },
                { text: 'DoB', value: 'dateBirth' },
                { text: 'Type', value: 'typeText' },
                { text: 'Location', value: 'clinicText' },
                { text: 'Print ID', value: 'printID', sortable: false, filterable: false },
                { text: '', value: 'actions', sortable: false, filterable: false }
            ],
            loading: false
        }
    },
    methods: {
        ...mapActions("patient", [
            "GetAllPatients"
        ])
    },
    computed: {
        ...mapState("patient", [
            "patients"
        ])
    }
}
</script>