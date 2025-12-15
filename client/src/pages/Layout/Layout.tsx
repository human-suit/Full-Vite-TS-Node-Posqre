import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: AppLayoutProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box minH="100vh" w="100vw" bg="#1a1a1a" color="white">
      {loading ? (
        <Center minH="100vh">
          <Spinner size="xl" color="white" />
        </Center>
      ) : (
        children
      )}
    </Box>
  );
}
