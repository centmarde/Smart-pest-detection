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
                :src="scan.imageUrl"
                height="300"
                cover
                class="rounded-lg"
              ></v-img>
            </v-col>
          </v-row>
  
          <v-row class="mt-2">
            <v-col cols="12">
              <div class="d-flex align-center mb-4">
                <h2 class="text-h6 mr-2">{{ scan.diagnosis }}</h2>
                <v-chip
                  :color="getSeverityColor(scan.severity)"
                  size="small"
                  class="text-caption"
                >
                  {{ scan.severity }}
                </v-chip>
              </div>
  
              <div class="details-grid">
                <div class="detail-item">
                  <span class="text-subtitle-2 text-medium-emphasis">Scientific Name</span>
                  <span class="text-body-1">{{ scan.scientificName }}</span>
                </div>
  
                <div class="detail-item">
                  <span class="text-subtitle-2 text-medium-emphasis">Date Detected</span>
                  <span class="text-body-1">{{ formatDate(scan.date) }}</span>
                </div>
  
                <div class="detail-item col-span-2">
                  <span class="text-subtitle-2 text-medium-emphasis">About</span>
                  <p class="text-body-1">{{ scan.description }}</p>
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
  interface ScanDetail {
    id: number;
    diagnosis: string;
    scientificName: string;
    date: Date;
    imageUrl: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
  }
  
  interface Props {
    modelValue: boolean;
    scan?: ScanDetail;
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
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  const getSeverityColor = (severity: ScanDetail['severity']): string => {
    const colors: Record<ScanDetail['severity'], string> = {
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