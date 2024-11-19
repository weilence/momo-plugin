import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "墨墨背单词同步助手",
    permissions: ["contextMenus", "storage"],
    host_permissions: ["https://*.maimemo.com/open/api/*"],
  },
});
