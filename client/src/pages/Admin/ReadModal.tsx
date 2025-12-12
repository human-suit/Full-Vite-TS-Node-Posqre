import { Box, Text, Button } from "@chakra-ui/react";
import type { User, Post } from "../../shared/types";

interface ReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  users?: User[];
  posts?: Post[];
}

export default function ReadModal({
  isOpen,
  onClose,
  users,
  posts,
}: ReadModalProps) {
  if (!isOpen) return null;

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
    >
      <Box
        bg="white"
        p={6}
        borderRadius="md"
        minWidth="400px"
        maxH="80vh"
        overflowY="auto"
      >
        {users && users.length > 0 && (
          <Box>
            {users.map((u) => (
              <Text key={u.id} mb={1}>
                {u.login} ({u.role})
              </Text>
            ))}
          </Box>
        )}
        {posts && posts.length > 0 && (
          <Box>
            {posts.map((p) => (
              <Box
                key={p.id}
                borderWidth="1px"
                borderRadius="md"
                p={4}
                width="300px"
                height="350px"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                shadow="md"
              >
                <Text fontWeight="bold">{p.title}</Text>

                <Box
                  mt={2}
                  flex="1"
                  overflowY="auto"
                  dangerouslySetInnerHTML={{ __html: p.description }}
                />
              </Box>
            ))}
          </Box>
        )}

        <Button mt={4} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
}
