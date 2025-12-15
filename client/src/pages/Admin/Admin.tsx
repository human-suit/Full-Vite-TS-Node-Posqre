import { Flex, VStack, Text, Button, Box, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { API_URL } from "../../api";
import type { User, Post } from "../../shared/types";

import UsersList from "./UsersList";
import PostsList from "./PostsList";
import UserModal from "./UserModal";
import PostModal from "./PostModal";
import ReadModal from "./ReadModal";

export default function Admin() {
  const [tab, setTab] = useState<"users" | "posts">("users");

  const [userReadModalOpen, setUserReadModalOpen] = useState(false);
  const [postReadModalOpen, setPostReadModalOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const loadUsers = () =>
    fetch(`${API_URL}/users`)
      .then((r) => r.json())
      .then((data: User[]) => data.sort((a, b) => b.id - a.id))
      .then(setUsers);

  const loadPosts = () =>
    fetch(`${API_URL}/posts`)
      .then((r) => r.json())
      .then((data: Post[]) => data.sort((a, b) => b.id - a.id))
      .then(setPosts);

  const handleDeleteUser = async (id: number) => {
    try {
      await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
      loadUsers();
    } catch (err) {
      console.error("Ошибка удаления пользователя:", err);
    }
  };
  const handleDeletePost = async (id: number) => {
    try {
      await fetch(`${API_URL}/posts/${id}`, { method: "DELETE" });
      loadPosts();
    } catch (err) {
      console.error("Ошибка удаления поста:", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadPosts();
  }, []);

  return (
    <Flex height="100vh">
      {/* Sidebar */}
      <VStack width="250px" bg="gray.800" color="white" padding="20px" gap={4}>
        <Text fontSize="2xl" textTransform={"uppercase"} fontWeight="bold">
          Admin Panel
        </Text>
        <Button
          width="100%"
          colorScheme={tab === "users" ? "teal" : "gray"}
          onClick={() => setTab("users")}
        >
          Users
        </Button>
        <Button
          width="100%"
          colorScheme={tab === "posts" ? "teal" : "gray"}
          onClick={() => setTab("posts")}
        >
          Posts
        </Button>
        <Button
          width="100%"
          colorScheme={tab === "posts" ? "teal" : "gray"}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("login");
            window.location.href = "/";
          }}
        >
          Exit
        </Button>
      </VStack>

      {/* Main Content */}
      <Box flex="1" p={6} overflowY="auto">
        <HStack justifyContent="space-between" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            {tab === "users" ? "Users Management" : "Posts Management"}
          </Text>
          <HStack>
            {tab === "users" && (
              <>
                <Button
                  bg={"black"}
                  _hover={{
                    bg: "white",
                    color: "black",
                  }}
                  onClick={() => {
                    setEditUser(null);
                    setUserModalOpen(true);
                  }}
                >
                  Add User
                </Button>
                <Button
                  bg={"black"}
                  _hover={{
                    bg: "white",
                    color: "black",
                  }}
                  onClick={() => setUserReadModalOpen(true)}
                >
                  Read All Users
                </Button>
              </>
            )}
            {tab === "posts" && (
              <>
                <Button
                  bg={"black"}
                  _hover={{
                    bg: "white",
                    color: "black",
                  }}
                  onClick={() => {
                    setEditPost(null);
                    setPostModalOpen(true);
                  }}
                >
                  Add Post
                </Button>
                <Button
                  bg={"black"}
                  _hover={{
                    bg: "white",
                    color: "black",
                  }}
                  onClick={() => setPostReadModalOpen(true)}
                >
                  Read All Posts
                </Button>
              </>
            )}
          </HStack>
        </HStack>

        {tab === "users" ? (
          <UsersList
            users={users}
            onDelete={handleDeleteUser}
            onEdit={(user) => {
              setEditUser(user);
              setUserModalOpen(true);
            }}
          />
        ) : (
          <PostsList
            posts={posts}
            onDelete={handleDeletePost}
            onEdit={(post) => {
              setEditPost(post);
              setPostModalOpen(true);
            }}
          />
        )}
      </Box>

      {/* Modals */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        reloadUsers={loadUsers}
        user={editUser}
      />
      <PostModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        reloadPosts={loadPosts}
        post={editPost}
      />
      <ReadModal
        isOpen={userReadModalOpen}
        onClose={() => setUserReadModalOpen(false)}
        users={users}
      />

      <ReadModal
        isOpen={postReadModalOpen}
        onClose={() => setPostReadModalOpen(false)}
        posts={posts}
      />
    </Flex>
  );
}
