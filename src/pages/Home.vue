<template>
  <LayoutWrapper>
    <template #content>
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
                  <v-avatar size="70" class="profile_avatar">
                    <v-img :src="profileImage" cover>
                      <template v-slot:placeholder>
                        <v-row align="center" justify="center">
                          <v-progress-circular
                            indeterminate
                            color="success"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-avatar>
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
                    :color="stat.iconColor"
                    size="small"
                  />
                </template>
                <v-card-title class="text-h4">{{ stat.value }}</v-card-title>
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
            <v-row class="mb-10">
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

          </v-container>

    </template>
  </LayoutWrapper>
  
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { useScanResultStore } from "@/stores/scanResultStore";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {
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
import { supabase } from "@/stores/authUser";

const fetchUserInfo = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!data?.user) throw new Error("User not authenticated");

    email.value = data.user.email || "";
    await fetchUserProfile(data.user.id);
    await loadStats(data.user.id);
    await loadChartData(data.user.id);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const fetchUserProfile = async (userId: string) => {
  if (!userId) return;

  const { data, error } = await supabase
    .from("users")
    .select("username, profile_image")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  } else if (data) {
    username.value = data.username || "";
    profileImage.value = data.profile_image || profileImage.value;
  }
};



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

const scanResultStore = useScanResultStore();
const totalScans = computed(() => {
  return scanResultStore.ScanResult.length;
});

const username = ref("");
const profileImage = ref("https://randomuser.me/api/portraits/lego/1.jpg");
const selectedTimeframe = ref<Timeframe>("day");
const email = ref("");

type Timeframe = "hour" | "day" | "month";

const stats = ref<StatCard[]>([
  {
    title: "Scans Today",
    value: "Loading",
    icon: mdiBugOutline,
    iconColor: "primary",
    color: "bg-primary-lighten-4",
  },
  {
    title: "Success Rate",
    value: "Loading",
    icon: mdiPercent,
    iconColor: "success",
    color: "bg-success-lighten-4",
  },
]);

const loadStats = async (userId: string) => {
  const statsData = await fetchUserScanStats(userId);
  if (statsData) {
    stats.value = [
      {
        title: "Scans Today",
        value: statsData.scansTodayCount,
        icon: mdiBugOutline,
        iconColor: "primary",
        color: "bg-primary-lighten-4",
      },
      {
        title: "Recent Scan Success Rate",
        value: `${(statsData.successRate * 100).toFixed(2)}%`,
        icon: mdiPercent,
        iconColor: "success",
        color: "bg-success-lighten-4",
      },
    ];
  }
};

const timeframeOptions: TimeframeOption[] = [
  { label: "Hours", value: "hour", icon: mdiClockOutline },
  { label: "Days", value: "day", icon: mdiCalendarWeek },
  { label: "Months", value: "month", icon: mdiCalendarMonth },
];

interface ChartData {
  labels: string[];
  data: number[];
}

const chartData = ref<Record<Timeframe, ChartData>>({
  hour: { labels: [], data: [] },
  day: { labels: [], data: [] },
  month: { labels: [], data: [] },
});

const chartOption = computed(() => ({
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
  xAxis: {
    type: "category",
    data: chartData.value[selectedTimeframe.value].labels,
    axisTick: { alignWithLabel: true },
  },
  yAxis: { type: "value" },
  series: [
    {
      name: "Scans",
      type: "bar",
      barWidth: "60%",
      data: chartData.value[selectedTimeframe.value].data,
    },
  ],
}));

const fetchUserScanStats = async (userId: string) => {
  if (!userId) return;

  const today = new Date().toISOString().split("T")[0];

  try {
    const { data: todayScans, error: todayError } = await supabase
      .from("pest_scans")
      .select("id")
      .eq("user_id", userId as string) 
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`);

    if (todayError) throw todayError;

    const scansTodayCount = todayScans ? todayScans.length : 0;

    const { data: recentScan, error: recentError } = await supabase
      .from("pest_scans")
      .select("confidence")
      .eq("user_id", userId as string) 
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (recentError) throw recentError;

    const successRate = recentScan?.confidence ?? 0;
    return { scansTodayCount, successRate };
  } catch (error) {
    console.error("Error fetching scan stats:", error);
    return { scansTodayCount: 0, successRate: 0 };
  }
};

const loadChartData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("pest_scans")
      .select("created_at")
      .eq("user_id", userId as string) // Ensure it's treated as a UUID
      .order("created_at", { ascending: true });

    if (error) throw error;

    const hourlyData = new Array(24).fill(0);
    const dailyData = new Array(7).fill(0);
    const monthlyData = new Array(12).fill(0);

    data.forEach((scan) => {
      const date = new Date(scan.created_at);
      const hour = date.getHours();
      const day = date.getDay();
      const month = date.getMonth();

      hourlyData[hour]++;
      dailyData[day]++;
      monthlyData[month]++;
    });

    chartData.value = {
      hour: { labels: [...Array(24).keys()].map((h) => `${h}:00`), data: hourlyData },
      day: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], data: dailyData },
      month: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], data: monthlyData },
    };
  } catch (error) {
    console.error("Error loading chart data:", error);
  }
};


onMounted(async () => {
  await fetchUserInfo();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap");

.pest-scanner-app {
  background: #8ca189;
  min-height: 100dvh;
}

.v-main {
  background: #8ca189 !important;
  overflow: auto;
}

.profile-avatar {
  border: 4px solid rgb(0, 0, 0);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
