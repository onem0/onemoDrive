<script setup>
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const files = ref([]);

const path = defineProps(["file"]);

function open(file) {
  if (file.folder) {
    router.push("/files" + path.file + "/" + file.name + "-folder");
  } else {
    console.log("File");
  }
}

onMounted(() => {
  console.log(path);
  axios
    .get("https://drive.onemo.dev/getFiles", {
      headers: {
        path: path.file,
        token: Cookies.get("token"),
      },
    })
    .then((response) => {
      for (let i = 0; i < response.data.files.length; i++) {
        let folder = false;
        let image = false;

        if (response.data.files[i].includes("-folder")) {
          folder = true;
        }

        if (
          response.data.files[i].includes(".png") ||
          response.data.files[i].includes(".jpg") ||
          response.data.files[i].includes(".jpeg") ||
          response.data.files[i].includes(".gif") ||
          response.data.files[i].includes(".webp")
        ) {
          image = true;
          const url =
            "https://drive.onemo.dev/download/" +
            path.file +
            "/" +
            response.data.files[i] +
            "?token=" +
            Cookies.get("token") +
            "&size=small";

          axios.get(url).then((response) => {
            files.value[i].base64 = response.data.base64;
          });
        }

        files.value.push({
          name: response.data.files[i].replace("-folder", ""),
          folder: folder,
          image: image,
          base64: "",
          loaded: false,
        });
      }
    });
});
</script>
<template>
  <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <div v-for="file in files" :key="file" class="">
      <div class="">
        <div
          class="p-2 m-1 rounded-xl border-gray-300 border shadow-md cursor-pointer"
        >
          <div class="text-center">
            <div>
              <div v-if="file.image" class="items-center">
                <img
                  :src="file.base64"
                  v-show="file.loaded"
                  class="object-cover rounded-lg"
                  @load="file.loaded = true"
                />
              </div>
              <p class="mb-5 mt-4 truncate" @click="open(file)">
                {{ file.name }}
              </p>
            </div>
            <FilesDeleteComponent />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
