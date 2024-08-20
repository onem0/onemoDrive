<script setup>
import { ref } from "vue";
import { ShareIcon, CheckIcon } from "@heroicons/vue/24/outline";
import axios from "axios";
import Cookie from "js-cookie";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue"; // Kopfzeile angepasst

const props = defineProps(["file", "path"]);

const file = ref(props.file);
const path = ref(props.path.file);

const link = ref("");

const clickedShare = ref(false);

const show = ref(false);

function copyLink() {
  console.log(link.value);
  navigator.clipboard.writeText(link.value);
}

function startShare() {
  if(!clickedShare.value) {
    clickedShare.value = true;
    axios
    .post(
      "https://driveapi.onemo.dev/startShare",
      {},
      {
        headers: {
          token: Cookie.get("token"),
          file: path.value + "/" + file.value.name,
        },
      }
    )
    .then((response) => {
      show.value = true;
      link.value = response.data.fileURL.replaceAll(" ", "%20");
    })
    .catch((error) => {
      console.log(error);
      alert("An error occurred while starting the share.");
    });
  }
}
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="show">
      <Dialog class="relative z-10" @close="show = false">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0 backdrop-blur-0"
          enter-to="opacity-100 backdrop-blur"
          leave="ease-in duration-200 backdrop-blur"
          leave-from="opacity-100 backdrop-blur-0"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 backdrop-blur transition-opacity bg-opacity-75"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
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
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-200"
                  >
                    <CheckIcon class="h-6 w-6 text-green-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold leading-6 text-gray-900"
                      >File shared</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        {{ file.name }} has been shared. You can see your shared files by clicking on the Shared Button in the header.
                      </p>
                    </div>
                    <div class="mt-8">
                      <button
                        @click="copyLink"
                        class="justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      >
                        Copy link
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-1 sm:gap-3"
                >
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="show = false"
                    ref="cancelButtonRef"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <ShareIcon class="h-6 ml-2 w-6" @click="startShare" />
  </div>
</template>
