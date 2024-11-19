export default defineBackground(() => {
  browser.contextMenus.create({
    id: "addToWordLibrary",
    title: "Add to Word Library",
    contexts: ["selection"],
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "addToWordLibrary" && info.selectionText) {
      let words = (await storage.getItem<string[]>("local:words")) || [];
      if (words.includes(info.selectionText)) {
        return;
      }

      words.push(info.selectionText);
      await storage.setItem("local:words", words);
    }
  });
});
