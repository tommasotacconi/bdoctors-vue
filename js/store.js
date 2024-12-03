import { reactive } from 'vue'


export const store = reactive({
    // Variable for change content inside dashboard
    informationPage: true,
    messagePage: false,
    reviewPage: false,

    // Variable for toggle sidebar inside dashboard
    sidebar: true,
})