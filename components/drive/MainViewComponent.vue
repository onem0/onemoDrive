<template></template>
<script setup>
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  if (!Cookies.get("token")) {
    router.push("/login");
  }
});
</script>
