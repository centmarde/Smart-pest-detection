<template>
  <LayoutWrapper>
    <template #content>
      <v-container class="profile-page pa-0" fluid>
        <!-- Loading State -->
        <v-overlay v-if="loading" contained>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-overlay>

        <!-- Error State -->
        <v-alert
          v-if="error"
          type="error"
          title="Error"
          :text="error.message"
          class="ma-4"
        ></v-alert>

        <!-- Main Content -->
        <div v-else>
          <v-sheet class="profile-header" rounded="lg">
            <div class="header-background"></div>
            <v-container class="py-6">
              <v-row align="center" justify="space-between" class="profile-info">
                <v-col cols="12" sm="8" class="d-flex align-center">
                  <v-avatar size="120" class="border-avatar elevation-4 mr-4 profile-avatar">
                    <v-img :src="profileImage" cover>
                      <template v-slot:placeholder>
                        <v-row align="center" justify="center">
                          <v-progress-circular indeterminate></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-avatar>
                  <div>
                    <div class="text-h4 font-weight-bold text-white mb-1">{{ username }}</div>
                    <div class="text-subtitle-1 text-white-darken-2">{{ email }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="4" class="d-flex justify-end">
                  <v-btn
                    prepend-icon="mdi-account-edit"
                    variant="elevated"
                    class="bg-white px-6"
                    @click="dialog = true"
                    elevation="2"
                  >
                    Edit Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>

          <!-- Stats Section -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-card class="rounded-lg elevation-3" theme="white">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-h4 font-weight-bold">156</div>
                        <div class="text-subtitle-2">Total Scans</div>
                      </div>
                      <v-icon size="36" color="success">mdi-leaf</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Recent Scans -->
            <v-card class="mt-4 rounded-lg elevation-3">
              <v-card-title class="d-flex align-center pb-2">
                <v-icon start color="success" class="mr-2">mdi-magnify</v-icon>
                Recent Pest Scans
              </v-card-title>

              <v-divider></v-divider>

              <v-list>
                <v-list-item
                  v-for="scan in recentScans"
                  :key="scan.id"
                  :subtitle="formatDate(scan.date)"
                  class="py-2"
                >
                  <template v-slot:prepend>
                    <v-icon color="success" class="mr-2">mdi-bug</v-icon>
                  </template>
                  <v-list-item-title>
                    {{ scan.pestType }}
                    <v-chip
                      variant="tonal"
                      :color="getSeverityColor(scan.Severity)"
                      size="small"
                      class="ml-2"
                    >
                      {{ scan.Severity }}
                    </v-chip>
                  </v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  variant="text"
                  color="success"
                  block
                  prepend-icon="mdi-history"
                >
                  View All Scans
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
        </div>

        <!-- Edit Profile Dialog -->
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-card-title class="text-h6">Edit Profile</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="saveProfile">
                <v-text-field
                  v-model="username"
                  label="Username"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  class="mb-4"
                ></v-text-field>
                <v-file-input
                  accept="image/*"
                  label="Profile Picture"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  class="mb-4"
                  @change="uploadProfileImage"
                ></v-file-input>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn
                color="success"
                variant="text"
                @click="saveProfile"
                :loading="saving"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserData, supabase } from "@/stores/authUser";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";

// State
const dialog = ref(false);
const saving = ref(false);
const { user, loading, error, refresh } = useUserData();

// Profile Data
const username = ref("");
const email = ref("");
const profileImage = ref("https://randomuser.me/api/portraits/lego/1.jpg");

// Mock Data for Recent Scans
const recentScans = ref([
  {
    id: 1,
    pestType: "Aphids",
    date: "2025-02-11",
    Severity: "High",
  },
  {
    id: 2,
    pestType: "Spider Mites",
    date: "2025-02-10",
    Severity: "Low",
  },
  {
    id: 3,
    pestType: "Whiteflies",
    date: "2025-02-09",
    Severity: "Medium",
  },
]);

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "grey";
  }
};

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const uploadProfileImage = async (file: File) => {
  if (!file || !user.value?.id) return;

  // Ensure file.name is a string
  if (typeof file.name !== 'string') {
    console.error('Invalid file name:', file.name);
    return;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = await supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    if (data) {
      profileImage.value = data.publicUrl;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

const saveProfile = async () => {
  if (!user.value?.id) return;

  saving.value = true;
  try {
    const { error } = await supabase
      .from("users")
      .update({
        username: username.value,
        profile_image: profileImage.value,
      })
      .eq("user_id", user.value.id);

    if (error) throw error;

    dialog.value = false;
    username.value = username.value;
    await refresh();
  } catch (error) {
    console.error("Error saving profile:", error);
  } finally {
    saving.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await fetchUserInfo();
});

const fetchUserInfo = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error("User not authenticated");

    email.value = user.email || "";
    await fetchUserProfile(user.id);
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
</script>

<style scoped>
.profile-page {
  background-color: #8ca189;
  overflow: auto;
  overflow-y: auto;
  overflow-y: auto;
  max-height: calc(100vh - 64px);
}

.profile-header {
  background: #5e7962;
  margin: 15px;
  margin-bottom: -5px;
}

.profile-header::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 70%
  );
}

.profile-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  position: relative;
  transition: transform 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.online-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #4caf50;
  border: 3px solid white;
  border-radius: 50%;
}

.profile-details {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.edit-btn {
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  transition: all 0.3s ease;
  padding: 16px 32px !important;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-2px);
}

@media (max-width: 960px) {
  .profile-content {
    flex-direction: column;
    text-align: center;
  }

  .profile-avatar {
    margin: 0 auto 24px;
  }

  .edit-btn {
    width: 100%;
    margin-top: 24px;
  }

  .d-flex.gap-2 {
    justify-content: center;
  }
}

:deep(.v-card) {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
