<script setup lang="ts">
import { ref, onMounted } from "vue";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";
import Loader from "@/components/common/Loader.vue";
import { supabase } from "@/lib/supabase";

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

interface ScanHistory {
  id: number;
  created_at: string;
  scan_id: number;
  user_id: number;
  pest_scan?: PestScan;
}

const userScans = ref<PestScan | null>(null);
const recentScans = ref<PestScan[]>([]);
const isLoading = ref<boolean>(true);
const imageLoading = ref<boolean>(true);

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return "success";
  if (confidence >= 0.6) return "warning";
  return "error";
};

const getIssueColor = (confidence: number): string => {
  if (confidence >= 0.8) return "error";
  if (confidence >= 0.6) return "warning";
  return "info";
};

const getOverallSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };
  return colors[severity] || "info";
};

const getOverallSeverity = (): string => {
  const severityLevels = recentScans.value.map(scan => scan.alert_lvl);
  if (severityLevels.includes("High")) return "High";
  if (severityLevels.includes("Medium")) return "Medium";
  return "Low";
};

const getAIAnalysis = (): string => {
  const issues = recentScans.value.map((r) => r.name.toLowerCase());

  if (issues.includes("healthy")) {
    return "Your plant appears to be healthy! Continue with regular care and maintenance to keep it thriving.";
  }

  if (issues.includes("aphids")) {
    return "I've detected signs of aphid infestation. These small insects feed on plant sap and can quickly multiply, potentially causing significant damage to your plant's health and growth.";
  }

  if (issues.includes("leaf-spot")) {
    return "Analysis shows evidence of leaf spot disease. This fungal infection can spread to other leaves and plants if not treated promptly. The affected areas may expand and eventually cause leaf drop.";
  }

  return "I've identified potential issues with your plant. Please review the detailed findings below for specific concerns and recommended actions.";
};

const getRecommendedAction = (): string => {
  const issues = recentScans.value.map((r) => r.name.toLowerCase());

  if (issues.includes("aphids")) {
    return "Apply insecticidal soap or neem oil solution. Remove heavily infested leaves and isolate the plant to prevent spread to other plants. Consider introducing natural predators like ladybugs for organic control.";
  }

  if (issues.includes("leaf-spot")) {
    return "Remove and dispose of affected leaves, improve air circulation around the plant, and avoid overhead watering. Apply an appropriate fungicide and adjust watering practices to keep leaves dry.";
  }

  return "Monitor the plant closely for any changes and consider consulting a plant specialist for a detailed treatment plan.";
};

const getCurrentDate = (): string => {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getIssueIcon = (name: string): string => {
  const icons: Record<string, string> = {
    "Rice Bug": "mdi-bug",
    "Brown Planthopper": "mdi-leaf-off",
    "Green Leaf Hopper": "mdi-leaf",
    "Rice Black Bug": "mdi-bug",
    "White Yellow Stemborer": "mdi-butterfly",
    default: "mdi-alert-circle",
  };
  return icons[name] || icons.default;
};

const formatClassName = (className: string): string => {
  return className
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getIssueDescription = (className: string): string => {
  const descriptions: Record<string, string> = {
    aphids:
      "Small sap-sucking insects that can cause significant damage to plants.",
    "leaf-spot":
      "Fungal disease causing spots on leaves that can lead to defoliation.",
    healthy: "No significant issues detected in the plant.",
    default: "Potential plant health issue detected.",
  };
  return descriptions[className.toLowerCase()] || descriptions.default;
};

const fetchUserScans = async (): Promise<PestScan | null> => {
  const userId = localStorage.getItem("user_id");
  console.log('User ID:', userId);
  if (!userId) return null;

  // Get user's ID from users table first
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    console.error('Error fetching user:', userError);
    return null;
  }

  // Fetch latest scan from scan_history with joined pest_scans data
  const { data: scanData, error: scanError } = await supabase
    .from('scan_history')
    .select(`
      *,
      pest_scan:pest_scans (*)
    `)
    .eq('user_id', userData.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (scanError) {
    console.error('Error fetching scan history:', scanError);
    return null;
  }

  if (scanData && scanData.pest_scan) {
    console.log('Latest Scan Data:', scanData);
    return scanData.pest_scan;
  }

  return null;
};

const fetchRecentScans = async (): Promise<PestScan[]> => {
  const userId = localStorage.getItem("user_id");
  if (!userId) return [];

  // Get user's ID from users table first
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    console.error('Error fetching user:', userError);
    return [];
  }

  // Fetch recent scans with joined pest_scans data
  const { data: scanData, error: scanError } = await supabase
    .from('scan_history')
    .select(`
      *,
      pest_scan:pest_scans (*)
    `)
    .eq('user_id', userData.id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (scanError) {
    console.error('Error fetching recent scans:', scanError);
    return [];
  }

  // Extract pest_scan data from each scan history record
  const pestScans = scanData
    ?.map(scan => scan.pest_scan)
    .filter((scan): scan is PestScan => scan !== null) || [];

  console.log('Recent Pest Scans:', pestScans);
  return pestScans;
};

const onImageLoaded = (): void => {
  imageLoading.value = false;
};

onMounted(async () => {
  const data = await fetchUserScans();
  userScans.value = data;
  isLoading.value = false;

  const recentScansData = await fetchRecentScans();
  recentScans.value = recentScansData;
  console.log('Recent Scans:', recentScansData);
});
</script>

<template>
  <LayoutWrapper>
    <template #content>
      <v-container class="pa-4 mb-10">
        <div v-if="isLoading" class="loading-state">
          <Loader />
          <div class="text-h6 mt-1 text-primary">Analyzing your plant...</div>
          <div class="text-body-2 text-medium-emphasis mt-1">
            Using AI to detect issues
          </div>
        </div>

        <div v-else class="result-content">
          <div class="text-center mb-1">
            <div class="text-subtitle-1 text-medium-emphasis">
              Here's what our system detected in your plant
            </div>
          </div>

          <v-card
            class="result-card mx-auto"
            max-width="500"
            rounded="lg"
            elevation="8"
          >
            <v-img
              :src="userScans?.image_path || ''"
              alt="Scanned Plant"
              :aspect-ratio="4 / 3"
              cover
              class="result-image"
              @load="onImageLoaded"
            >
              <template v-slot:placeholder>
                <div class="image-loader" v-if="imageLoading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                  ></v-progress-circular>
                </div>
              </template>

              <div v-if="imageLoading" class="image-overlay">
                <v-progress-circular
                  indeterminate
                  color="white"
                  size="64"
                ></v-progress-circular>
              </div>
            </v-img>

            <div v-if="!imageLoading && recentScans.length">
              <!-- AI Insights Section -->
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div class="text-h6 font-weight-medium">
                    <v-icon color="primary" class="mr-2">mdi-magnify</v-icon>
                    Detection Results
                  </div>
                  <v-chip color="primary" size="small" variant="elevated">
                    {{ recentScans.length }}
                    {{
                      recentScans.length === 1
                        ? "Issue"
                        : "Issues"
                    }}
                    Found
                  </v-chip>
                </div>

                <div class="results-list">
                  <v-card
                    v-for="(result, index) in recentScans"
                    :key="index"
                    variant="outlined"
                    class="mb-3 result-item"
                    rounded="lg"
                    elevation="1"
                  >
                    <v-card-text class="pa-4">
                      <div
                        class="d-flex align-center justify-space-between mb-2"
                      >
                        <div class="d-flex align-center">
                          <v-icon
                            :color="getIssueColor(result.confidence)"
                            size="24"
                            class="mr-2"
                          >
                            {{ getIssueIcon(result.name) }}
                          </v-icon>
                          <span class="text-h6">{{
                            formatClassName(result.name)
                          }}</span>
                        </div>
                        <v-chip
                          :color="getConfidenceColor(result.confidence)"
                          :text-color="
                            result.confidence > 0.6 ? 'white' : 'black'
                          "
                          size="small"
                          elevation="1"
                        >
                          {{ (result.confidence * 100).toFixed(0) }}% Confidence
                        </v-chip>
                      </div>

                      <v-progress-linear
                        :model-value="result.confidence * 100"
                        :color="getConfidenceColor(result.confidence)"
                        height="8"
                        rounded
                        class="mt-2"
                      ></v-progress-linear>

                      <div class="text-body-2 text-medium-emphasis mt-3">
                        {{ getIssueDescription(result.name) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
                <v-card
                  class="mb-4 ai-insights-card"
                  rounded="lg"
                  elevation="1"
                >
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="primary" size="24" class="mr-2"
                        >mdi-brain</v-icon
                      >
                      <span class="text-h6">Deep Think</span>
                    </div>

                    <div class="d-flex align-center justify-space-between mb-3">
                      <v-chip
                        :color="getOverallSeverityColor(getOverallSeverity())"
                        size="small"
                        class="mr-2"
                      >
                        {{ getOverallSeverity() }} Severity
                      </v-chip>
                      <v-chip color="primary" size="small">
                        {{ getCurrentDate() }}
                      </v-chip>
                    </div>

                    <div class="text-body-1 mb-3">
                      {{ getAIAnalysis() }}
                    </div>

                    <v-alert
                      v-if="getOverallSeverity() !== 'Low'"
                      :color="getOverallSeverityColor(getOverallSeverity())"
                      variant="tonal"
                      density="comfortable"
                    >
                      <div class="text-subtitle-2 font-weight-medium">
                        Recommended Action
                      </div>
                      <div class="text-body-2">
                        {{ getRecommendedAction() }}
                      </div>
                      
                    </v-alert>
                    <div class="text-body-2 pa-4 mt-2" style="background-color:#CCCCCC;" v-html="userScans?.recommended_action"></div>
                  </v-card-text>
                </v-card>
                <v-card
                  class="mb-4 ai-insights-card"
                  rounded="lg"
                  elevation="1"
                >
                
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="primary" size="24" class="mr-2">mdi-brain</v-icon>
                      <span class="text-h6">AI Detailed Analysis</span>
                    </div>
                    <div class="text-body-1 mb-3" v-html="userScans?.comment"></div>
                  </v-card-text>
                </v-card>
              </v-card-text>

              <v-card-actions class="pa-2 d-flex flex-column">
                <v-btn
                  block
                  color="white"
                  size="large"
                  rounded="lg"
                  @click="$router.push('/scan')"
                  elevation="3"
                  class="scan-button text-none"
                >
                  <v-icon start>mdi-camera</v-icon>
                  Scan Another Plant
                </v-btn>

                <v-btn
                  block
                  color="black"
                  variant="text"
                  @click="$router.push('/scan-history')"
                >
                  <v-icon start>mdi-history</v-icon>
                  View Scan History
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </div>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<style scoped>
.pest-scanner-app {
  background: #8ca189;
  min-height: 100dvh;
  overflow: auto;
}

.v-container {
  overflow-y: auto;
  max-height: calc(100vh - 64px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.result-card {
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
}

.ai-insights-card {
  background: rgba(250, 250, 250, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.result-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.scan-button {
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  background: #526e48;
}

.image-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
}

.result-item {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 600px) {
  .result-container {
    padding: 16px;
  }

  .text-h4 {
    font-size: 1.75rem !important;
  }

  .result-card {
    margin: 0 !important;
  }
}

.ai-insights-card :deep(br) {
  margin-bottom: 0.5em;
}
</style>
