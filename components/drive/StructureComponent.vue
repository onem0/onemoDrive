<script setup>
import { HomeIcon } from "@heroicons/vue/20/solid";

const path = defineProps(["path"]);

const pages = ref([]);

const pathArray = path.path.file.split("/").filter((item) => item !== "");

for (let i = 0; i < pathArray.length; i++) {
  let current = false;

  if (i === pathArray.length - 1) {
    current = true;
  }

  pages.value.push({
    name: pathArray[i].replace("-folder", ""),
    href: "/files/" + pathArray.slice(0, i + 1).join("/"),
    current: current,
  });
}
</script>

<template>
  <nav class="flex m-5 mt-6 flex-wrap" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-4 flex-wrap">
      <li>
        <div>
          <RouterLink
            to="/files"
            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            aria-current="page"
          >
            <HomeIcon class="-mt-7 w-5 flex-shrink-0" aria-hidden="true" />
          </RouterLink>
        </div>
      </li>
      <li v-for="page in pages" :key="page.name" class="mw-smw">
        <div class="flex items-center">
          <svg
            class="h-5 w-5 flex-shrink-0 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
          <RouterLink
            :to="page.href"
            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 truncate"
            :aria-current="page.current ? 'page' : undefined"
          >
            {{ page.name }}
          </RouterLink>
        </div>
      </li>
    </ol>
  </nav>
</template>
