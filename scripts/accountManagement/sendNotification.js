import { ref } from 'vue';

let sendMessage = ref(false);
let sendTitle = ref("")
let sendContent = ref("")

export function changeMessage(state, title, content) {
    sendMessage.value = state;
    sendTitle.value = title
    sendContent.value = content
}

export function checkMessageState() {
    return {
        messageState: sendMessage.value,
        messageTitle: sendTitle.value,
        messageContent: sendContent.value
    };
}
