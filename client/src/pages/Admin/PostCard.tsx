import { Box, Text, HStack, Button, Link, Image } from "@chakra-ui/react";
import { useState } from "react";

export default function PostCard({ post, onDelete, onEdit }) {
  const [color, setColor] = useState("black");
  const [italic, setItalic] = useState(false);
  const [bold, setBold] = useState(false);

  return (
    <Box
      width="300px"
      height="370px"
      borderWidth="1px"
      borderRadius="md"
      p={4}
      shadow="md"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
    >
      {/* image */}
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          borderRadius="md"
          height="120px"
          objectFit="cover"
          mb={3}
        />
      )}

      {/* title */}
      <Text
        fontWeight={bold ? "bold" : "normal"}
        fontStyle={italic ? "italic" : "normal"}
        color={color}
        fontSize="lg"
        noOfLines={1}
      >
        {post.title}
      </Text>

      {/* description */}
      <Text
        mt={2}
        fontWeight={bold ? "bold" : "normal"}
        fontStyle={italic ? "italic" : "normal"}
        color={color}
        noOfLines={3}
      >
        {post.description}
      </Text>

      {/* link */}
      {post.link && (
        <Link
          href={post.link}
          color="blue.400"
          mt={2}
          isExternal
          textDecoration="underline"
        >
          Читать подробнее →
        </Link>
      )}

      {/* formatting buttons */}
      <HStack gap={2} mt={3}>
        <Button size="xs" onClick={() => setBold(!bold)}>
          Bold
        </Button>
        <Button size="xs" onClick={() => setItalic(!italic)}>
          Italic
        </Button>
        <Button
          size="xs"
          onClick={() => setColor(color === "black" ? "red" : "black")}
        >
          Color
        </Button>
      </HStack>

      {/* edit + delete */}
      <HStack mt={3} gap={2}>
        <Button colorScheme="yellow" size="sm" onClick={onEdit}>
          Update
        </Button>
        <Button colorScheme="red" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </HStack>
    </Box>
  );
}
