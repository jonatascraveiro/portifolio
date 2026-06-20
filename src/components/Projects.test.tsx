import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Projects from "./Projects";
import { profile } from "@/data/profile";

describe("Projects", () => {
  it("renders one card per project with name, description and stack", () => {
    render(<Projects />);

    expect(screen.getAllByRole("article")).toHaveLength(profile.projects.length);

    for (const project of profile.projects) {
      expect(screen.getByText(project.name)).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
      for (const tech of project.stack) {
        expect(screen.getAllByText(tech).length).toBeGreaterThan(0);
      }
    }
  });
});
