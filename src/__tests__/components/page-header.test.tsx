import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/shared/PageHeader";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Dashboard" />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Dashboard"
    );
  });

  it("renders title and description", () => {
    render(
      <PageHeader
        title="Log Explorer"
        description="Search and filter your application logs"
      />
    );

    expect(screen.getByText("Log Explorer")).toBeInTheDocument();
    expect(
      screen.getByText("Search and filter your application logs")
    ).toBeInTheDocument();
  });

  it("does not render description paragraph when not provided", () => {
    const { container } = render(<PageHeader title="Settings" />);

    // h1 should be present
    expect(screen.getByText("Settings")).toBeInTheDocument();
    // There should be no <p> tag
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders action buttons when provided", () => {
    render(
      <PageHeader
        title="Projects"
        actions={
          <>
            <button>Create Project</button>
            <button>Import</button>
          </>
        }
      />
    );

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Create Project")).toBeInTheDocument();
    expect(screen.getByText("Import")).toBeInTheDocument();
  });

  it("does not render actions container when actions not provided", () => {
    const { container } = render(<PageHeader title="Overview" />);

    // The container should only have the title section, not actions wrapper
    const titleDiv = container.querySelector(".space-y-1");
    expect(titleDiv).toBeInTheDocument();

    // Verify no actions wrapper is rendered
    // The actions wrapper has shrink-0 class
    const actionsWrapper = container.querySelector(".shrink-0");
    expect(actionsWrapper).toBeNull();
  });

  it("renders a badge next to the title when provided", () => {
    render(
      <PageHeader
        title="Alerts"
        badge={<span data-testid="alert-badge">5 active</span>}
      />
    );

    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByTestId("alert-badge")).toBeInTheDocument();
    expect(screen.getByText("5 active")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PageHeader title="Test" className="my-custom-class" />
    );

    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("my-custom-class");
  });

  it("renders all props together (title + description + actions + badge)", () => {
    render(
      <PageHeader
        title="Performance"
        description="Monitor your application performance metrics"
        badge={<span>Beta</span>}
        actions={<button>Refresh</button>}
      />
    );

    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(
      screen.getByText("Monitor your application performance metrics")
    ).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Refresh")).toBeInTheDocument();
  });

  it("truncates long titles with proper CSS class", () => {
    render(<PageHeader title="A Very Long Dashboard Title That Should Be Truncated" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.className).toContain("truncate");
  });
});
