import { Input } from "@/components/ui/input";
import { syncWordLibrary, testApiToken } from "@/utils/api";
import { toast } from "sonner";
import { produce } from "immer";
import { Empty } from "@/components/Empty";

function App() {
  const [apiToken, setApiToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const func = async () => {
      const words = (await storage.getItem<string[]>("local:words")) || [];
      setWords(words);
    };

    func();
  }, []);

  return (
    <div className="flex flex-col w-[300px] gap-y-1 p-1">
      <div className="space-y-2">
        {isEditing ? (
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
              variant={"info"}
              onClick={async () => {
                const ok = await testApiToken(apiToken);
                if (ok) {
                  toast.success("API Token is valid");
                } else {
                  toast.error("API Token is invalid");
                }
              }}
            >
              Test
            </Button>
            <Button
              size={"sm"}
              onClick={async () => {
                await storage.setItem("local:apiToken", apiToken);
                setIsEditing(false);
              }}
            >
              Save
            </Button>
            <Button
              size={"sm"}
              variant={"destructive"}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex w-full max-w-sm items-center space-x-1">
            {
              <Button
                loading={syncing}
                size={"sm"}
                onClick={async () => {
                  const storageApiToken =
                    (await storage.getItem<string>("local:apiToken")) || "";
                  if (!storageApiToken) {
                    toast.error("API Token is required");
                    return;
                  }
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
            }
            <Button
              size={"sm"}
              onClick={async () => {
                const apiToken =
                  (await storage.getItem<string>("local:apiToken")) || "";
                setApiToken(apiToken);
                setIsEditing(true);
              }}
            >
              Edit Token
            </Button>
          </div>
        )}
      </div>
      <div className="max-h-[400px] flex flex-col gap-y-1 overflow-y-auto">
        {words.length > 0 ? (
          words.map((word, index) => (
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
          ))
        ) : (
          <Empty></Empty>
        )}
      </div>
    </div>
  );
}

export default App;
