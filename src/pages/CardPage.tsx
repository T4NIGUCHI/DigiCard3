import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import {
  Box,
  Spinner,
  Text,
  Link,
  Stack,
  Flex,
  Avatar,
  Heading,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub, FaTwitter, FaBook } from "react-icons/fa";

type User = {
  name: string;
  description: string;
  skills: { name: string; url?: string }[];
  githubUrl?: string;
  qiitaUrl?: string;
  xUrl?: string;
};

const createUser = (data: any): User => {
  return {
    name: data.name,
    description: data.description,
    skills: [
      { name: "GitHub", url: data.github_id ? `https://github.com/${data.github_id}` : undefined },
      { name: "Qiita", url: data.qiita_id ? `https://qiita.com/${data.qiita_id}` : undefined },
      { name: "X", url: data.x_id ? `https://x.com/${data.x_id}` : undefined },
    ],
    githubUrl: data.github_id ? `https://github.com/${data.github_id}` : undefined,
    qiitaUrl: data.qiita_id ? `https://qiita.com/${data.qiita_id}` : undefined,
    xUrl: data.x_id ? `https://x.com/${data.x_id}` : undefined,
  };
};

function CardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserWithSkills = async () => {
      if (!id) return;

      setLoading(true);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name, description, github_id, qiita_id, x_id")
        .eq("user_id", id)
        .single();

      if (userError || !userData) {
        setLoading(false);
        return;
      }

      const user = createUser(userData);
      setUser(user);
      setLoading(false);
    };

    fetchUserWithSkills();
  }, [id]);

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return <Spinner data-testid="loading-spinner" />;
  }

  if (!user) {
    return <Text>ユーザーが見つかりませんでした。</Text>;
  }

  return (
    <Flex justify="center" align="center" p={4}>
      <Box w="100%" maxW="sm" boxShadow="lg" borderRadius="md" bg={useColorModeValue("white", "gray.800")}>
        <Stack align="center" spacing={4} p={4}>
          <Avatar name={user.name} size="xl" />
          <Heading size="md" data-testid="user-name">{user.name}</Heading>
          <Text fontSize="sm" color="gray.500">{user.description}</Text>

          <Box w="100%">
            <Text fontWeight="bold" mb={2}>Skills:</Text>
            {user.skills.map((skill, index) => (
              skill.url ? (
                <Link key={index} href={skill.url} isExternal display="block" mb={2} color="blue.500">
                  <Flex align="center">
                    <Icon as={skill.name === "GitHub" ? FaGithub : skill.name === "Qiita" ? FaBook : FaTwitter} mr={2} />
                    {skill.name}
                  </Flex>
                </Link>
              ) : (
                <Text key={index} display="block" mb={2}>- {skill.name}</Text>
              )
            ))}
          </Box>

          <Button mt={6} colorScheme="blue" onClick={handleBackClick}>
            戻る
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
}

export default CardPage;
