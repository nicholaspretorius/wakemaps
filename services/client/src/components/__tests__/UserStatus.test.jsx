import React from "react";
import { render, cleanup, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";

import UserStatus from "./../UserStatus.jsx";

afterEach(cleanup);

jest.mock("axios");

const props = {
  isAuthenticated: () => {
    return true;
  }
};

axios.mockImplementation(() =>
  Promise.resolve({
    data: { data: { email: "test@test.com", id: 1, username: "test" } }
  })
);

it("renders properly when authenticated", async () => {
  const { container, findByTestId } = renderWithRouter(<UserStatus {...props} />);

  await wait(() => {
    expect(axios).toHaveBeenCalledTimes(1);
  });

  expect((await findByTestId("user-id")).innerHTML).toBe("1");
  expect((await findByTestId("user-email")).innerHTML).toBe("test@test.com");
  expect((await findByTestId("user-username")).innerHTML).toBe("test");
});

it("renders", async () => {
  const { asFragment } = renderWithRouter(<UserStatus {...props} />);
  await wait(() => {
    expect(axios).toHaveBeenCalled();
  });

  expect(asFragment()).toMatchSnapshot();
});
