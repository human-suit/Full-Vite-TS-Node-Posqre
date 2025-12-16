import { Box, Input, Button, HStack, Text, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import type { Post, User } from "../../shared/types";
import { API_URL } from "../../api";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaImage,
  FaLink,
  FaListUl,
  FaListOl,
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
  const [authorId, setAuthorId] = useState<number | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const [color, setColor] = useState("#000000");
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image.configure({ allowBase64: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: post?.description || "",
  });

  useEffect(() => {
    if (!isOpen) return;

    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        if (!post) setAuthorId(data[0]?.id);
      });
  }, [isOpen, post]);

  useEffect(() => {
    setTitle(post?.title || "");
    setAuthorId(post?.author);
    setDate(
      post?.date
        ? new Date(post.date).toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
        : new Date().toISOString().slice(0, 16),
    );
    editor?.commands.setContent(post?.description || "");
    setError(null);
  }, [post, editor, isOpen]);

  if (!isOpen || !editor) return null;

  const insertImageFromFile = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      setError("Файл слишком большой. Максимум 50MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
    };
    reader.readAsDataURL(file);
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) insertImageFromFile(file);
    };
    input.click();
  };

  const savePost = async () => {
    if (!authorId) return alert("Выберите автора");

    const payload = {
      title,
      description: editor.getHTML(),
      author: authorId,
      date,
    };

    try {
      const res = await fetch(`${API_URL}/posts${post ? `/${post.id}` : ""}`, {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 413)
          throw new Error("Файл слишком большой. Максимум 50MB.");
        const data = await res.json();
        throw new Error(data.error || "Ошибка при сохранении поста");
      }

      reloadPosts();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <Box
      position="fixed"
      inset={0}
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      onClick={onClose}
    >
      <Box
        bg="white"
        p={6}
        borderRadius="md"
        minW="520px"
        color="black"
        onClick={(e) => e.stopPropagation()}
      >
        <Text fontSize="xl" fontWeight="bold">
          {post ? "Update Post" : "Add Post"}
        </Text>

        {error && (
          <Text color="red.500" mt={2}>
            {error}
          </Text>
        )}

        <Input
          mt={3}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          type="datetime-local"
          mt={3}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          value={authorId ?? ""}
          onChange={(e) => setAuthorId(Number(e.target.value))}
          style={{
            background: "white",
            marginTop: 12,
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select author…</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.login}
            </option>
          ))}
        </select>

        <HStack mt={3} gap={2}>
          <IconButton
            aria-label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            colorScheme={editor.isActive("bold") ? "teal" : "gray"}
          >
            <FaBold />
          </IconButton>

          <IconButton
            aria-label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            colorScheme={editor.isActive("italic") ? "teal" : "gray"}
          >
            <FaItalic />
          </IconButton>

          <IconButton
            aria-label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            colorScheme={editor.isActive("underline") ? "teal" : "gray"}
          >
            <FaUnderline />
          </IconButton>

          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              editor.chain().focus().setColor(e.target.value).run();
            }}
            style={{ width: 36, height: 36, border: "none" }}
          />

          <IconButton
            aria-label="Link"
            onClick={() => {
              const url = prompt("Enter link");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
          >
            <FaLink />
          </IconButton>

          <IconButton aria-label="Image" onClick={addImage}>
            <FaImage />
          </IconButton>

          <IconButton
            aria-label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            colorScheme={editor.isActive("bulletList") ? "teal" : "gray"}
          >
            <FaListUl />
          </IconButton>

          <IconButton
            aria-label="Ordered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            colorScheme={editor.isActive("orderedList") ? "teal" : "gray"}
          >
            <FaListOl />
          </IconButton>
        </HStack>

        <Box
          mt={3}
          border="1px solid #555"
          borderRadius="md"
          minH="200px"
          maxH="50vh"
          overflowY="auto"
          p={4}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file?.type.startsWith("image/")) insertImageFromFile(file);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <EditorContent editor={editor} />
        </Box>

        <HStack mt={4} justifyContent="flex-end">
          <Button
            onClick={() => {
              onClose();
              setError(null);
            }}
          >
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={savePost}>
            {post ? "Update" : "Save"}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
