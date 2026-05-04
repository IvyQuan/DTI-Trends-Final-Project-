import { Header } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

const C = {
  red: "#e52521", yellow: "#fbd000", blue: "#049cd8",
  green: "#43b047", black: "#000", cream: "#fff8e7",
};

const COLORS = [C.red, C.yellow, C.blue, C.green];

const outline = (size: number) => {
  const o: string[] = [];
  for (let x = -size; x <= size; x++)
    for (let y = -size; y <= size; y++)
      if (x || y) o.push(`${x}px ${y}px 0 ${C.black}`);
  return o.join(", ");
};

const Logo = () => (
  <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
    <span style={{ display: "inline-block" }}>
      {"GAME NIGHT".split("").map((ch, i) => (
        <span key={i} style={{
          display: "inline-block",
          color: ch === " " ? "transparent" : COLORS[i % 4],
          textShadow: ch === " " ? "none" : outline(2),
          fontSize: "1.2rem",
          fontFamily: "'Pixel Game', sans-serif",
          transform: ch === " " ? "none" : `translateY(${i % 2 === 0 ? -2 : 2}px)`,
          padding: "0 0.03em",
          letterSpacing: "0.02em",
        }}>{ch === " " ? "\u00A0" : ch}</span>
      ))}
    </span>
  </Link>
);

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
  const location = useLocation();

  return (
    <Header
      height={64}
      style={{
        background: C.blue,
        borderBottom: `5px solid ${C.black}`,
        boxShadow: `0 5px 0 ${C.black}`,
        zIndex: 100,
      }}
    >
      <div style={{
        display: "flex", alignItems: "center",
        height: "100%", padding: "0 1.5rem",
      }}>
        {/* Logo left */}
        <div style={{ flex: 1 }}>
          <Logo />
        </div>

        {/* Nav centered */}
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {links.map((link) => {
            const active = location.pathname === link.link;
            return (
              <Link key={link.label} to={link.link} style={{
                fontFamily: "'Pixel Game', sans-serif",
                fontSize: "1rem", letterSpacing: "0.06em",
                textDecoration: "none",
                padding: "0.45rem 1rem",
                color: active ? C.blue : C.cream,
                background: active ? C.yellow : "transparent",
                border: `3px solid ${active ? C.black : "transparent"}`,
                boxShadow: active ? `0 4px 0 ${C.black}` : "none",
                textShadow: `2px 2px 0 ${active ? C.black : "rgba(0,0,0,0.4)"}`,
                transition: "background 0.1s, color 0.1s",
                whiteSpace: "nowrap",
              }}>
                {link.label.toUpperCase()}
              </Link>
            );
          })}
        </div>

        {/* Right spacer */}
        <div style={{ flex: 1 }} />
      </div>
    </Header>
  );
}
