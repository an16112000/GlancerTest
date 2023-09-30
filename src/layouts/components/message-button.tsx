import { Button } from "@mantine/core";
import { IconMessageCircle2 } from "@tabler/icons";
import Link from "next/link";

export const MessageButton = () => {
  return (
    <Link href="/chat" target="_blank" rel="noopener noreferrer">
      <Button variant="outline" px={8}>
        <IconMessageCircle2 size={22} />
      </Button>
    </Link>
  );
};
