<script setup>
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";
import { FolderIcon, DocumentIcon } from "@heroicons/vue/24/outline";

const router = useRouter();

const files = ref([]);

const path = defineProps(["file"]);

const error = ref(false);

const requestFinished = ref(false);

function open(file) {
  if (file.folder) {
    router.push("/files" + path.file + file.name + "-folder");
  }
}

function openImage(file) {
  window.open("/view/" + path.file + "/" + file.name);
}

onMounted(() => {
  axios
    .get("https://driveapi.onemo.dev/getFiles", {
      headers: {
        path: path.file,
        token: Cookies.get("token"),
      },
    })
    .then((response) => {
      response.data.files.sort();

      requestFinished.value = true;

      for (let i = 0; i < response.data.files.length; i++) {
        let folder = false;
        let image = false;
        let video = false;

        if (response.data.files[i].includes("-folder")) {
          folder = true;
        }

        if (
          response.data.files[i].includes(".png") ||
          response.data.files[i].includes(".jpg") ||
          response.data.files[i].includes(".jpeg") ||
          response.data.files[i].includes(".gif") ||
          response.data.files[i].includes(".webp")
        ) {
          image = true;
          const url =
            "https://driveapi.onemo.dev/download/" +
            path.file +
            response.data.files[i] +
            "?token=" +
            Cookies.get("token") +
            "&size=small";

          axios.get(url).then((response) => {
            files.value[i].base64 = response.data.base64;
          });
        }

        if (
          response.data.files[i].includes(".mp4") ||
          response.data.files[i].includes(".webm") ||
          response.data.files[i].includes(".mov") ||
          response.data.files[i].includes(".avi") ||
          response.data.files[i].includes(".mkv")
        ) {
          video = true;
        }

        files.value.push({
          name: response.data.files[i].replace("-folder", ""),
          folder: folder,
          image: image,
          video: video,
          base64: "",
          loaded: false,
        });
      }
    })
    .catch((e) => {
      requestFinished.value = true;
      error.value = true;
    });
});
</script>
<template>
  <div class="min-h-screen text-black dark:text-neutral-300">
    <InformationBannerComponent />
    <DriveStructureComponent :path="path" />
    <div class="flex justify-end mr-1 mb-2 mt-2">
      <DriveUploadComponent :path="path" />
    </div>
    <div v-if="!error">
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
      <div v-if="files.length == 0 && requestFinished">
        <div class="text-center mt-5">
          <p class="text-base font-semibold text-drive-500">No files</p>
          <h1
            class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl"
          >
            No files found
          </h1>
          <p class="mt-6 text-base leading-7 text-gray-600">
            We couldn’t find any files in this folder.
          </p>
        </div>
      </div>
      <div v-else>
        <div
          class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div v-for="file in files" :key="file">
            <div
              class="p-2 m-1 ml-1 sm:ml-1 rounded-xl border shadow-md dark:shadow-neutral-600 items-center sm:w-auto cursor-pointer hover:shadow-none transition-shadow ease duration-500"
            >
              <div class="text-center">
                <div>
                  <div v-if="file.image" class="items-center">
                    <div class="flex align-center items-center justify-center">
                      <img
                        :src="file.base64"
                        v-show="file.loaded"
                        class="object-cover rounded-lg"
                        @load="file.loaded = true"
                        @click="openImage(file)"
                      />
                    </div>
                    <div
                      v-if="!file.loaded"
                      class="flex align-center items-center justify-center"
                    >
                      <div
                        class="h-40 w-full object-cover rounded-lg loader"
                      ></div>
                    </div>
                  </div>
                  <div
                    v-if="file.video"
                    class="flex align-center items-center justify-center"
                  >
                    <video
                      class="object-cover rounded-lg"
                      controls
                      height="100%"
                      width="100%"
                      :src="
                        'https://driveapi.onemo.dev/download/' +
                        path.file +
                        '/' +
                        file.name +
                        '?token=' +
                        Cookies.get('token')
                      "
                    />
                  </div>
                  <div
                    v-if="file.folder"
                    class="flex align-center items-center justify-center"
                    @click="open(file)"
                  >
                    <FolderIcon class="h-12 w-12 text-gray-500 m-2" />
                  </div>
                  <div
                    v-else-if="!file.image && !file.video"
                    class="flex align-center items-center justify-center"
                  >
                    <DocumentIcon class="h-12 w-12 text-gray-500 m-2" />
                  </div>
                  <p class="mb-5 mt-4 truncate" @click="open(file)">
                    {{ file.name }}
                  </p>
                </div>
                <div class="flex justify-center">
                  <FilesDeleteComponent :file="file" :path="path" />
                  <div v-if="!file.folder">
                    <FilesShareComponent :file="file" :path="path" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <Error404Component />
    </div>
  </div>
</template>

<style scoped>
@media (prefers-color-scheme: dark) {
  .circleLoader {
    --uib-size: 40px;
    --uib-color: white;
    --uib-speed: 2s;
    --uib-bg-opacity: 0;
    height: var(--uib-size);
    width: var(--uib-size);
    transform-origin: center;
    animation: rotate var(--uib-speed) linear infinite;
    will-change: transform;
    overflow: visible;
  }

  .car {
    fill: none;
    stroke: var(--uib-color);
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: stretch calc(var(--uib-speed) * 0.75) ease-in-out infinite;
    will-change: stroke-dasharray, stroke-dashoffset;
    transition: stroke 0.5s ease;
  }

  .track {
    fill: none;
    stroke: var(--uib-color);
    opacity: var(--uib-bg-opacity);
    transition: stroke 0.5s ease;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes stretch {
    0% {
      stroke-dasharray: 0, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 75, 150;
      stroke-dashoffset: -25;
    }
    100% {
      stroke-dashoffset: -100;
    }
  }

  .loader {
    position: relative;
    overflow: hidden;
  }

  .loader::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(114, 114, 114, 0.8) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: loading 1.5s infinite;
  }
}

@media (prefers-color-scheme: light) {
  .circleLoader {
    --uib-size: 40px;
    --uib-color: black;
    --uib-speed: 2s;
    --uib-bg-opacity: 0;
    height: var(--uib-size);
    width: var(--uib-size);
    transform-origin: center;
    animation: rotate var(--uib-speed) linear infinite;
    will-change: transform;
    overflow: visible;
  }

  .car {
    fill: none;
    stroke: var(--uib-color);
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: stretch calc(var(--uib-speed) * 0.75) ease-in-out infinite;
    will-change: stroke-dasharray, stroke-dashoffset;
    transition: stroke 0.5s ease;
  }

  .track {
    fill: none;
    stroke: var(--uib-color);
    opacity: var(--uib-bg-opacity);
    transition: stroke 0.5s ease;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes stretch {
    0% {
      stroke-dasharray: 0, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 75, 150;
      stroke-dashoffset: -25;
    }
    100% {
      stroke-dashoffset: -100;
    }
  }

  .loader {
    position: relative;
    overflow: hidden;
  }

  .loader::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(165, 165, 165, 0.8) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: loading 1.5s infinite;
  }
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
