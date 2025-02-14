<template>
    <v-container class="history-container pa-4">
      <div class="text-center mb-4">
        <h1 class="text-h4 font-weight-bold text-primary mb-2">Scan History</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Your Previous Plant Analyses
        </p>
      </div>

      <v-card class="mx-auto history-card" max-width="500" rounded="lg">
        <v-list class="py-2">
          <v-list-subheader class="text-primary font-weight-medium">
            Recent Scans
          </v-list-subheader>

          <template v-if="scanHistory.length > 0">
            <v-list-item
              v-for="scan in scanHistory"
              :key="scan.id"
              :title="scan.diagnosis"
              :subtitle="formatDate(scan.date)"
              class="history-item"
              link
              @click="viewScanDetails(scan)"
            >
              <template v-slot:prepend>
                <v-avatar size="56" rounded="lg" class="mr-3">
                  <v-img :src="scan.imageUrl" cover></v-img>
                </v-avatar>
              </template>

              <template v-slot:append>
                <v-chip
                  :color="getSeverityColor(scan.severity)"
                  size="small"
                  class="text-caption"
                >
                  {{ scan.severity }}
                </v-chip>
              </template>
            </v-list-item>
          </template>

          <v-list-item v-else class="pa-4">
            <div class="text-center w-100">
              <v-icon size="48" color="grey" class="mb-2">mdi-leaf-off</v-icon>
              <div class="text-body-1 text-medium-emphasis">No scans yet</div>
              <v-btn
                color="primary"
                variant="text"
                class="mt-3"
                @click="$router.push('/')"
              >
                Start Scanning
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card
        class="mt-4 mx-auto filter-card"
        max-width="500"
        variant="outlined"
        rounded="lg"
      >
        <v-list>
          <v-list-subheader>Sort & Filter</v-list-subheader>

          <v-list-item>
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              density="compact"
              hide-details
              variant="outlined"
              class="mb-2"
            ></v-select>
          </v-list-item>

          <v-list-item>
            <v-select
              v-model="filterBySeverity"
              :items="severityOptions"
              density="compact"
              hide-details
              variant="outlined"
            ></v-select>
          </v-list-item>
        </v-list>
      </v-card>

      <ScanDetailsDialog v-model="isDialogOpen" :scan="selectedScan" />
    </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ScanDetailsDialog from "./ScanDetails.vue";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";

interface ScanHistoryItem {
  id: number;
  diagnosis: string;
  scientificName: string;
  date: Date;
  imageUrl: string;
  severity: "High" | "Medium" | "Low";
  description: string;
}

interface SortOption {
  title: string;
  value: "date" | "severity" | "name";
}

interface SeverityOption {
  title: string;
  value: "all" | "high" | "medium" | "low";
}

const selectedScan = ref<ScanHistoryItem | undefined>();
const isDialogOpen = ref(false);

const scanHistory = ref<ScanHistoryItem[]>([
  {
    id: 1,
    diagnosis: "Aphid Infestation",
    scientificName: "Aphidoidea",
    date: new Date("2024-02-14"),
    imageUrl: "/src/assets/default/pest1.jpg",
    severity: "High",
    description:
      "Small sap-sucking insects that can cause significant damage to plants by feeding on plant tissue. They often cluster on new growth and can transmit plant viruses.",
  },
  {
    id: 2,
    diagnosis: "Leaf Spot Disease",
    scientificName: "Septoria lycopersici",
    date: new Date("2024-02-13"),
    imageUrl: "/src/assets/default/pest2.jpg",
    severity: "Medium",
    description:
      "A fungal disease that causes small, circular spots with dark borders on leaves. Can lead to leaf yellowing and defoliation if left untreated.",
  },
  {
    id: 3,
    diagnosis: "Healthy Plant",
    scientificName: "N/A",
    date: new Date("2024-02-12"),
    imageUrl: "/src/assets/default/pest3.jpg",
    severity: "Low",
    description:
      "Plant appears healthy with no signs of pest infestation or disease.",
  },
]);

const sortBy = ref<SortOption["value"]>("date");
const filterBySeverity = ref<SeverityOption["value"]>("all");

const sortOptions: SortOption[] = [
  { title: "Date (Newest First)", value: "date" },
  { title: "Severity (High to Low)", value: "severity" },
  { title: "Name (A-Z)", value: "name" },
];

const severityOptions: SeverityOption[] = [
  { title: "All Severities", value: "all" },
  { title: "High", value: "high" },
  { title: "Medium", value: "medium" },
  { title: "Low", value: "low" },
];

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getSeverityColor = (severity: ScanHistoryItem["severity"]): string => {
  const colors: Record<ScanHistoryItem["severity"], string> = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };
  return colors[severity] || "grey";
};

const viewScanDetails = (scan: ScanHistoryItem): void => {
  selectedScan.value = scan;
  isDialogOpen.value = true;
};
</script>

<style scoped>
.history-container {
  max-width: 100%;
  min-height: 100vh;
  background: #8ca189;
  overflow: auto;
}

.history-card,
.filter-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.history-item {
  transition: background-color 0.2s ease;
}

.history-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

@media (max-width: 600px) {
  .history-container {
    padding: 16px !important;
  }

  .text-h4 {
    font-size: 1.75rem !important;
  }
}
</style>
