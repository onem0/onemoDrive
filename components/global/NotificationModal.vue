<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="show"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <ExclamationCircleIcon
                  class="h-6 w-6 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ title }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { checkMessageState, changeMessage } from "@/scripts/accountManagement/sendNotification.js";

watch(checkMessageState, (newVal) => {
  show.value = newVal.messageState;
  title.value = newVal.messageTitle
  description.value = newVal.messageContent
});

function closeMessage() {
    changeMessage(false, "", "")
}

const show = ref(false);
const title = ref("")
const description = ref("")
</script>
