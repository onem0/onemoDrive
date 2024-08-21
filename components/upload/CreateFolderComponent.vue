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
                    >Create Folder</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Here you can create a folder in the current folder.
                    </p>
                    <input
                      type="text"
                      name="file-input"
                      v-model="folderName"
                      class="block w-full mt-2 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-drive-500 focus:border-drive-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-drive-500 dark:focus:border-drive-500"
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
                  @click="uploadFile"
                >
                  Create folder
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  @click="changeFolderModal(false)"
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { FolderIcon } from "@heroicons/vue/24/outline";
import {
  checkModalState,
  changeFolderModal,
} from "@/scripts/upload/createFolder.js";
import Cookie from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const path = window.location.pathname.replace("/files", "");

const folderName = ref("");

function closeModal() {
  changeFolderModal(false);
}

function uploadFile() {
  axios
    .post(
      "https://driveapi.onemo.dev/createFolder/" + path + "/" + folderName.value.replaceAll(" ", "%20"),
      {},
      {
        headers: {
          token: Cookie.get("token"),
        },
      }
    )
    .then((response) => {
      if (response.data.message === "folder created successfully") {
        changeFolderModal(false);
        router.go();
      }
    })
    .catch((error) => {
      changeFolderModal(false);
      console.log(error);
      alert("An error occurred while uploading the file.");
    });
}
</script>
