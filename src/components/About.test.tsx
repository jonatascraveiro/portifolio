import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";
import { profile } from "@/data/profile";

describe("About", () => {
  it("should render the profile name, title and bio", () => {
    render(<About />);

    expect(screen.getByText(`${profile.name} — ${profile.title}`)).toBeInTheDocument();
    expect(screen.getByText(profile.bio)).toBeInTheDocument();
  });
});
