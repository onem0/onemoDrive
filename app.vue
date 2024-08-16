<script setup>
useHead({
  title: "onemo Drive",
});
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <NuxtPage />
      <TailwindBreakpointIndicator />
    </NuxtLayout>
  </TooltipProvider>
</template>
