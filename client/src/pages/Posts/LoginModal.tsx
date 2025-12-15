import { Box, Input, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { API_URL } from "../../api";

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (login: string, role: string) => void;
}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async () => {
    setError(""); // сбрасываем перед новой попыткой

    if (!login.trim() || !password.trim()) {
      setError("Введите логин и пароль");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        setError("Сервер вернул неверный формат ответа");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid login"); // показываем ошибку
        return;
      }

      // Успешный вход
      onSuccess(login, data.role);

      // Очистка полей
      setLogin("");
      setPassword("");
      setError("");

      // Закрываем модалку
      onClose();
    } catch (err) {
      console.error(err);
      setError("Ошибка сервера");
    }
  };

  return (
    <Box
      color={"black"}
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      onClick={onClose} // клик по фону закрывает модалку
    >
      <Box
        display="flex"
        flexDirection="column"
        bg="white"
        p={6}
        borderRadius="md"
        minWidth="500px"
        onClick={(e) => e.stopPropagation()} // останавливаем всплытие
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Login
        </Text>

        <Input
          placeholder="Login"
          mb={3}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          mb={3}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Резервируем место под текст ошибки, чтобы модалка не прыгала */}
        <Box minH="24px" mb={3}>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
        </Box>

        <Button textTransform={"uppercase"} mb={2} onClick={handleLogin}>
          Sign In
        </Button>

        <Button textTransform={"uppercase"} onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
