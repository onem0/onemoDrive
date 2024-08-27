<template>
  <TransitionRoot as="template" :show="checkModalState()">
    <Dialog class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 backdrop-blur bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200"
                >
                  <FolderIcon class="h-6 w-6 text-gray-600" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Upload file</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Here you can upload a file into the current folder.
                    </p>
                    <input
                      type="file"
                      name="file-input"
                      if="file"
                      :disabled="uploadInProgress"
                      class="block w-full border mt-5 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-drive-500 focus:ring-drive-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-black dark:border-neutral-700 dark:text-neutral-400 file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-neutral-700 dark:file:text-neutral-400"
                    />
                  </div>
                </div>
              </div>
              <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
              >
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-drive-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-drive-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-drive-600 sm:col-start-2"
                  :class="{
                    'cursor-not-allowed bg-gray-600 hover:bg-gray-700':
                      uploadInProgress,
                  }"
                  @click="uploadFile"
                  :disabled="uploadInProgress"
                >
                  Upload
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  @click="changeModal(false)"
                  :class="{
                    'cursor-not-allowed bg-gray-100': uploadInProgress,
                  }"
                  ref="cancelButtonRef"
                  :disabled="uploadInProgress"
                >
                  Cancel
                </button>
              </div>
              <div class="w-full">
                <div v-if="progress === 0 && uploadInProgress" class="mt-5">
                  <p class="text-gray-500">Prepairing upload...</p>
                </div>
                <div
                  v-else-if="progress === 100 && uploadInProgress"
                  class="mt-5"
                >
                  <p class="text-gray-500">Processing Upload</p>
                </div>
                <div v-else-if="progress > 0 && progress < 100" class="mt-5">
                  <p class="text-gray-500">
                    Estimated time left: {{ estimatedTimeSmooth }}
                  </p>
                </div>
                <div v-else-if="!uploadInProgress" class="mt-5">
                  <p class="text-gray-500">Upload not started...</p>
                </div>
                <div
                  class="mt-5 w-full bg-gray-100 overflow-hidden rounded-lg h-5"
                >
                  <div
                    v-if="progress > 0 && progress < 100"
                    class="bg-drive-600 h-full transition-all ease duration-500"
                    :style="{ width: `${progress}%` }"
                  ></div>

                  <div
                    v-if="
                      (progress === 0 || progress === 100) && uploadInProgress
                    "
                    class="h-full bg-gray-400 animation"
                  ></div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { FolderIcon } from "@heroicons/vue/24/outline";
import { checkModalState, changeModal } from "@/scripts/upload/uploadModal.js";
import Cookie from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const progress = ref(0);

const estimatedTimeSmooth = ref(0)

const uploadInProgress = ref(false);

const estimatedTimeLeft = ref(0);

function closeModal() {
  if (!uploadInProgress.value) {
    changeModal(false);
  }
}

watch(() => progress.value, (value) => {
  estimatedTimeSmooth.value = estimatedTimeLeft.value;
})

onMounted(() => {
  window.addEventListener("beforeunload", (event) => {
    if (uploadInProgress.value) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
});

function uploadFile() {
  if (!uploadInProgress.value) {
    const startTime = Date.now();

    const file = document.querySelector('input[type="file"]').files[0];
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);

    const uploadChunk = async (chunkIndex) => {
      const start = chunkIndex * chunkSize;
      const end = Math.min(file.size, start + chunkSize);

      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append("file", chunk);

      try {
        const response = await axios.post(
          "https://driveapi.onemo.dev/upload",
          formData,
          {
            headers: {
              token: Cookie.get("token"),
              path:
                window.location.pathname
                  .replace("/files", "")
                  .replaceAll("%20", " ") + "/",
              "chunk-index": chunkIndex,
              "total-chunks": totalChunks,
              "original-file-name": file.name,
            },
            onUploadProgress: (progressEvent) => {
              uploadInProgress.value = true;

              const chunkProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );

              const percentCompleted = Math.round(
                ((chunkIndex + chunkProgress / 100) * 100) / totalChunks
              );

              const elapsedTime = Date.now() - startTime;

              const estimatedTime = elapsedTime / (percentCompleted / 100);

              const remainingTime = estimatedTime - elapsedTime;

              const remainingSeconds = (remainingTime / 1000).toFixed(0);

              const minutes = Math.floor(remainingSeconds / 60);

              function getSeconds() {
                if (remainingSeconds % 60 < 10) {
                  return "0" + (remainingSeconds % 60);
                }

                return remainingSeconds % 60;
              }

              const seconds = getSeconds();

              estimatedTimeLeft.value = minutes + ":" + seconds;

              progress.value = percentCompleted;
            },
          }
        );

        if (
          chunkIndex === totalChunks - 1 &&
          response.data.message === "file uploaded and merged successfully"
        ) {
          changeModal(false);
          uploadInProgress.value = false;
          router.go();
        } else if (chunkIndex < totalChunks - 1) {
          uploadChunk(chunkIndex + 1);
        }
      } catch (error) {
        changeModal(false);
        console.log(error);
        uploadInProgress.value = false;
        alert("An error occurred while uploading the file.");
      }
    };

    uploadChunk(0);
  }
}
</script>

<style scoped>
@keyframes animation {
  0% {
    width: 0%;
    opacity: 0;
  }
  5% {
    width: 0%;
    opacity: 0.5;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}

.animation {
  animation: animation 2s infinite;
}
</style>
