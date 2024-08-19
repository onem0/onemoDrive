<script setup>
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";
import { DocumentIcon } from "@heroicons/vue/24/outline";
import { DateTime } from "luxon";

const router = useRouter();

const id = ref("");

const error = ref(false);

const requestFinished = ref(false);

function open(fileName) {
  router.push("/sharedFile/" + id.value + "/" + fileName);
}

function deleteShared(file) {
  axios
    .delete("https://driveapi.onemo.dev/deleteShared/", {
      headers: {
        token: Cookies.get("token"),
        file: file.fullname,
      },
    })
    .then(() => {
      router.go();
    });
}

function copyShared(file) {
  const url = "https://driveapi.onemo.dev/shared/" + id.value + "/" + file.fullname

  navigator.clipboard.writeText(url);
}

const files = ref([]);

onMounted(() => {
  axios
    .get("https://driveapi.onemo.dev/getShared", {
      headers: {
        token: Cookies.get("token"),
      },
    })
    .then((response) => {
      requestFinished.value = true;

      for (let i = 0; i < response.data.files.length; i++) {
        const file = response.data.files[i];

        const sharedScince = Number(file.split("-")[0]);

        const relatinveTime = DateTime.fromMillis(sharedScince).toFormat(
          "MMMM dd, yyyy hh:mm a"
        );

        const name = file.split("-")[2];

        id.value = response.data.id;

        files.value.push({
          name: name,
          sharedScince: relatinveTime,
          fullname: file,
          fileUrl:
            "https://driveapi.onemo.dev/download/" +
            response.data.id +
            "/" +
            file +
            "?token=shared",
          image:
            file.endsWith(".png") ||
            file.endsWith(".jpg") ||
            file.endsWith(".jpeg") ||
            file.endsWith(".webp"),
          video:
            file.endsWith(".mp4") ||
            file.endsWith(".webm") ||
            file.endsWith(".ogg"),
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
            Sorry, we couldn’t find any files in this folder.
          </p>
        </div>
      </div>
      <div v-else>
        <div
          class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div v-for="file in files" :key="file">
            <div
              class="p-2 m-1 ml-2 sm:ml-1 rounded-xl border shadow-md dark:shadow-neutral-600 w-[calc(100vw-1rem)] items-center sm:w-auto cursor-pointer hover:shadow-none transition-shadow ease duration-500"
            >
              <div class="text-center">
                <div>
                  <div v-if="file.image" class="items-center">
                    <div class="flex align-center items-center justify-center">
                      <img
                        v-show="file.loaded"
                        class="object-cover rounded-lg"
                        @load="file.loaded = true"
                        @click="openImage(file)"
                        :src="file.fileUrl"
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
                      :src="file.fileUrl"
                    />
                  </div>
                  <div
                    v-else-if="!file.image && !file.video"
                    class="flex align-center items-center justify-center"
                  >
                    <DocumentIcon class="h-12 w-12 text-gray-500 m-2" />
                  </div>
                  <p class="mb-5 mt-4 truncate" @click="open(file.fullname)">
                    {{ file.name }}
                  </p>
                </div>
                <div class="flex justify-center">
                  <div @click="deleteShared(file)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-5"
                      @click="deleteFile"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div @click="copyShared(file)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-5 ml-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                      />
                    </svg>
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
