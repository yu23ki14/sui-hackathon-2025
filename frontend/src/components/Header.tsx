import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Button, Dialog, Flex, Heading, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config";

export function Header() {
  const currentAccount = useCurrentAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "トップ" },
    { to: "/support", label: "Support" },
    { to: "/mypage", label: "マイページ" },
    { to: "/exclusive", label: "限定コンテンツ" },
    { to: "/admin", label: "管理" },
  ];

  return (
    <Flex
      position="sticky"
      px="4"
      py="2"
      justify="between"
      align="center"
      style={{
        borderBottom: "1px solid var(--color-border)",
        minHeight: "64px",
      }}
    >
      {/* Logo */}
      <Box>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Heading
            size={{ initial: "4", sm: "5", md: "6" }}
            style={{ color: "var(--color-text-primary)" }}
          >
            {siteConfig.siteName}
          </Heading>
        </Link>
      </Box>

      {/* Desktop Navigation */}
      <Box
        style={{
          display: "none",
          gap: "10px",
          alignItems: "center",
        }}
        className="desktop-nav"
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1A1F26";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            {link.label}
          </Link>
        ))}
        {currentAccount && (
          <Button
            variant="soft"
            size="2"
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

      {/* Mobile Navigation */}
      <Box
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
        className="mobile-nav"
      >
        <ConnectButton />
        <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Dialog.Trigger>
            <IconButton variant="ghost" size="3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </IconButton>
          </Dialog.Trigger>

          <Dialog.Content
            style={{
              maxWidth: "90vw",
              background: "#0B0E11",
              border: "1px solid var(--color-border)",
            }}
          >
            <Dialog.Title>メニュー</Dialog.Title>

            <Flex direction="column" gap="3" mt="4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    padding: "12px 16px",
                    background: "#11151A",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {currentAccount && (
                <Button
                  variant="soft"
                  size="3"
                  onClick={() => {
                    window.open(
                      `https://faucet.sui.io/?address=${currentAccount.address}`,
                      "_blank"
                    );
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                  }}
                >
                  Get Testnet SUI
                </Button>
              )}
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Box>

      <style>
        {`
          @media (min-width: 768px) {
            .desktop-nav {
              display: flex !important;
            }
            .mobile-nav {
              display: none !important;
            }
          }
          @media (max-width: 767px) {
            .desktop-nav {
              display: none !important;
            }
            .mobile-nav {
              display: flex !important;
            }
          }
        `}
      </style>
    </Flex>
  );
}
