import {
  createStyles,
  Header,
  Group,
  rem,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

const useStyles = createStyles(() => ({
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
    fontFamily: "'Oxygene', sans-serif",
    fontSize: "1.6rem",
    color: "#2251be",
    textDecoration: "none",
    textShadow: "3px 3px 0 #000",
    letterSpacing: "0.05em",
    flex: 1,
    whiteSpace: "nowrap",
  },

  links: {
    display: "flex",
    gap: "0.4rem",
  },

  spacer: {
    flex: 1,
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(14)}`,
    textDecoration: "none",
    color: "rgba(255,255,255,0.65)",
    fontFamily: "'Pixel Game', sans-serif",
    fontSize: "1rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    border: "3px solid transparent",
    textShadow: "2px 2px 0 #000",
    transition: "all 0.1s",
    whiteSpace: "nowrap",

    "&:hover": {
      color: "#fbd000",
    },
  },

  linkActive: {
    "&, &:hover": {
      color: "#000",
      background: "#ceb123",
      border: "3px solid #000",
      textShadow: "none",
      boxShadow: "0 4px 0 #000",
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
        background: "#1a1a2a",
        borderBottom: "5px solid #000",
        boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className={classes.header}>
        <Link to="/" className={classes.logo}>
          ▲ <span>GAME NIGHT</span>
        </Link>

        <Group spacing={4} className={classes.links}>
          {items}
        </Group>

        <div className={classes.spacer} />
      </div>
    </Header>
  );
}
