<script setup>
import { ref } from "vue";
import { login, checkToken } from "@/scripts/login/script.js";
import {
  checkMessageState,
  changeMessage,
} from "@/scripts/accountManagement/sendNotification.js";
import { useRouter } from "vue-router";
import { image } from "@/scripts/returnImage.js";

const imageBase64 = ref(image());

const router = useRouter();

const email = ref("");
const password = ref("");

const loading = ref(false);

const wrong = ref(false);

function setInformation(event) {
  if (event.target.id === "email") {
    email.value = event.target.value;
  } else {
    password.value = event.target.value;
  }

  changeMessage(false, "", "");
}

function loginFunction(email, password) {
  loading.value = true;

  login(email, password).then((result) => {
    if(result) {
      router.push("/");
    }

    loading.value = false;
  });
}

watch(checkMessageState, (newVal) => {
  wrong.value = newVal.messageState;

  console.log(newVal.messageState);
});

onMounted(() => {
  checkToken().then((result) => {
    try {
      if (result.content) {
        router.push("/")
      }
    } catch (error) {}
  });
});
</script>

<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        :src="imageBase64"
        alt="Your Company"
      />
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Sign in to your onemo Drive account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div>
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Email address</label
        >
        <div class="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            @input="setInformation"
            class="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-drive-500 sm:text-sm sm:leading-6"
            :class="{
              'ring-red-500': wrong,
            }"
          />
        </div>
      </div>

      <div>
        <div class="flex mt-2 items-center justify-between">
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >
          <!-- <div class="text-sm">
            <a
              href=""
              class="font-semibold text-drive-500 hover:text-drive-800"
              >Forgot password?</a
            >
          </div> -->
        </div>
        <div class="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            @input="setInformation"
            class="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-drive-500 sm:text-sm sm:leading-6"
            :class="{
              'ring-red-500': wrong,
            }"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          @click="loginFunction(email, password)"
          class="flex w-full mt-5 justify-center rounded-md bg-drive-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-drive-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-drive-500 h-10 items-center"
        >
          <div v-if="!loading">Sign in</div>
          <div v-else>
            <div class="container"></div>
          </div>
        </button>
      </div>

      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        {{ " " }}
        <a
          href="https://www.onemo.dev/register"
          class="font-semibold leading-6 text-drive-500 hover:text-drive-800"
          >Create Account</a
        >
      </p>
    </div>
  </div>
</template>

<style>
.container {
  --uib-size: 80px;
  --uib-color: black;
  --uib-speed: 1.4s;
  --uib-stroke: 5px;
  --uib-bg-opacity: 0.1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--uib-stroke);
  width: var(--uib-size);
  border-radius: calc(var(--uib-stroke) / 2);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--uib-color);
  opacity: var(--uib-bg-opacity);
  transition: background-color 0.3s ease;
}

.container::after {
  content: "";
  height: 100%;
  width: 100%;
  border-radius: calc(var(--uib-stroke) / 2);
  animation: zoom var(--uib-speed) ease-in-out infinite;
  transform: translateX(-100%);
  background-color: var(--uib-color);
  transition: background-color 0.3s ease;
}

@keyframes zoom {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
