import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Button, Flex, Heading } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export function Header() {
  const currentAccount = useCurrentAccount();

  return (
    <Flex
      position="sticky"
      px="4"
      py="2"
      justify="between"
      align={"center"}
      style={{
        borderBottom: "1px solid var(--color-border)",
        height: "64px",
      }}
    >
      <Box>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Heading size="6" style={{ color: "var(--color-text-primary)" }}>
            CHAMPION TOGETHER
          </Heading>
        </Link>
      </Box>

      <Box style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link
          to="/"
          style={{
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            marginRight: "10px",
          }}
        >
          トップ
        </Link>
        <Link
          to="/support"
          style={{
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            marginRight: "10px",
          }}
        >
          Support
        </Link>
        <Link
          to="/mypage"
          style={{
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            marginRight: "10px",
          }}
        >
          マイページ
        </Link>
        <Link
          to="/exclusive"
          style={{
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            marginRight: "10px",
          }}
        >
          限定コンテンツ
        </Link>
        <Link
          to="/admin"
          style={{
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            marginRight: "10px",
          }}
        >
          管理
        </Link>
        {currentAccount && (
          <Button
            variant="soft"
            onClick={() => {
              window.open(
                `https://faucet.sui.io/?address=${currentAccount.address}`,
                "_blank"
              );
            }}
          >
            Get Testnet SUI
          </Button>
        )}
        <ConnectButton />
      </Box>
    </Flex>
  );
}
