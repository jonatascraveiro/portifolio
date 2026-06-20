import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders navigation links to all three sections", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("href", "#sobre");
    expect(screen.getByRole("link", { name: "Projetos" })).toHaveAttribute("href", "#projetos");
    expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute("href", "#contato");
  });
});
