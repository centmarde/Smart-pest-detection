<script setup lang="ts">
import { ref } from "vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { usePestScan } from "@/composables/usePestScan";
import { useRouter } from "vue-router";

const selectedImage = ref<string | null>(null);
const defaultImage = "/src/assets/default/pest1.jpg";
const { uploadPestScan, uploadError } = usePestScan();
const isTakingPicture = ref<boolean>(false);
const router = useRouter();

const takePicture = async (): Promise<void> => {
  try {
    const image = await Camera.getPhoto({
      quality: 50,
      resultType: CameraResultType.Uri,
      allowEditing: false,
      saveToGallery: true,
      source: CameraSource.Prompt,
      promptLabelCancel: "Go Back",
      promptLabelPhoto: "Choose from Gallery",
      promptLabelPicture: "Take a Picture",
    });

    selectedImage.value = image.webPath || null;

    if (image.webPath) {
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      isTakingPicture.value = true;

      const imageUrl = await uploadPestScan(file);
      if (uploadError.value) {
        console.error("Upload error:", uploadError.value);
      } else {
        console.log("Image uploaded to:", imageUrl);
        router.push("/result");
      }
    }
  } catch (error) {
    console.error("Camera error:", error);
  } finally {
    isTakingPicture.value = false;
  }
};

const clearImage = (): void => {
  selectedImage.value = null;
};
</script>



<template>
  <v-container class="pa-4">
    <v-card
      class="mx-auto scan-card"
      :class="{
        'elevation-8': !isTakingPicture,
        'elevation-2': isTakingPicture,
      }"
      max-width="500"
      rounded="lg"
    >
      <v-overlay
        v-model="isTakingPicture"
        class="align-center justify-center"
        contained
        scrim="#ffffff"
      >
        <v-card-text class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div class="text-h6 mt-1 text-primary">Processing your image...</div>
        </v-card-text>
      </v-overlay>

      <v-img
        :src="selectedImage || defaultImage"
        :aspect-ratio="4 / 3"
        cover
        class="scan-image"
      >
        <div class="image-overlay" v-if="!selectedImage">
          <div class="text-center text-white">
            <v-icon size="72" color="white" class="mb-3"
              >mdi-leaf-circle</v-icon
            >
            <div class="text-h6 mb-2">Ready to Scan</div>
            <div class="text-body-1">
              Position the affected area in the frame
            </div>
          </div>
        </div>
      </v-img>

      <v-card-actions class="pa-2 d-flex flex-column">
        <v-btn
          block
          color="white"
          size="large"
          rounded="lg"
          :loading="isTakingPicture"
          :disabled="isTakingPicture"
          @click="takePicture"
          class="scan-button text-none"
          elevation="3"
        >
          <v-icon start size="24" class="mr-2">
            {{ selectedImage ? "mdi-camera-retake" : "mdi-camera" }}
          </v-icon>
          {{ selectedImage ? "Scan Again" : "Scan Plant" }}
        </v-btn>

        <v-btn
          v-if="selectedImage"
          block
          color="error"
          size="large"
          rounded="lg"
          variant="outlined"
          @click="clearImage"
          class="clear-button"
          elevation="3"
        >
          <v-icon start>mdi-refresh</v-icon>
          Clear Image
        </v-btn>

        <v-btn
          color="black"
          variant="text"
          block
          @click="$router.push('/scan-history')"
        >
          <v-icon start>mdi-history</v-icon>
          View Scan History
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      class="mt-4 mx-auto tips-card"
      max-width="500"
      variant="outlined"
      rounded="lg"
    >
      <v-list lines="two">
        <v-list-subheader class="text-primary font-weight-medium">
          Tips for Best Results
        </v-list-subheader>

        <v-list-item
          prepend-icon="mdi-light-flood-up"
          title="Good Lighting"
          subtitle="Ensure the plant is well-lit and avoid shadows"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-image-filter-center-focus"
          title="Clear Focus"
          subtitle="Keep the camera steady and close to the affected area"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-leaf"
          title="Affected Areas"
          subtitle="Include both healthy and damaged parts of the plant"
        ></v-list-item>
      </v-list>
    </v-card>
  </v-container>
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

.scan-card {
  position: relative;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
  padding: 10px;
}

.scan-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  height: 100%;
}

.scan-button {
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  background: #526e48;
}

.scan-button:active {
  transform: scale(0.98);
}

.tips-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
}

@media (max-width: 600px) {
  .scan-container {
    padding: 16px !important;
  }

  .text-h4 {
    font-size: 1.75rem !important;
  }

  .scan-card {
    margin: 0 !important;
  }
}
</style>
