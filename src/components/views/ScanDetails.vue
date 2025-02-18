<template>
    <v-dialog v-model="isOpen" max-width="600px">
      <v-card class="scan-details-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <span class="text-h5">Scan Details</span>
          <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
        </v-card-title>
  
        <v-card-text v-if="scan" class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-img
                :src="scan.pest_scan.image_path"
                height="300"
                cover
                class="rounded-lg"
              ></v-img>
            </v-col>
          </v-row>
  
          <v-row class="mt-2">
            <v-col cols="12">
              <div class="d-flex align-center mb-4">
                <h2 class="text-h6 mr-2">{{ scan.pest_scan.name }}</h2>
                <v-chip
                  :color="getSeverityColor(scan.pest_scan.alert_lvl)"
                  size="small"
                  class="text-caption"
                >
                  {{ scan.pest_scan.alert_lvl }}
                </v-chip>
              </div>
  
              <div class="details-grid">
                <div class="detail-item">
                  <span class="text-subtitle-2 text-medium-emphasis">Confidence</span>
                  <span class="text-body-1">{{ (scan.pest_scan.confidence * 100).toFixed(0) }}%</span>
                </div>
  
                <div class="detail-item">
                  <span class="text-subtitle-2 text-medium-emphasis">Date Detected</span>
                  <span class="text-body-1">{{ formatDate(scan.created_at) }}</span>
                </div>
  
                <div class="detail-item col-span-2">
                  <span class="text-subtitle-2 text-medium-emphasis">Analysis</span>
                  <div class="text-body-1" v-html="scan.pest_scan.comment"></div>
                </div>
  
                <div class="detail-item col-span-2">
                  <span class="text-subtitle-2 text-medium-emphasis">Recommended Action</span>
                  <div class="text-body-1" v-html="scan.pest_scan.recommended_action"></div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
  
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="tonal"
            @click="close"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';

  interface PestScan {
    id: number;
    created_at: string;
    image_path: string;
    name: string;
    alert_lvl: string;
    comment: string;
    confidence: number;
    recommended_action: string;
  }
  
  interface ScanHistoryItem {
    id: number;
    created_at: string;
    scan_id: number;
    user_id: number;
    pest_scan: PestScan;
  }
  
  interface Props {
    modelValue: boolean;
    scan?: ScanHistoryItem;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(['update:modelValue']);
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const close = () => {
    isOpen.value = false;
  };
  
  const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(date));
  };
  
  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'success'
    };
    return colors[severity] || 'grey';
  };
  </script>
  
  <style scoped>
  .scan-details-dialog {
    overflow: hidden;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 16px;
  }
  
  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .col-span-2 {
    grid-column: span 2;
  }
  
  @media (max-width: 600px) {
    .details-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  
    .col-span-2 {
      grid-column: span 1;
    }
  }
  </style>