import React from "react";
import { render, cleanup, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";

import UserStatus from "./../UserStatus.jsx";

afterEach(cleanup);

jest.mock("axios");

it("renders properly when authenticated", async () => {
  axios.mockImplementationOnce(() => {
    return Promise.resolve({
      data: {
        id: 1,
        email: "test@test.com",
        username: "test"
      }
    });
  });

  const { container, findByTestId } = render(<UserStatus />);

  await wait(() => {
    expect(axios).toHaveBeenCalledTimes(1);
  });

  expect((await findByTestId("user-id")).innerHTML).toBe("1");
  expect((await findByTestId("user-email")).innerHTML).toBe("test@test.com");
  expect((await findByTestId("user-username")).innerHTML).toBe("test");
});

it("renders", async () => {
  const { asFragment } = render(<UserStatus />);
  await wait(() => {
    expect(axios).toHaveBeenCalled();
  });

  expect(asFragment()).toMatchSnapshot();
});
