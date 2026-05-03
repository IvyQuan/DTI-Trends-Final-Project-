import {
  createStyles,
  Header,
  Container,
  Group,
  rem,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    padding: `0 ${rem(24)}`,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: "'Slackey', cursive",
    fontSize: "1.1rem",
    color: "#00d4ff",
    textDecoration: "none",
    textShadow: "0 0 12px rgba(0, 212, 255, 0.8)",
    letterSpacing: "0.02em",
    flex: 1,
    whiteSpace: "nowrap",
  },

  links: {
    display: "flex",
    gap: "0.25rem",
  },

  spacer: {
    flex: 1,
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(18)}`,
    borderRadius: "2rem",
    textDecoration: "none",
    color: "rgba(255,255,255,0.55)",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    transition: "color 0.2s, text-shadow 0.2s, background 0.2s",
    whiteSpace: "nowrap",

    "&:hover": {
      color: "#fff",
      background: "rgba(255,255,255,0.07)",
    },
  },

  linkActive: {
    "&, &:hover": {
      color: "#00d4ff",
      background: "rgba(0, 212, 255, 0.10)",
      textShadow: "0 0 10px #00d4ffe6, 0 0 24px rgba(0, 212, 255, 0.4)",
    },
  },
}));

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
  const { classes, cx } = useStyles();
  const location = useLocation();

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: location.pathname === link.link,
      })}
    >
      {link.label}
    </Link>
  ));

  return (
    <Header
      height={60}
      style={{
        background: "rgba(8, 8, 20, 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0, 212, 255, 0.15)",
        boxShadow: "0 1px 24px rgba(0, 212, 255, 0.08)",
      }}
    >
      <div className={classes.header}>
        {/* Left: logo — flex:1 pushes nav to true center */}
        <Link to="/" className={classes.logo}>
          🎮 <span>GAME NIGHT</span>
        </Link>

        {/* Center: nav */}
        <Group spacing={4} className={classes.links}>
          {items}
        </Group>

        {/* Right: equal spacer to balance logo */}
        <div className={classes.spacer} />
      </div>
    </Header>
  );
}
