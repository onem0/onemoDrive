<template>
  <footer class="bg-gray-900 mt-3 rounded-t-lg">
    <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
      <nav
        class="-mb-4 columns-2 flex justify-center space-x-12"
        aria-label="Footer"
      >
        <div v-for="item in navigation.main" :key="item.name" class="pb-6">
          <a
            :href="item.href"
            class="text-sm leading-6 text-gray-400 hover:text-gray-300"
            >{{ item.name }}</a
          >
        </div>
      </nav>
      <p class="mt-10 text-center text-xs leading-5 text-gray-500">
        &copy; 2024 onemo.dev, Inc. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup>
const navigation = {
  main: [
    { name: "Imprint", href: "https://www.onemo.dev/imprint" },
    { name: "Privacy", href: "https://www.onemo.dev/privacy" },
    { name: "GitHub", href: "https://github.com/onem0/onemoDrive" },
  ],
};
</script>
