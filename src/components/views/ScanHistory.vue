<template>
  <LayoutWrapper>
    <template #content>
      <v-container class="pa-4">
        <!-- Search and Filter Section -->
        <v-card
          class="mx-auto mb-4 search-filter-card"
          max-width="500"
          rounded="lg"
        >
          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search scans..."
              variant="outlined"
              density="compact"
              hide-details
              class="mb-4"
              @update:model-value="debounceSearch"
            ></v-text-field>

            <div class="d-flex gap-2">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Sort by"
                density="compact"
                hide-details
                variant="outlined"
                class="flex-grow-1"
              ></v-select>

              <v-menu
                v-model="filterMenu"
                :close-on-content-click="false"
                location="bottom end"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="primary"
                    size="medium"
                    variant="outlined"
                    v-bind="props"
                    class="filter-btn"
                  >
                    <v-icon left>mdi-filter</v-icon>
                    Filter
                    <v-badge
                      v-if="activeFiltersCount > 0"
                      :content="activeFiltersCount"
                      color="primary"
                      class="ml-2"
                    ></v-badge>
                  </v-btn>
                </template>

                <v-card min-width="300" class="filter-menu">
                  <v-card-title class="text-subtitle-1">Filters</v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="filters.severity"
                      :items="severityOptions"
                      label="Severity"
                      density="comfortable"
                      hide-details
                      variant="outlined"
                      class="mb-4"
                    ></v-select>

                    <v-select
                      v-model="filters.timeRange"
                      :items="timeRangeOptions"
                      label="Time Range"
                      density="comfortable"
                      hide-details
                      variant="outlined"
                      class="mb-4"
                    ></v-select>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="resetFilters"> Reset </v-btn>
                    <v-btn color="primary" @click="applyFilters"> Apply </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </div>
          </v-card-text>
        </v-card>

        <!-- History List -->
        <v-card
          class="mx-auto history-card"
          max-width="500"
          rounded="lg"
          :loading="loading"
        >
          <v-list class="py-2 history-list">
            <template v-if="filteredScans.length > 0">
              <v-list-item
                v-for="scan in filteredScans"
                :key="scan.id"
                :title="scan.diagnosis"
                :subtitle="formatDate(scan.created_at)"
                class="history-item"
                link
                @click="viewScanDetails(scan)"
              >
                <template v-slot:prepend>
                  <v-avatar size="56" rounded="lg" class="mr-3">
                    <v-img :src="scan.image_url" cover></v-img>
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

              <div v-if="hasMore" class="text-center pa-4">
                <v-btn
                  color="primary"
                  variant="text"
                  :loading="loadingMore"
                  @click="loadMore"
                >
                  Load More
                </v-btn>
              </div>
            </template>

            <v-list-item v-else-if="!loading" class="pa-4">
              <div class="text-center w-100">
                <v-icon size="48" color="grey" class="mb-2"
                  >mdi-leaf-off</v-icon
                >
                <div class="text-body-1 text-medium-emphasis">
                  {{ searchQuery ? "No matches found" : "No scans yet" }}
                </div>
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

        <ScanDetailsDialog v-model="isDialogOpen" :scan="selectedScan" />
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ScanDetailsDialog from "./ScanDetails.vue";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";

interface ScanHistoryItem {
  id: number;
  diagnosis: string;
  scientific_name: string;
  created_at: string;
  image_url: string;
  severity: "High" | "Medium" | "Low";
  description: string;
}

// Mock Data
const mockScans: ScanHistoryItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  diagnosis: `Scan ${i + 1}`,
  scientific_name: `Scientific Name ${i + 1}`,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  image_url: `/src/assets/default/pest${(i % 5) + 1}.jpg`,
  severity: ["High", "Medium", "Low"][i % 3] as "High" | "Medium" | "Low",
  description: `Description of scan ${i + 1}`,
}));

// State
const scans = ref<ScanHistoryItem[]>(mockScans);
const loading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(false);
const searchQuery = ref("");
const selectedScan = ref<ScanHistoryItem | null>(null);
const isDialogOpen = ref(false);
const filterMenu = ref(false);

// Filters and Sort (remain the same as in your code)
const sortBy = ref("date");
const filters = ref({
  severity: "all",
  timeRange: "all",
});

const sortOptions = [
  { title: "Date (Newest First)", value: "date" },
  { title: "Severity (High to Low)", value: "severity" },
  { title: "Name (A-Z)", value: "name" },
];

const severityOptions = [
  { title: "All Severities", value: "all" },
  { title: "High", value: "high" },
  { title: "Medium", value: "medium" },
  { title: "Low", value: "low" },
];

const timeRangeOptions = [
  { title: "All Time", value: "all" },
  { title: "Last 7 Days", value: "7days" },
  { title: "Last 30 Days", value: "30days" },
  { title: "Last 90 Days", value: "90days" },
];

// Computed
const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.severity !== "all") count++;
  if (filters.value.timeRange !== "all") count++;
  return count;
});

const filteredScans = computed(() => {
  let result = [...scans.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (scan) =>
        scan.diagnosis.toLowerCase().includes(query) ||
        scan.scientific_name.toLowerCase().includes(query)
    );
  }

  // Apply severity filter
  if (filters.value.severity !== "all") {
    result = result.filter(
      (scan) =>
        scan.severity.toLowerCase() === filters.value.severity.toLowerCase()
    );
  }

  // Apply time range filter
  if (filters.value.timeRange !== "all") {
    const now = new Date();
    const days = parseInt(filters.value.timeRange);
    const pastDate = new Date(now.setDate(now.getDate() - days));
    result = result.filter((scan) => new Date(scan.created_at) >= pastDate);
  }

  // Apply sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case "date":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "severity":
        const severityOrder = { High: 3, Medium: 2, Low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      case "name":
        return a.diagnosis.localeCompare(b.diagnosis);
      default:
        return 0;
    }
  });

  return result;
});

// Methods
const debounceSearch = (value: string) => {
  searchQuery.value = value;
};

const loadMore = async () => {
  // Disabled in static version
  loadingMore.value = false;
  hasMore.value = false;
};

const resetFilters = () => {
  filters.value = {
    severity: "all",
    timeRange: "all",
  };
  searchQuery.value = "";
};

const applyFilters = () => {
  filterMenu.value = false;
};

const viewScanDetails = (scan: ScanHistoryItem) => {
  selectedScan.value = scan;
  isDialogOpen.value = true;
};

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

const getSeverityColor = (severity: ScanHistoryItem["severity"]): string => {
  const colors: Record<ScanHistoryItem["severity"], string> = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };
  return colors[severity] || "grey";
};
</script>

<style scoped>
.search-filter-card,
.history-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.history-list {
  max-height: calc(100vh - 380px);
  overflow-y: auto;
}

.history-item {
  transition: background-color 0.2s ease;
}

.history-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.filter-btn {
  min-width: 100px;
}

.filter-menu {
  border-radius: 12px;
}

@media (max-width: 600px) {
  .v-container {
    padding: 12px !important;
  }

  .text-h4 {
    font-size: 1.5rem !important;
  }

  .history-list {
    max-height: calc(100vh - 340px);
  }
}
</style>
