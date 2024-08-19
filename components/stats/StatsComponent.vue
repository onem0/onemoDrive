<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { ref } from "vue";
import { checkToken } from "@/scripts/login/script.js";

const storage = ref(0);
const driveStorage = ref(0);
const percentageUsed = ref(0);

const username = ref("");

const allStats = ref([]);

const loaded = ref(false);

onMounted(() => {
  axios
    .get("https://driveapi.onemo.dev/getFiles", {
      headers: {
        token: Cookies.get("token"),
        path: "/",
      },
    })
    .then((response) => {
      driveStorage.value = response.data.driveStorage / 1000;

      storage.value = response.data.storage / 1000 / 1000 / 1000;
      storage.value = storage.value.toFixed(2);

      percentageUsed.value = (storage.value / driveStorage.value) * 100;
      percentageUsed.value = percentageUsed.value.toFixed(2);

      loaded.value = true;
    })
    .catch((error) => {
      console.log(error);
    });

  checkToken().then((result) => {
    username.value = result.username;
  });

  axios.get("https://driveapi.onemo.dev/getStats").then((response) => {
    allStats.value = response.data;
  });
});
</script>

<template>
  <div class="min-h-screen">
    <div v-if="loaded">
      <div class="flex mt-5 flex-col items-center justify-center">
        <h1 class="text-3xl font-bold text-drive-700 dark:text-drive-200">
          Welcome back, {{ username }}
        </h1>

        <div class="sm:w-[calc(100vw-5rem)] w-[calc(100vw-2rem)] lg:w-[65vw]">
          <div class="grid grid-cols-2">
            <p>{{ storage }}GB</p>
            <p class="text-end">{{ driveStorage }}GB</p>
          </div>
          <div class="bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              class="bg-drive-700 flex items-center h-full"
              :style="{ width: percentageUsed + '%' }"
            >
              <p class="text-xl ml-3 text-white drop-shadow-lg">
                {{ percentageUsed }}%
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <p class="text-drive-700 dark:text-drive-200">
            You have used {{ storage }}GB of your {{ driveStorage }}GB storage
          </p>
        </div>
        <div class="mt-8">
          <h2>All requests: {{ allStats.requests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</h2>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        v-if="!requestFinished"
        class="flex justify-center items-center h-screen"
      >
        <svg class="circleLoader" viewBox="0 0 40 40" height="40" width="40">
          <circle
            class="track"
            cx="20"
            cy="20"
            r="17.5"
            pathlength="100"
            stroke-width="5px"
            fill="none"
          />
          <circle
            class="car"
            cx="20"
            cy="20"
            r="17.5"
            pathlength="100"
            stroke-width="5px"
            fill="none"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
