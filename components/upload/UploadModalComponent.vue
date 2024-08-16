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
                      class="block w-full border mt-5 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-drive-500 focus:ring-drive-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-neutral-700 dark:file:text-neutral-400"
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
                  v-if="uploadInProgress"
                  class="mt-5 w-full bg-gray-100 rounded-lg h-5"
                >
                  <div
                    v-if="progress > 0"
                    class="bg-drive-600 h-full rounded-lg transition-all ease duration-100"
                    :style="{ width: `${progress}%` }"
                  ></div>

                  <div v-if="progress === 0" class="h-full rounded bg-gradient-to-r from-gray-100 to-gray-200 animation"></div>
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
const uploadInProgress = ref(false);

function closeModal() {
  if (!uploadInProgress.value) {
    changeModal(false);
  }
}

function uploadFile() {
  const formData = new FormData();
  formData.append(
    "file",
    document.querySelector('input[type="file"]').files[0]
  );

  axios
    .post("https://drive.onemo.dev/upload", formData, {
      headers: {
        token: Cookie.get("token"),
        path: window.location.pathname.replace("/files", "").replaceAll("%20", " ") + "/",
      },
      onUploadProgress: (progressEvent) => {
        uploadInProgress.value = true;

        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        progress.value = percentCompleted;
      },
    })
    .then((response) => {
      if (response.data.message === "file uploaded successfully") {
        changeModal(false);
        router.go();
      }
    })
    .catch((error) => {
      changeModal(false);
      console.log(error);
      alert("An error occurred while uploading the file.");
    });
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
    opacity: 1;
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