import { Box, Text, HStack, Button } from "@chakra-ui/react";
import type { Post } from "../../shared/types";

interface PostsListProps {
  posts: Post[];
  onDelete: (id: number) => void;
  onEdit: (post: Post) => void;
}

export default function PostsList({ posts, onDelete, onEdit }: PostsListProps) {
  return (
    <HStack wrap="wrap" gap={4}>
      {posts.map((p) => (
        <Box
          key={p.id}
          borderRadius="md"
          bg={"#555"}
          p={4}
          width="300px"
          height="350px"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          shadow="md"
        >
          <Text fontWeight="bold">Title: {p.title}</Text>

          <Box
            mt={2}
            flex="1"
            overflowY="auto"
            dangerouslySetInnerHTML={{ __html: p.description }}
          />

          <HStack mt={4} gap={2}>
            <Button
              bg={"black"}
              _hover={{
                bg: "white",
                color: "black",
              }}
              size="sm"
              onClick={() => onEdit(p)}
            >
              Update
            </Button>
            <Button
              bg={"black"}
              _hover={{
                bg: "white",
                color: "black",
              }}
              size="sm"
              onClick={() => onDelete(p.id)}
            >
              Delete
            </Button>
          </HStack>
        </Box>
      ))}
    </HStack>
  );
}
