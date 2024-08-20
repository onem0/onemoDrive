<script setup>
const route = useRoute();
const file = route.params.file;

let fileString = "/";

for (let i = 0; i < file.length; i++) {
  fileString += file[i] + "/";
}
</script>

<template>
  <div class="dark:bg-black text-neutral-300">
    <HeaderComponent />
    <DriveMainViewComponent />
    <DriveFilesComponent :file="fileString" />
    <FooterComponent />
  </div>
</template>
