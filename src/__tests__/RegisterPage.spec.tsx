import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import "@testing-library/jest-dom";
import React from "react";

// ChakraProvider でラップして Chakra UI コンポーネントをサポートする関数
const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>, { wrapper: MemoryRouter });
};

// useNavigate をモック化
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// supabase のモック化
jest.mock("../supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ error: null })),
    })),
  },
}));

describe("RegisterPage", () => {
  it("IDがないときにエラーメッセージがでる", async () => {
    renderWithChakra(<RegisterPage />);

    const buttonElement = screen.getByRole("button", { name: /登録/i });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      const errorMessage = screen.getByText("IDは必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("名前がないときにエラーメッセージがでる", async () => {
    renderWithChakra(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("ID (英数字のみ)"), { target: { value: "testUser" } });

    const buttonElement = screen.getByRole("button", { name: /登録/i });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      const errorMessage = screen.getByText("名前は必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("紹介文がないときにエラーメッセージがでる", async () => {
    renderWithChakra(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("ID (英数字のみ)"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByPlaceholderText("名前"), { target: { value: "テストユーザー" } });

    const buttonElement = screen.getByRole("button", { name: /登録/i });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      const errorMessage = screen.getByText("自己紹介は必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("全項目入力して登録ボタンを押すと/cards/:idに遷移する", async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    renderWithChakra(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("ID (英数字のみ)"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByPlaceholderText("名前"), { target: { value: "テストユーザー" } });
    fireEvent.change(screen.getByPlaceholderText("自己紹介"), { target: { value: "自己紹介テキスト" } });

    const buttonElement = screen.getByRole("button", { name: /登録/i });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/cards/testUser");
    });
  });

  it("オプションを入力しなくても登録ができる", async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    renderWithChakra(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("ID (英数字のみ)"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByPlaceholderText("名前"), { target: { value: "テストユーザー" } });
    fireEvent.change(screen.getByPlaceholderText("自己紹介"), { target: { value: "自己紹介テキスト" } });

    const buttonElement = screen.getByRole("button", { name: /登録/i });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/cards/testUser");
    });
  });
});
