import { useState, useMemo } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import type { Post, User } from "../../shared/types";

interface PostItemProps {
  post: Post;
  users: User[];
}

export default function PostItem({ post, users = [] }: PostItemProps) {
  const [expanded, setExpanded] = useState(false);
  console.log(post.date);
  // Находим login автора
  const authorLogin = useMemo(() => {
    if (!users || users.length === 0) return "Unknown";
    const author = users.find(
      (u) => u.id.toString() === post.author.toString(),
    );
    return author ? author.login : "Unknown";
  }, [users, post.author]);

  // Разделяем текст и картинки
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = post.description || "";

  const images: string[] = Array.from(tempDiv.querySelectorAll("img")).map(
    (img) => img.src,
  );

  tempDiv.querySelectorAll("img").forEach((img) => img.remove());
  const textContent = tempDiv.innerHTML;

  // Форматируем дату
  const formattedDate = post.date
    ? new Date(post.date).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Box
      width="100%"
      maxW="400px"
      borderRadius="lg"
      boxShadow="md"
      p={4}
      color="white"
      bg="#3f3e3eff"
    >
      <Text fontWeight="bold" mb={1}>
        Автор поста: {authorLogin}
      </Text>

      <Text fontWeight="bold" mb={2}>
        Заголовок: {post.title}
      </Text>

      <Box
        color="gray.200"
        maxH={expanded ? "none" : "60px"}
        overflow="hidden"
        mb={2}
      >
        <div>
          <Text mb={2}>Описание:</Text>
        </div>
        <div dangerouslySetInnerHTML={{ __html: textContent }} />
      </Box>

      {textContent.length > 100 && (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="teal"
          color="white"
          mb={2}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Свернуть" : "Показать ещё"}
        </Button>
      )}

      {images.map((src, index) => (
        <Box key={index} mb={2}>
          <img
            src={src}
            alt={`Post ${post.id}`}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>
      ))}

      {/* Дата внизу */}
      {formattedDate && (
        <Text mt={2} fontSize="sm" color="gray.400" textAlign="right">
          {formattedDate}
        </Text>
      )}
    </Box>
  );
}
