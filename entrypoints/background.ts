export default defineBackground(() => {});

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
