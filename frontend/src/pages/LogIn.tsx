import React, { FormEvent } from "react";
import { Button, Container, Divider, Typography, TextField, Stack } from "@material-ui/core";
import { Link } from "../components";

export function LogInPage() {
    function loginGoogle() {
        throw new Error("todo");
    }
    function loginBnet() {
        throw new Error("todo");
    }
    function loginWithPassword(ev: FormEvent<HTMLFormElement>) {
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
                Log In
            </Typography>
            <Stack>
                <Button variant="outlined" onClick={loginGoogle} sx={{ mb: 1 }}>
                    {/* todo: Insert Google icon here */}
                    google
                </Button>
                <Button variant="outlined" onClick={loginBnet}>
                    {/* todo: Insert Bnet icon here */}
                    battle.net
                </Button>
            </Stack>
            <Divider sx={{ my: 2 }}> OR </Divider>
            <form onSubmit={loginWithPassword}>
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
                        Log In
                    </Button>
                    <Typography>
                        Forgot your <Link to="/password-recovery">password</Link>?
                    </Typography>
                </Stack>
            </form>
        </Container>
    );
}
