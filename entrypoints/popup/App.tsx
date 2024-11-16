import { Input, Button, Space, List, Flex } from "antd";
import { useStore } from "zustand";

function App() {
  const [token, setToken] = useState("");
  const { apiToken, setApiToken } = useStore(configStore);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setToken(apiToken);
  }, [apiToken]);

  const [words, setWords] = useState<string[]>([]);
  const { wordLibrary, syncing, deleteWord, syncWordLibrary } =
    useStore(wordLibraryStore);

  useEffect(() => {
    setWords(wordLibrary[0].words);
  }, [wordLibrary]);

  return (
    <Flex vertical gap={"small"} style={{ width: 300 }}>
      <Space size={"small"} direction="horizontal">
        {!apiToken || isEditing ? (
          <>
            <Input.Password
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="API Token"
            />
            <Button
              type="primary"
              onClick={() => {
                setApiToken(token);
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
                await syncWordLibrary();
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
                  deleteWord(index);
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
  );
}

export default App;
