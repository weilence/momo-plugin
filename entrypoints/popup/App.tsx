import { syncWordLibrary } from "@/utils/api";
import { Input, Button, Space, List, Flex, message } from "antd";
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

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <Flex vertical gap={"small"} style={{ width: 300 }}>
        <Space size={"small"} direction="horizontal">
          {!apiToken || isEditing ? (
            <>
              <Input.Password
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="API Token"
              />
              <Button
                type="primary"
                onClick={async () => {
                  await storage.setItem("local:apiToken", apiToken);
                  setIsEditing(false);
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                type="primary"
                onClick={async () => {
                  setSyncing(true);
                  try {
                    await syncWordLibrary(words);
                    messageApi.success("Word library synced");
                  } catch (error) {
                    console.error(error);
                    messageApi.error("Failed to sync word library");
                  } finally {
                    setSyncing(false);
                  }
                }}
                loading={syncing}
              >
                Sync Word Library
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit Token</Button>
            </>
          )}
        </Space>
        <List
          dataSource={words}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  danger
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
                </Button>,
              ]}
            >
              {item}
            </List.Item>
          )}
        />
      </Flex>
    </>
  );
}

export default App;
