import { Input } from "@/components/ui/input";
import { syncWordLibrary } from "@/utils/api";
import { toast } from "sonner";
import { produce } from "immer";

function App() {
  const [apiToken, setApiToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const func = async () => {
      const apiToken = (await storage.getItem<string>("local:apiToken")) || "";
      setApiToken(apiToken);
      const words = (await storage.getItem<string[]>("local:words")) || [];
      setWords(words);
    };

    func();
  }, []);

  return (
    <div className="flex flex-col w-[300px] gap-y-1 p-1">
      <div className="space-y-2">
        {!apiToken || isEditing ? (
          <div className="flex w-full max-w-sm items-center space-x-1">
            <Input
              className="h-8 text-sm"
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="API Token"
            />
            <Button
              size={"sm"}
              onClick={async () => {
                await storage.setItem("local:apiToken", apiToken);
                setIsEditing(false);
              }}
            >
              Save
            </Button>
          </div>
        ) : (
          <div className="flex w-full max-w-sm items-center space-x-1">
            <Button
              loading={syncing}
              color="red-500"
              size={"sm"}
              onClick={async () => {
                setSyncing(true);
                try {
                  await syncWordLibrary(words);
                  toast.success("Word library synced");
                } catch (error) {
                  toast.error("Failed to sync word library");
                } finally {
                  setSyncing(false);
                }
              }}
            >
              Sync Word Library
            </Button>
            <Button size={"sm"} onClick={() => setIsEditing(true)}>
              Edit Token
            </Button>
          </div>
        )}
      </div>
      {words.map((word, index) => (
        <p key={index} className="flex items-center px-1 border rounded-md">
          <span className="flex-auto pl-2">{word}</span>
          <Button
            className="text-red-500"
            size={"sm"}
            variant={"link"}
            onClick={() => {
              setWords(
                produce((draft) => {
                  draft.splice(index, 1);
                  storage.setItem("local:words", [...draft]);
                })
              );
            }}
          >
            Remove
          </Button>
        </p>
      ))}
    </div>
  );
}

export default App;
