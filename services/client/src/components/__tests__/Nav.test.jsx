import React from "react";
import { cleanup, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Nav from "./../Nav";

afterEach(cleanup);

describe("when not authenticated", () => {
  const props = {
    title: "Hello world!",
    logout: () => {
      return true;
    },
    isAuthenticated: jest.fn().mockImplementation(() => false)
  };

  it("renders the default props", async () => {
    const { getByText, findByTestId } = renderWithRouter(<Nav {...props} />);
    expect(getByText(props.title)).toHaveClass("nav-title");

    await wait(() => {
      expect(props.isAuthenticated).toHaveBeenCalledTimes(1);
    });

    expect((await findByTestId("nav-about")).innerHTML).toBe("About");
    expect((await findByTestId("nav-register")).innerHTML).toBe("Register");
    expect((await findByTestId("nav-login")).innerHTML).toBe("Login");
  });

  it("renders", () => {
    const { asFragment } = renderWithRouter(<Nav {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("when authenticated", () => {
  const props = {
    title: "Hello, World!",
    logout: () => {
      return true;
    },
    isAuthenticated: jest.fn().mockImplementation(() => true)
  };

  it("renders the default props", async () => {
    const { getByText, findByTestId } = renderWithRouter(<Nav {...props} />);
    expect(getByText(props.title)).toHaveClass("nav-title");
    await wait(() => {
      expect(props.isAuthenticated).toHaveBeenCalledTimes(1);
    });
    expect((await findByTestId("nav-about")).innerHTML).toBe("About");
    expect((await findByTestId("nav-status")).innerHTML).toBe("User Status");
    expect((await findByTestId("nav-logout")).innerHTML).toBe("Logout");
  });

  it("renders", () => {
    const { asFragment } = renderWithRouter(<Nav {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
