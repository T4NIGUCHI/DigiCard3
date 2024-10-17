import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
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

describe("HomePage", () => {
  it("タイトルが表示されている", () => {
    renderWithChakra(<HomePage />);
    const titleElement = screen.getByText("IDを入力してください");
    expect(titleElement).toBeInTheDocument();
  });

  it("IDを入力するフォームが表示されている", () => {
    renderWithChakra(<HomePage />);
    const inputElement = screen.getByPlaceholderText("ID");
    expect(inputElement).toBeInTheDocument();
  });

  it("ID未入力で「名刺を見る」ボタンをクリックするとエラーメッセージが表示される", () => {
    renderWithChakra(<HomePage />);
    const buttonElement = screen.getByRole("button", { name: /名刺を見る/i });
    fireEvent.click(buttonElement);
    const errorMessages = screen.getAllByText("IDを入力してください");
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it("IDを入力後「名刺を見る」ボタンをクリックすると正しいURLに遷移する", () => {
    // useNavigate のモック関数を取得
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    renderWithChakra(<HomePage />);
    const inputElement = screen.getByPlaceholderText("ID");
    fireEvent.change(inputElement, { target: { value: "sampleUser" } });
    const buttonElement = screen.getByRole("button", { name: /名刺を見る/i });
    fireEvent.click(buttonElement);

    expect(mockNavigate).toHaveBeenCalledWith("/cards/sampleUser");
  });

  it("「新規登録はこちら」をクリックすると/cards/registerに遷移する", () => {
    // useNavigate のモック関数を取得
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    renderWithChakra(<HomePage />);
    const registerLink = screen.getByText("新規登録はこちら");
    fireEvent.click(registerLink);

    // モックしたリンクの href 属性をチェック
    expect(registerLink).toHaveAttribute("href", "/cards/register");
  });
});
