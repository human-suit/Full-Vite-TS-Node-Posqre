import { Box, Text, HStack, Button } from "@chakra-ui/react";
import type { User } from "../../shared/types";

interface UsersListProps {
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
}

export default function UsersList({ users, onDelete, onEdit }: UsersListProps) {
  return (
    <HStack wrap="wrap" gap={4}>
      {users.map((u) => (
        <Box
          key={u.id}
          borderWidth="1px"
          borderRadius="md"
          p={4}
          width="300px"
          shadow="md"
        >
          <Text fontWeight="bold">{u.login}</Text>
          <Text mt={2}>Role: {u.role}</Text>
          <HStack mt={4} gap={2}>
            <Button colorScheme="yellow" size="sm" onClick={() => onEdit(u)}>
              Update
            </Button>
            <Button colorScheme="red" size="sm" onClick={() => onDelete(u.id)}>
              Delete
            </Button>
          </HStack>
        </Box>
      ))}
    </HStack>
  );
}
