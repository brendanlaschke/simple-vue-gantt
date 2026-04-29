import { createApp } from "vue";
import App from "./App.vue";
// @ts-expect-error - No types available for style.css
import "./style.css";

createApp(App).mount("#app");
