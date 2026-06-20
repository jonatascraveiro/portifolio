import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "./Contact";
import { profile } from "@/data/profile";

describe("Contact", () => {
  it("renders links to email, GitHub and LinkedIn", () => {
    render(<Contact />);

    expect(screen.getByRole("link", { name: profile.links.email })).toHaveAttribute(
      "href",
      `mailto:${profile.links.email}`
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      profile.links.github
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      profile.links.linkedin
    );
  });
});
