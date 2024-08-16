import { ref } from 'vue';

let openModal = ref(false);

export function changeModal(state) {
    openModal.value = state;
}

export function checkModalState() {
    return openModal.value;
}
