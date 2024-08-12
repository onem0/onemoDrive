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
    console.log("File")
  }
}

onMounted(() => {
  console.log(path)
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

        if (response.data.files[i].includes("-folder")) {
          folder = true;
        }

        files.value.push({
          name: response.data.files[i].replace("-folder", ""),
          folder: folder,
        });
      }
    });
});
</script>
<template>
  <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    <div v-for="file in files" :key="file" class="">
      <div class="">
        <div class="p-2 m-1 rounded-xl bg-drive-100 cursor-pointer" @click="open(file)">
          <div class="text-center">
            <div>
              <p class="mb-5">{{ file.name }}</p>
            </div>
            <FilesDeleteComponent />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
