import { Toaster } from "@/components/ui/toaster";

export default () => {
  useEffect(() => {
    browser.runtime.onMessage.addListener(async (message) => {
      const { action } = message;
      if (action === "add-word") {
        toast({
          description: "Word added to library",
        });
      }
    });
  });

  return <Toaster />;
};
