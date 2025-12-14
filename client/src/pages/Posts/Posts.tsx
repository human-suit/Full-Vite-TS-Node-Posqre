import { useEffect, useState } from "react";
import { Box, Heading, Button, Text } from "@chakra-ui/react";
import LoginModal from "./LoginModal";
import { API_URL } from "../../api";
import PostItem from "./PostItem";
import type { Post, User } from "../../shared/types";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userLogin, setUserLogin] = useState<string | null>(
    localStorage.getItem("login"),
  );
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem("role"),
  );

  useEffect(() => {
    const savedLogin = localStorage.getItem("login");
    const savedRole = localStorage.getItem("role");

    if (savedLogin) setUserLogin(savedLogin);
    if (savedRole) setUserRole(savedRole);

    
    fetch(`${API_URL}/posts`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]);
      });

    
    fetch(`${API_URL}/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, []);

  const handleLoginSuccess = (login: string, role: string) => {
    localStorage.setItem("login", login);
    localStorage.setItem("role", role);

    if (role === "admin") {
      window.location.href = "/admin";
      return;
    }

    setUserLogin(login);
    setUserRole(role);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setUserLogin(null);
    setUserRole(null);
    localStorage.clear();
  };

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      justifyContent="center"
      bg=""
      py={4}
    >
      <Box
        maxW="800px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={6}
        mx="auto"
      >
        <Heading textAlign="center">Posts NEWTICK</Heading>

        {userLogin ? (
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text>Logged in as: {userLogin}</Text>
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button width="100%" onClick={() => setLoginOpen(true)}>
            Login
          </Button>
        )}

        <Box
          display="flex"
          flexDirection="column"
          gap={4}
          width="100%"
          alignItems="center"
        >
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => <PostItem key={post.id} post={post} users={users} />)
          ) : (
            <Text>No posts available</Text>
          )}
        </Box>

        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </Box>
    </Box>
  );
}
