<template>
    <div>
        
    </div>
</template>
<script setup>
import Cookies from "js-cookie";

onMounted(() => {
  if(!Cookies.get("token")) {
    window.location.href = "/login";
  }
});
</script>