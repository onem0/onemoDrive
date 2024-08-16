<template>
  <Disclosure as="nav" class="bg-white shadow text-black dark:bg-neutral-900 dark:text-neutral-300" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-drive-500"
          >
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div
          class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex flex-shrink-0 items-center">
            <img
              class="h-8 w-auto cursor-pointer"
              :src="imageBase64"
              alt="onemo Drive"
              @click="router.push('/')"
            />
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <!-- Current: "border-drive-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
             <RouterLink
              to="/"
              class="mt-5 border-b-2"
              :class="{
                'border-drive-500 text-gray-900 dark:text-neutral-300': page.drive,
                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': !page.drive,
              }"
              >Drive</RouterLink>
            <RouterLink
              to="/shared"
              class="mt-5 border-b-2"
              :class="{
                'border-drive-500 text-gray-900 dark:text-gray-600': page.shared,
                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': !page.shared,
              }"
              >Shared</RouterLink>
              <RouterLink
              to="/stats"
              class="mt-5 border-b-2"
              :class="{
                'border-drive-500 text-gray-900 dark:text-gray-600': page.stats,
                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': !page.stats,
              }"
              >Your stats</RouterLink>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <button
            type="button"
            class="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-drive-500 focus:ring-offset-2"
          ></button>

          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3">
            <div v-if="account">
              <MenuButton
                class="relative flex rounded-full bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-drive-500 focus:ring-offset-2"
              >
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <p>{{ username }}</p>
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-slot="{ active }">
                  <a
                    @click=""
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                    >Settings</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                    @click="logoutButton"
                    >Sign out</a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 pb-4 pt-2">
        <!-- Current: "bg-drive-50 border-drive-500 text-drive-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" -->
        <RouterLink
          to="/"
          class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >Drive</RouterLink
        >
        <RouterLink
          to="/shared"
          class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >Shared</RouterLink
        >
        <RouterLink
          to="/stats"
          class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >Your stats</RouterLink
        >
      </div>
    </DisclosurePanel>
  </Disclosure>

  <LogoutComponent />
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { checkToken } from "@/scripts/login/script.js";
import { changeModal } from "@/scripts/accountManagement/logoutButtonCancel.js";
import { useRouter } from "vue-router";
import { image } from "@/scripts/returnImage.js";
const route = useRoute();

let path = route.path;

const page = ref({
  drive: false,
  shared: false,
  stats: false,
});

if (path.startsWith("/files")) {
  page.value.drive = true;
  page.value.shared = false;
  page.value.stats = false;
} else if (path.startsWith("/shared")) {
  page.value.drive = false;
  page.value.shared = true;
  page.value.stats = false;
} else if (path.startsWith("/stats")) {
  page.value.drive = false;
  page.value.shared = false;
  page.value.stats = true;
}


const router = useRouter();

const account = ref(false);
const username = ref("");

const imageBase64 = ref(image());

function logoutButton() {
  changeModal(true);
}
onMounted(() => {
  checkToken().then((result) => {
    if (result.content) {
      account.value = true;
      username.value = result.username;
    }
  });
});
</script>
