<template>
  <v-bottom-navigation
    v-model="activeTab"
    color="#526E48"
    grow
    class="custom-nav"
  >
    <v-btn class="nav-button" :class="{ active: activeTab === 0 }" to="/home">
      <template v-slot:default>
        <v-icon size="25" :class="{ 'button-bounce': activeTab === 0 }">mdi-home</v-icon>
        <span class="button-text">Home</span>
      </template>
    </v-btn>

    <div class="scan-button-container">
      <v-btn 
        class="scan-button"
        elevation="2"
        to="/scan"
      >
        <v-icon size="22" :class="{ 'scan-pulse': isScanActive }">
          mdi-qrcode-scan
        </v-icon>
      </v-btn>
    </div>

    <v-btn class="nav-button" :class="{ active: activeTab === 2 }" to="/profiles">
      <template v-slot:default>
        <v-icon size="25" :class="{ 'button-bounce': activeTab === 2 }">mdi-account</v-icon>
        <span class="button-text">Profile</span>
      </template>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref(0);
const isScanActive = ref(false);

</script>

<style scoped>
.custom-nav {
  position: fixed !important;
  bottom: 4px !important;
  left: 4px !important;
  right: 4px !important;
  border-radius: 16px !important;
  background-color: #ffffff !important;
  box-shadow: 0 1px 6px rgba(82, 110, 72, 0.1) !important;
  height: 58px !important;  /* Reduced height */
  padding: 0 4px !important;  /* Reduced padding */
  width: calc(100% - 8px) !important;  /* Adjusted width */
  z-index: 100;
  margin-top: 4rem;
}

.nav-button {
  height: 100% !important;
  border-radius: 12px !important;
  transition: all 0.2s ease;
  color: #526E48 !important;
  min-width: 40px !important; 
  padding: 0 4px !important;  
}

.nav-button.active {
  background-color: rgba(82, 110, 72, 0.08) !important;  /* Subtle active state */
}

.button-text {
  margin-top: 1px; 
  font-size: 13px;  
  font-weight: 500;
  letter-spacing: 0.2px;
  transition: color 0.2s ease;
}

.scan-button-container {
  position: relative;
  width: 40px; 
}

.scan-button {
  position: absolute !important;
  left: 25px !important;
  transform: translateX(-50%) translateY(-50%) !important;
  top: 29px !important;
  background-color: #526E48 !important;
  color: white !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  z-index: 101;
  border-radius: 20%;
  padding: 8px !important;
}

.scan-button:hover {
  transform: translateX(-50%) translateY(-50%) scale(1.08) !important;
  box-shadow: 0 3px 8px rgba(82, 110, 72, 0.2) !important;
}

.scan-pulse {
  animation: micro-pulse 1.5s infinite;
}

.button-bounce {
  animation: micro-bounce 0.3s ease;
}

@keyframes micro-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes micro-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@media (max-width: 340px) {
  .button-text {
    display: none; 
  }
  
  .nav-button {
    min-width: 32px !important;
  }
  
  .scan-button {
    width: 36px !important;
    height: 36px !important;
  }
}

@media (hover: none) {
  .scan-button:hover {
    transform: translateX(-50%) translateY(-50%) scale(1) !important;
  }
}
</style>