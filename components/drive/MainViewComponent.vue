<template>
    <div>
        <p>EEEE</p>
    </div>
</template>
<script>
import Cookies from "js-cookie";

onMounted(() => {
  if(!Cookies.get("token")) {
    window.location.href = "/login";
  }
});
</script>