<script setup>
useHead({
  title: "onemo Drive",
});
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <NuxtPage />
      <CookieComponent />
      <TailwindBreakpointIndicator />
    </NuxtLayout>
  </TooltipProvider>
</template>

<style>
</style>
