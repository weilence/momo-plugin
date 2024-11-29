import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default () => {
  useEffect(() => {
    browser.runtime.onMessage.addListener(async (message) => {
      const { action } = message;
      if (action === "word-add") {
        toast.success("Word added to library");
      } else if (action === "word-exist") {
        toast.error("Word already exists in library");
      }
    });
  });

  return <Toaster richColors theme="light" position="top-center" closeButton />;
};
