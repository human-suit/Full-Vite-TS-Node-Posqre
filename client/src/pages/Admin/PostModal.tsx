import { Box, Input, Button, HStack, Text, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import type { Post, User } from "../../shared/types";
import { API_URL } from "../../api";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaImage,
  FaLink,
} from "react-icons/fa";

export default function PostModal({
  isOpen,
  onClose,
  reloadPosts,
  post,
}: {
  isOpen: boolean;
  onClose: () => void;
  reloadPosts: () => void;
  post: Post | null;
}) {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [color, setColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],
    content: post?.description || "",
  });

  const ToolButton = ({
    label,
    icon,
    action,
    isActive,
  }: {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    isActive: boolean;
  }) => (
    <IconButton
      aria-label={label}
      onClick={action}
      aria-pressed={isActive}
      colorScheme={isActive ? "teal" : "gray"}
    >
      {icon}
    </IconButton>
  );

  // Загружаем пользователей
  useEffect(() => {
    if (!isOpen) return;

    const loadUsers = async () => {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
      if (!post) setAuthorId(data[0]?.id); // первый пользователь по умолчанию
    };
    loadUsers();
  }, [isOpen, post]);

  // Сбрасываем состояние при открытии модалки
  useEffect(() => {
    setTitle(post?.title || "");
    setAuthorId(post?.author);
    editor?.commands.setContent(post?.description || "");
  }, [post, editor]);

  if (!isOpen || !editor) return null;

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const savePost = async () => {
    if (!authorId) return alert("Choose author");

    const payload = {
      title,
      description: editor.getHTML(),
      author: authorId, // важно: отправляем число
    };

    try {
      if (post) {
        await fetch(`${API_URL}/posts/${post.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_URL}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      reloadPosts();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      color={"black"}
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      onClick={onClose} // клик по фону закрывает модалку
    >
      <Box
        bg="white"
        p={6}
        borderRadius="md"
        minWidth="500px"
        onClick={(e) => e.stopPropagation()} // останавливаем всплытие клика
      >
        <Text fontSize="xl" fontWeight="bold">
          {post ? "Update Post" : "Add Post"}
        </Text>

        <Input
          mt={3}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          style={{
            background: "white",
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginTop: "12px",
          }}
          value={authorId ?? ""}
          onChange={(e) => setAuthorId(Number(e.target.value))}
        >
          <option value="">Select author…</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.login}
            </option>
          ))}
        </select>

        <HStack mt={3} gap={2}>
          <ToolButton
            label="Bold"
            icon={<FaBold />}
            action={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          />
          <ToolButton
            label="Italic"
            icon={<FaItalic />}
            action={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          />

          <ToolButton
            label="Underline"
            icon={<FaUnderline />}
            action={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          />

          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              editor.chain().focus().setColor(e.target.value).run();
            }}
            style={{
              width: 40,
              height: 40,
              border: "none",
              padding: 0,
              background: "white",
            }}
          />
          <ToolButton
            label="Link"
            icon={<FaLink />}
            action={() => {
              const url = prompt("Enter link");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            isActive={editor.isActive("link")}
          />
          <ToolButton
            label="Image"
            icon={<FaImage />}
            action={addImage}
            isActive={false}
          />
        </HStack>

        <Box
          maxW="500px"
          mt={3}
          p={0}
          border="1px solid #555"
          borderRadius="md"
          minHeight="200px"
          maxHeight="50vh"
          overflowY="auto"
          padding={5}
          pl={2}
        >
          <EditorContent editor={editor} className="tiptap" />
        </Box>

        <HStack mt={4} justifyContent="flex-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={savePost}>{post ? "Update" : "Save"}</Button>
        </HStack>
      </Box>
    </Box>
  );
}
