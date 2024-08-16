import { ref } from "vue";

let openModal = ref(false);

export function changeFolderModal(state) {
  openModal.value = state;
}

export function checkModalState() {
  return openModal.value;
}
