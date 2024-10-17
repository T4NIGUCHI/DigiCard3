import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CardPage from "../pages/CardPage";
import { supabase } from "../supabase";

jest.mock("../supabase");

describe("CardPage", () => {
  const mockUserData = {
    name: "テストユーザー",
    description: "これはテストユーザーの自己紹介です",
    github_id: "test-github",
    qiita_id: "test-qiita",
    x_id: "test-x",
  };

  beforeEach(() => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockUserData, error: null }),
    });
  });

  test("名前が表示されている", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/cards/test-id"]}>
          <Routes>
            <Route path="/cards/:id" element={<CardPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const nameElement = await screen.findByTestId("user-name");
    expect(nameElement).toHaveTextContent("テストユーザー");
  });

  test("自己紹介が表示されている", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/cards/test-id"]}>
          <Routes>
            <Route path="/cards/:id" element={<CardPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const descriptionElement = await screen.findByText("これはテストユーザーの自己紹介です");
    expect(descriptionElement).toBeInTheDocument();
  });

  test("技術が表示されている", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/cards/test-id"]}>
          <Routes>
            <Route path="/cards/:id" element={<CardPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Skills:")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Qiita")).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  test("戻るボタンをクリックすると/に遷移する", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/cards/test-id"]}>
          <Routes>
            <Route path="/cards/:id" element={<CardPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const backButton = screen.getByRole("button", { name: /戻る/ });
    fireEvent.click(backButton);
    expect(window.location.pathname).toBe("/");
  });
});
