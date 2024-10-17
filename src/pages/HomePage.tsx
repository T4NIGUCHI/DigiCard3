import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";

function HomePage() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserId(e.target.value);
    setError(""); // 入力が変更されたらエラーメッセージをクリア
  };

  const handleSubmit = () => {
    if (!userId) {
      setError("IDを入力してください");
      return;
    }

    // IDが入力されている場合、名刺ページに遷移
    navigate(`/cards/${userId}`);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} boxShadow="md" borderRadius="md">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>IDを入力してください</FormLabel>
          <Input
            value={userId}
            onChange={handleInputChange}
            placeholder="ID"
          />
          {error && <Text color="red.500">{error}</Text>}
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit}>
          名刺を見る
        </Button>

        <Link href="/cards/register" color="blue.500" mt={4}>
          新規登録はこちら
        </Link>
      </VStack>
    </Box>
  );
}

export default HomePage;
