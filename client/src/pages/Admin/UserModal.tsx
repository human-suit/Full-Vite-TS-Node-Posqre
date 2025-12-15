import { Box, Input, Button, HStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { User } from "../../shared/types";
import { API_URL } from "../../api";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  reloadUsers: () => void;
  user: User | null;
}

export default function UserModal({
  isOpen,
  onClose,
  reloadUsers,
  user,
}: UserModalProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [originalPassword, setOriginalPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setLogin(user.login);
      setRole(user.role);
      setPassword("");
      setOriginalPassword(user.password);
    } else {
      setLogin("");
      setPassword("");
      setRole("user");
      setOriginalPassword("");
    }
    setError("");
  }, [user]);

  const saveUser = async () => {
    setError("");

    if (!login.trim()) {
      setError("Введите логин");
      return;
    }

    // Новый пользователь → пароль обязателен
    if (!user && !password.trim()) {
      setError("Введите пароль");
      return;
    }

    const payload = {
      login,
      password: password.trim() ? password : originalPassword,
      role,
    };

    if (user) {
      await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setLogin("");
      setPassword("");
    }

    reloadUsers();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Box
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
      color={"black"}
    >
      <Box bg="white" p={6} borderRadius="md" minWidth="400px">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {user ? "Update User" : "Add User"}
        </Text>

        {error && (
          <Text color="red.500" mb={2}>
            {error}
          </Text>
        )}

        <Input
          placeholder="Login"
          mt={3}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <Input
          placeholder="Password"
          mt={3}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            background: "white",
            border: "1px solid #ccc",
            marginTop: "12px",
          }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <HStack mt={4} justifyContent="flex-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={saveUser}>{user ? "Update" : "Add"}</Button>
        </HStack>
      </Box>
    </Box>
  );
}
