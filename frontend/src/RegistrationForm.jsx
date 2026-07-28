import { Alert, Box, Container, FormControl, FormHelperText, Input, InputLabel, Button, CircularProgress } from "@mui/material";
import { useState } from "react";

export const RegistrationForm = (props) => {

    const { closeForm } = props;
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const signup = async (e) => {
        e.preventDefault();
        setError("");

        const jsonSignup = {};
        jsonSignup["name"] = name;
        jsonSignup["username"] = username;
        // TODO: still sending password in plain text, FIX!!!
        jsonSignup["password"] = password;

        setSubmitting(true);
        try {
            const resp = await fetch("/api/user/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonSignup),
            });

            // Try to parse a JSON body even on error responses, since the
            // backend may include a helpful message in ServiceResponse.
            let data = {};
            try {
                data = await resp.json();
            } catch (parseErr) {
                // response had no JSON body - that's fine, fall through
            }

            if (!resp.ok) {
                throw new Error(data.message || `Signup failed (status ${resp.status})`);
            }

            console.log("User created successfully:", data);
            closeForm(false);
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.message || "Something went wrong while creating your account. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <form onSubmit={signup} id="signupForm" style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <FormControl>
                    <InputLabel htmlFor="name"> Name </InputLabel>
                    <Input autoFocus={true} id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <FormHelperText id="nameText">Please enter your full name</FormHelperText>
                </FormControl>
                <FormControl sx={{ marginTop: 2 }}>
                    <InputLabel htmlFor="email"> Email </InputLabel>
                    <Input id="username" value={username}
                        type="email"
                        onChange={(e) => setUsername(e.target.value)} />
                    <FormHelperText id="usernameText">Your username should be your email address</FormHelperText>
                </FormControl>
                <FormControl sx={{ marginTop: 2 }}>
                    <InputLabel htmlFor="password"> Password </InputLabel>
                    <Input id="password"
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value)} />
                    <FormHelperText id="passwordText">Please choose a strong password</FormHelperText>
                </FormControl>

                {error && (
                    <Alert severity="error" sx={{ marginTop: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box gap={2} sx={{
                    display: "flex",
                    margin: "auto",
                    marginTop: 2
                }}>
                    <Button size="small"
                        variant="contained"
                        type="submit"
                        disabled={submitting}>
                        {submitting ? <CircularProgress size={20} /> : "Create Account"}
                    </Button>
                    <Button size="small"
                        variant="contained"
                        onClick={closeForm}
                        disabled={submitting}>
                        Cancel & Go Back
                    </Button>
                </Box>
            </form>
        </Container>
    );
}
