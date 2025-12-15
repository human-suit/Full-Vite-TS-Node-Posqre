import { useState, useMemo, useRef, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import type { Post, User } from "../../shared/types";
import "../../shared/styles/reset.scss";

interface PostItemProps {
  post: Post;
  users: User[];
}

export default function PostItem({ post, users = [] }: PostItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const authorLogin = useMemo(() => {
    if (!users || users.length === 0) return "Unknown";
    const author = users.find(
      (u) => u.id.toString() === post.author.toString(),
    );
    return author ? author.login : "Unknown";
  }, [users, post.author]);

  // Разделяем текст и изображения
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = post.description || "";

  const images: string[] = Array.from(tempDiv.querySelectorAll("img")).map(
    (img) => img.src,
  );

  tempDiv.querySelectorAll("img").forEach((img) => img.remove());
  const textContent = tempDiv.innerHTML;

  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [textContent]);

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
      fontFamily="OpenSans, sans-serif"
    >
      <Text fontWeight="500" mb={2}>
        Заголовок:{" "}
        <Text as="span" fontWeight="400">
          {post.title}
        </Text>
      </Text>

      <Box
        ref={textRef}
        color="gray.200"
        maxH={expanded ? "none" : "60px"}
        overflow="hidden"
        mb={2}
      >
        <Text mb={2} fontWeight="500">
          Описание:
        </Text>

        <Box
          dangerouslySetInnerHTML={{ __html: textContent }}
          color="sweetpet.gray.300"
          fontWeight={400}
        />
      </Box>

      {isOverflowing && (
        <Button
          size="sm"
          color="white"
          mb={2}
          onClick={() => setExpanded(!expanded)}
          fontFamily="Poppins, sans-serif"
          fontWeight="500"
        >
          {expanded ? "Свернуть" : "Развернуть"}
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

      <Flex justifyContent="space-between">
        <Text mt={1} fontWeight="400" fontFamily="IBMPlexSans, sans-serif">
          Автор поста: {authorLogin}
        </Text>

        {formattedDate && (
          <Text mt={2} fontSize="sm" color="gray.400" textAlign="right">
            {formattedDate}
          </Text>
        )}
      </Flex>
    </Box>
  );
}
