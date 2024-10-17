export default {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest"
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // ESM をサポート
  transformIgnorePatterns: [
    "/node_modules/(?!@testing-library)"
  ]
};
