import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Select,
  Text,
} from "@chakra-ui/react";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      // usersテーブルにデータを登録
      const { error } = await supabase
        .from("users")
        .insert([{ 
          user_id: data.userId,
          name: data.name,
          description: data.description,
          github_id: data.githubId,
          qiita_id: data.qiitaId,
          x_id: data.xId,
        }]);
      
      if (error) throw error;

      // スキルをuser_skillテーブルに登録
      if (data.skill) {
        const { error: skillError } = await supabase
          .from("user_skill")
          .insert([{ user_id: data.userId, skill_id: parseInt(data.skill) }]);
        
        if (skillError) throw skillError;
      }

      // 登録後、カードページにリダイレクト
      navigate(`/cards/${data.userId}`);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} boxShadow="md" borderRadius="md" data-testid="register-page">
      <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="register-form">
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>ID</FormLabel>
            <Input
              {...register("userId", { required: "IDは必須です", pattern: /^[a-zA-Z0-9]+$/ })}
              placeholder="ID (英数字のみ)"
              data-testid="user-id-input"
            />
            {errors.userId && errors.userId.message && (
              <Text color="red.500" data-testid="user-id-error">
                {String(errors.userId.message)}
              </Text>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>名前</FormLabel>
            <Input
              {...register("name", { required: "名前は必須です" })}
              placeholder="名前"
              data-testid="name-input"
            />
            {errors.name && errors.name.message && (
              <Text color="red.500" data-testid="name-error">
                {String(errors.name.message)}
              </Text>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>自己紹介</FormLabel>
            <Textarea
              {...register("description", { required: "自己紹介は必須です" })}
              placeholder="自己紹介"
              data-testid="description-input"
            />
            {errors.description && errors.description.message && (
              <Text color="red.500" data-testid="description-error">
                {String(errors.description.message)}
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>好きな技術</FormLabel>
            <Select {...register("skill")} data-testid="skill-select">
              <option value="">選択してください</option>
              <option value="1">React</option>
              <option value="2">TypeScript</option>
              <option value="3">GitHub</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>GitHub ID</FormLabel>
            <Input {...register("githubId")} placeholder="GitHub ID" data-testid="github-id-input" />
          </FormControl>

          <FormControl>
            <FormLabel>Qiita ID</FormLabel>
            <Input {...register("qiitaId")} placeholder="Qiita ID" data-testid="qiita-id-input" />
          </FormControl>

          <FormControl>
            <FormLabel>X ID</FormLabel>
            <Input {...register("xId")} placeholder="X ID" data-testid="x-id-input" />
          </FormControl>

          <Button colorScheme="blue" type="submit" data-testid="submit-button">登録</Button>
        </Stack>
      </form>
    </Box>
  );
}

export default RegisterPage;
