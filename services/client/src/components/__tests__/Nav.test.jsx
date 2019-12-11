import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Nav from "./../Nav";

afterEach(cleanup);

const title = "Hello world!";

it("renders a title", () => {
  const { getByText } = renderWithRouter(<Nav title={title} />);
  expect(getByText(title)).toHaveClass("nav-title");
});

it("renders", () => {
  const { asFragment } = renderWithRouter(<Nav title={title} />);
  expect(asFragment()).toMatchSnapshot();
});
