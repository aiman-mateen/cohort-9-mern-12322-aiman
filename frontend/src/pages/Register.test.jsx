import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";
import userEvent from "@testing-library/user-event";
describe("Register Page", () => {
  test("renders the registration form", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /create your account/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/full name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password", { exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Confirm password", { exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors when submitting an empty form", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await user.click(
    screen.getByRole("button", { name: /create account/i })
  );

  expect(screen.getByText("Name is required")).toBeInTheDocument();
  expect(screen.getByText("Email is required")).toBeInTheDocument();
  expect(screen.getByText("Password is required")).toBeInTheDocument();
  expect(
    screen.getByText("Please confirm your password")
  ).toBeInTheDocument();
});


test("shows an error for an invalid email", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await user.type(
    screen.getByLabelText("Full name"),
    "Test User"
  );

  await user.type(
    screen.getByLabelText("Email address"),
    "invalid-email"
  );

  await user.type(
    screen.getByLabelText("Password"),
    "password123"
  );

  await user.type(
    screen.getByLabelText("Confirm password", { exact: true }),
    "password123"
  );

  await user.click(
    screen.getByRole("button", { name: /create account/i })
  );

  expect(
    screen.getByText("Enter a valid email address")
  ).toBeInTheDocument();
});

test("shows an error when password is less than 8 characters", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await user.type(
    screen.getByLabelText("Full name"),
    "Test User"
  );

  await user.type(
    screen.getByLabelText("Email address"),
    "test@example.com"
  );

  await user.type(
    screen.getByLabelText("Password"),
    "1234567"
  );

  await user.type(
    screen.getByLabelText("Confirm password", { exact: true }),
    "1234567"
  );

  await user.click(
    screen.getByRole("button", { name: /create account/i })
  );

  expect(
    screen.getByText("Password must be at least 8 characters")
  ).toBeInTheDocument();
});


test("shows an error when passwords do not match", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await user.type(
    screen.getByLabelText("Full name"),
    "Test User"
  );

  await user.type(
    screen.getByLabelText("Email address"),
    "test@example.com"
  );

  await user.type(
    screen.getByLabelText("Password"),
    "password123"
  );

  await user.type(
    screen.getByLabelText("Confirm password", { exact: true }),
    "different123"
  );

  await user.click(
    screen.getByRole("button", { name: /create account/i })
  );

  expect(
    screen.getByText("Passwords do not match")
  ).toBeInTheDocument();
});

test("shows a success message when passwords match", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await user.type(
    screen.getByLabelText("Password"),
    "password123"
  );

  await user.type(
    screen.getByLabelText("Confirm password", { exact: true }),
    "password123"
  );

  expect(
    screen.getByText("Passwords match")
  ).toBeInTheDocument();
});
});

