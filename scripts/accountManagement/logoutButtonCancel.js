let openModal = false

export function changeModal(state) {
    openModal = state
}

export function checkModalState() {
    return openModal
}