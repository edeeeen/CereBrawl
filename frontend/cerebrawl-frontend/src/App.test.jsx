import { vi, expect, test, afterEach } from 'vitest';
import { render, screen, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom';
import { userEvent } from '@testing-library/user-event'
import App from './App';



test("Website Home screen renders", () => {
    const user = userEvent.setup();

    render(
        <App/>
    );

    user.click(screen.getByRole('button', {name:/Play!/i}));

    expect(
        screen.getByText(/What is/i)
    ).toBeInTheDocument();
});

test("Can navigate to PreBattle screen", async () => {
    const user = userEvent.setup();

    render(
        <App/>
    );

    await user.click(screen.getByRole('button', {name:/Play!/i}));

    expect(
        screen.getByPlaceholderText(/Enter Topic/i)
    ).toBeInTheDocument();

});

test("Can start a battle", async () => {
    const user = userEvent.setup();

    render(
        <App/>
    );

    await user.click(screen.getByRole('button', {name:/Play!/i}));
    await user.click(screen.getByPlaceholderText(/Enter Topic/i))
    await user.type(screen.getByPlaceholderText(/Enter Topic/i), 'biology');

    expect(
        screen.getByText(/Start Battle/i)
    ).toBeEnabled()

});

afterEach(() => {
    cleanup();
});