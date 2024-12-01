import { useClickOutside } from "@/hooks/click-outside";
import { Languages } from "lucide-react";
import { useImmer } from "use-immer";

export default () => {
  const [state, setState] = useImmer({
    show: false,
    position: { x: 0, y: 0 },
    word: "",
  });
  const ref = useClickOutside<HTMLButtonElement>(() => {
    console.log("click outside");
    setState((draft) => {
      draft.word = "";
      draft.show = false;
    });
  });

  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const selection = document.getSelection();
      if (!selection) {
        return;
      }

      const text = selection.toString();
      if (text.length === 0) {
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setState((draft) => {
        draft.position = {
          x: rect.x + rect.width,
          y: rect.y + rect.height,
        };
        draft.word = text;
      });
    });

    document.addEventListener("mouseup", () => {
      setState((draft) => {
        draft.show = !!draft.word;
      });
    });
  }, []);

  return (
    <div
      style={{
        display: state.show ? "block" : "none",
      }}
    >
      <Button
        ref={ref}
        size="icon"
        style={{
          position: "fixed",
          top: state.position.y,
          left: state.position.x,
          zIndex: 9999,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <Languages />
      </Button>
    </div>
  );
};
