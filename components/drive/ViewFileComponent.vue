<script setup>
import Cookies from "js-cookie";
import { FastAverageColor } from "fast-average-color";
import { watch } from "vue";

const loaded = ref(false);

const error = ref(false);

const bgColor = ref("");

watch(
  () => loaded.value,
  () => {
    if (loaded.value) {
      const fac = new FastAverageColor();
      const img = document.querySelector("img");
      img.crossOrigin = "Anonymous";
      fac
        .getColorAsync(img)
        .then((color) => {
          bgColor.value = color.hex;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
);

const path = defineProps(["file"]);
</script>

<template>
  <div
    class="flex justify-center items-center min-h-svh bg-black transition-all duration-long ease"
    :style="{ backgroundColor: bgColor }"
  >
    <img
      class="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] shadow-2xl rounded-lg"
      v-show="loaded"
      :class="{
        'opacity-0 blur-3xl': !loaded,
        'opacity-100 blur-none': loaded,
      }"
      :src="
        'https://driveapi.onemo.dev/download/' +
        path.file +
        '?token=' +
        Cookies.get('token')
      "
      @load="loaded = true"
    />

    <div v-show="!loaded" class="text-white">
      Loading...
    </div>
  </div>
</template>

<style scoped>
.duration-long {
  transition-duration: 2000ms;
}
</style>
