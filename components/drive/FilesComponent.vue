<script setup>
import Cookies from "js-cookie";
import axios from "axios";

const files = ref([]);

onMounted(() => {
  axios
    .get("https://drive.onemo.dev/getFiles", {
      headers: {
        path: "/",
        token: Cookies.get("token"),
      },
    })
    .then((response) => {
      files.value = response.data.files;
    });
});
</script>
<template>
  <div v-for="file in files" :key="file">
    <div class="flex">
      <div class="w-1/5 h-72">
        <p>{{ file }}</p>
      </div>
    </div>
  </div>
</template>
