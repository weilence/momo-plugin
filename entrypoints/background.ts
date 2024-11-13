import { wordLibraryStore } from "./store";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
});

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "addToWordLibrary",
    title: "Add to Word Library",
    contexts: ["selection"],
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "addToWordLibrary" && info.selectionText) {
      wordLibraryStore.getState().addWord(info.selectionText);
    }
  });
});
