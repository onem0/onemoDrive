<script setup>
const cookiesAccepted = ref(false);

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", true);
  cookiesAccepted.value = true;
}

onMounted(() => {
  if (localStorage.getItem("cookiesAccepted") === "true") {
    cookiesAccepted.value = true;
  }
});
</script>

<template>
  <div
    class="fixed bottom-0 right-0 md:bottom-5 md:right-5 p-5 md:max-w-[35vw] bg-[#ffffff93] backdrop-blur border border-gray-200 rounded-lg"
    v-if="!cookiesAccepted"
  >
    <div>
      <h1>Cookie Notice</h1>
      <p>
        We use cookies to enhance your browsing experience, analyze site
        traffic, and personalize content. By continuing to use our site, you
        agree to our use of cookies. You can manage your preferences or find out
        more in our <a href="https://www.onemo.dev/privacy" class="underline">privacy policy</a>.
      </p>
      <div class="flex justify-end mt-5">
        <button
          @click="acceptCookies"
          class="bg-drive-500 text-white px-3 py-1 rounded-lg"
        >
          Accept
        </button>
      </div>
    </div>
  </div>
</template>
