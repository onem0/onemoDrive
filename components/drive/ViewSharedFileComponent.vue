<script setup>
import { FastAverageColor } from "fast-average-color";
import { watch } from "vue";

const path = defineProps(["file"]);

const loaded = ref(false);

const bgColor = ref("");

const type = ref({
  image: false,
  video: false,
  audio: false,
  text: false,
  other: false,
});

if (
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".png") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".jpg") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".jpeg") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".gif")
) {
  type.value.image = true;

  const fileName = path.file.split("/")[path.file.split("/").length - 2];

  useHead({
    meta: [
      {
        property: "og:image",
        content: `https://driveapi.onemo.dev/download/${path.file}?token=shared`,
      },
      {
        property: "og:image:width",
        content: "1200",
      },
      {
        property: "og:image:height",
        content: "630",
      },
      {
        property: "og:title",
        content: fileName,
      },
      {
        property: "og:description",
        content: "Shared image",
      },
      {
        property: "og:url",
        content: `https://driveapi.onemo.dev/sharedFile/${path.file}`,
      },
    ],
  });
} else if (
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".mp4") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".webm") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".ogg") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".mov") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".avi") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".wmv") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".flv") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".mkv")
) {
  type.value.video = true;
} else if (
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".mp3") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".wav") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".flac") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".ogg") ||
  path.file.split("/")[path.file.split("/").length - 2].endsWith(".m4a")
) {
  type.value.audio = true;
} else {
  type.value.other = true;
}

console.log(type.value);

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
</script>

<template>
  <div>
    <div
      class="flex justify-center items-center min-h-svh bg-black transition-all duration-long ease"
      :style="{ backgroundColor: bgColor }"
    >
      <div v-if="type.image">
        <img
          class="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] shadow-2xl transition-all duration-long ease rounded-lg"
          :class="{
            'opacity-0 blur-3xl': !loaded,
            'opacity-100 blur-none': loaded,
          }"
          :src="
            'https://driveapi.onemo.dev/download/' + path.file + '?token=shared'
          "
          @load="loaded = true"
        />
      </div>
      <div v-else-if="type.video">
        <video
          class="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] shadow-2xl transition-all duration-long ease rounded-lg"
          controls
          :src="
            'https://driveapi.onemo.dev/download/' + path.file + '?token=shared'
          "
        />
      </div>
      <div v-else-if="type.audio">
        <audio
          class="max-w-[calc(100vw-2rem)] shadow-2xl transition-all duration-long ease rounded-lg"
          controls
        >
          <source
            :src="
              'https://driveapi.onemo.dev/download/' +
              path.file +
              '?token=shared'
            "
            type="audio/mp3"
          />
          Your browser does not support the audio tag.
        </audio>
      </div>
      <div v-else-if="type.text">
        <iframe
          class="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] shadow-2xl transition-all duration-long ease rounded-lg"
          :src="
            'https://driveapi.onemo.dev/download/' + path.file + '?token=shared'
          "
        ></iframe>
      </div>
      <div v-else>
        <div
          class="flex justify-center items-center min-h-svh bg-black transition-all duration-long ease"
          :style="{ backgroundColor: bgColor }"
        >
          <div
            class="flex justify-center items-center max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] shadow-2xl transition-all duration-long ease rounded-lg"
          >
            <div class="text-center">
              <p class="text-4xl">
                <ExclamationCircleIcon class="h-12 w-12 text-red-600" />
              </p>
              <p class="text-2xl text-drive-500">
                This file type is not supported.
              </p>

              <p class="text-lg text-white">
                You can download the file and open it on your device.
              </p>

              <a
                :href="
                  'https://driveapi.onemo.dev/download/' +
                  path.file +
                  '?token=shared'
                "
                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-drive-500 hover:bg-drive-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-drive-500"
                >Download</a
              >

              <p class="text-sm mt-2 text-white">
                {{ path.file.split("/")[path.file.split("/").length - 2] }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.duration-long {
  transition-duration: 2000ms;
}
</style>
