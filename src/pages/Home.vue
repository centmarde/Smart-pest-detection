<template>
  <LayoutWrapper>
    <template #content>
      <v-app>
        <v-main class="bg-grey-lighten-4">
          <!-- Main Container -->
          <v-container
            :class="{
              'pa-2': $vuetify.display.xs,
              'pa-4': !$vuetify.display.xs,
            }"
            fluid
          >
            <!-- Welcome Section -->
            <v-row>
              <v-col cols="12">
                <v-card class="dashboard-card rounded-xl" elevation="1">
                  <v-card-item>
                    <div>
                      <div class="welcome-title mb-1">Welcome back</div>
                      <div class="text-h5 mb-1">{{ username }}</div>
                      <div class="d-flex align-center">
                        <v-icon
                          color="success"
                          class="status-indicator mr-2"
                          size="small"
                          >mdi-circle</v-icon
                        >
                        <span class="status-text">System Active</span>
                      </div>
                    </div>
                    <template v-slot:append>
                      <v-avatar :image="userAvatar" size="large"></v-avatar>
                    </template>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>

            <!-- Stats Section -->
            <v-row>
              <v-col
                v-for="(stat, index) in stats"
                :key="index"
                cols="6"
                sm="6"
                md="4"
              >
                <v-card
                  class="rounded-lg dashboard-card"
                  elevation="0"
                  :class="stat.color"
                >
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-icon
                        :icon="stat.icon"
                        size="small"
                        :color="stat.iconColor"
                      ></v-icon>
                    </template>
                    <v-card-title class="text-h4">{{
                      stat.value
                    }}</v-card-title>
                    <v-card-subtitle>{{ stat.title }}</v-card-subtitle>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>

            <!-- Time Filter -->
            <v-row>
              <v-col cols="12">
                <v-card
                  class="rounded-lg dashboard-card"
                  elevation="0"
                  text-align="center"
                  justify-content="center"
                >
                  <v-card-text>
                    <v-btn-toggle
                      v-model="selectedTimeframe"
                      mandatory
                      color="primary"
                      rounded="lg"
                      class="w-100"
                    >
                      <v-btn
                        v-for="option in timeframeOptions"
                        :key="option.value"
                        :value="option.value"
                        :prepend-icon="option.icon"
                        class="flex-grow-1"
                      >
                        {{ option.label }}
                      </v-btn>
                    </v-btn-toggle>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Chart Section -->
            <v-row>
              <v-col cols="12">
                <v-card class="rounded-lg dashboard-card" elevation="0">
                  <v-card-title class="px-4 pt-4">
                    Scan Activity
                    <v-spacer></v-spacer>
                    <span class="text-caption" style="color: #D3E5F1;">
                      Total scans: {{ totalScans }}
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <v-chart class="chart" :option="chartOption" autoresize />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Action Button -->
            <v-btn
              color="primary"
              class="text-none rounded-lg mt-4"
              block
              size="large"
              elevation="2"
              :prepend-icon="mdiQrcodeScan"
              @click="startScan"
            >
              Start New Scan
            </v-btn>
          </v-container>
        </v-main>
      </v-app>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {
  mdiQrcodeScan,
  mdiClockOutline,
  mdiCalendarMonth,
  mdiCalendarWeek,
  mdiBugOutline,
  mdiPercent,
} from "@mdi/js";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
]);

interface TimeframeOption {
  label: string;
  value: string;
  icon: string;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  iconColor: string;
  color: string;
}

const username = ref("Administrator");
const userAvatar = ref("https://api.dicebear.com/7.x/avataaars/svg?seed=admin");
const selectedTimeframe = ref("day");
const totalScans = ref(156);

const stats: StatCard[] = [
  {
    title: "Today's Scans",
    value: 23,
    icon: mdiBugOutline,
    iconColor: "primary",
    color: "bg-primary-lighten-4",
  },
  {
    title: "Success Rate",
    value: "98%",
    icon: mdiPercent,
    iconColor: "success",
    color: "bg-success-lighten-4",
  },
];

const timeframeOptions: TimeframeOption[] = [
  { label: "Hours", value: "hour", icon: mdiClockOutline },
  { label: "Days", value: "day", icon: mdiCalendarWeek },
  { label: "Months", value: "month", icon: mdiCalendarMonth },
];

const chartData = {
  hour: {
    labels: ["10AM", "11AM", "12PM", "1PM", "2PM"],
    data: [1, 3, 5, 2, 6],
  },
  day: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    data: [5, 8, 12, 20, 6],
  },
  month: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    data: [50, 80, 100, 90, 120],
  },
};


const chartOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: chartData[selectedTimeframe.value].labels,
    axisTick: {
      alignWithLabel: true,
    },
    axisLabel: {
      color: "#D3E5F1", 
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      color: "#D3E5F1", 
    },
  },
  series: [
    {
      name: "Scans",
      type: "bar",
      barWidth: "60%",
      data: chartData[selectedTimeframe.value].data,
      itemStyle: {
        color: "#D3E5F1",
      },
    },
  ],
}));


const startScan = () => {
  console.log("Starting new scan...");
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap");

.pest-scanner-app {
  background: #8ca189;
  min-height: 100vh;
}

.v-main {
  background: #8ca189 !important;
  overflow: auto; 
}

.v-container {
  overflow-y: auto; 
  max-height: calc(100vh - 64px);
}

.dashboard-card {
  background-color: #5e7962;
  border: 1px solid rgba(32, 63, 42, 0.7);
  transition: all 0.3s ease;
  border-radius: 10px;
  color: #ffffff;
}

.welcome-title {
  font-family: "Montserrat", sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.3;
}

.status-text {
  font-family: "Roboto", sans-serif;
  font-size: 0.875rem;
  color: #ffffff;
}

@media (max-width: 600px) {
  .welcome-title {
    font-size: 1.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .scan-button-wrapper {
    bottom: 16px;
  }
}

.chart {
  height: 200px;
  width: 100%;
}
</style>
