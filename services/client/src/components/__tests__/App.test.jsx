import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import App from "./../../App";

afterEach(cleanup);

// xit("renders the app", () => {
//   const { getByText } = render(<App />);
//   expect(getByText("Wakemaps Users")).toHaveClass("title");
// });

it("renders", async () => {
  const { asFragment } = renderWithRouter(<App />);
  expect(asFragment()).toMatchSnapshot();
});
