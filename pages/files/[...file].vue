<script setup>
const route = useRoute();
const file = route.params.file;

let fileString = "/"

for (let i = 0; i < file.length; i++) {
  fileString += file[i] + "/"
}

console.log(fileString)
</script>

<template>
  <HeaderComponent />
  <DriveMainViewComponent />
  <DriveFilesComponent
    :file="fileString"
  />
</template>
