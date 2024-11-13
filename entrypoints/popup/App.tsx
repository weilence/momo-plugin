import { Input, Button, Space, List, Flex } from "antd";
import { configStore, wordLibraryStore } from "../store";
import { useStore } from "zustand";

function App() {
  const [token, setToken] = useState("");
  const { apiToken, setApiToken } = useStore(configStore);

  useEffect(() => {
    setToken(apiToken);
  }, [apiToken]);

  const [words, setWords] = useState<string[]>([]);
  const { wordLibrary } = useStore(wordLibraryStore);

  useEffect(() => {
    setWords(wordLibrary[0].words);
  }, [wordLibrary]);

  return (
    <Flex vertical gap={"small"} style={{ width: 300 }}>
      <Space size={"small"} direction="horizontal">
        <Input.Password
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button type="primary" onClick={() => setApiToken(token)}>
          Set API Token
        </Button>
      </Space>
      <List
        bordered
        dataSource={words}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Flex>
  );
}

export default App;