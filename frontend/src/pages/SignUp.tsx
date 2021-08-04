import React, { FormEvent } from "react";
import { Button, Container, Typography, TextField, Stack } from "@material-ui/core";

export function SignUpPage() {
    function signUp(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        ev.stopPropagation();
        const emailNode = ev.currentTarget.querySelector("#user-email-input") as HTMLInputElement;
        const passwordNode = ev.currentTarget.querySelector(
            "#user-password-input",
        ) as HTMLInputElement;
        const email = emailNode.value;
        const password = passwordNode.value;
        console.log({ email, password });
        throw new Error("todo");
    }
    return (
        <Container maxWidth="xs">
            <Typography variant="h6" sx={{ mb: 2 }}>
                Sign up
            </Typography>
            <form onSubmit={signUp}>
                <Stack>
                    <TextField
                        required
                        label="Email"
                        id="user-email-input"
                        autoComplete="current-email"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        label="Password"
                        id="user-password-input"
                        type="password"
                        autoComplete="current-password"
                        sx={{ mb: 3 }}
                    />
                    <Button variant="contained" type="submit" sx={{ mb: 2 }}>
                        Sign up
                    </Button>
                </Stack>
            </form>
        </Container>
    );
}
