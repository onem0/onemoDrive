<script setup>
const route = useRoute();
const file = route.params.file;

let fileString = "/";

for (let i = 0; i < file.length; i++) {
  fileString += file[i] + "/";
}
</script>

<template>
  <DriveViewSharedFileComponent :file="fileString" />
</template>
