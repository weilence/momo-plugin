export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "addToWordLibrary",
      title: "Add to Word Library",
      contexts: ["selection"],
    });
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "addToWordLibrary" && info.selectionText) {
      let words = (await storage.getItem<string[]>("local:words")) || [];
      if (words.includes(info.selectionText)) {
        if (tab?.id) {
          browser.tabs.sendMessage(tab.id, { action: "word-exist" });
        }
      } else {
        words.unshift(info.selectionText);
        await storage.setItem("local:words", words);
        if (tab?.id) {
          browser.tabs.sendMessage(tab.id, { action: "word-add" });
        }
      }
    }
  });
});
