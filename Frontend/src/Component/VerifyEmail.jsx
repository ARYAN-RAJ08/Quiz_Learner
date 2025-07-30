import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided.");
            return;
        }
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/verify-email?token=${token}`)
            .then(res => {
                setStatus("success");
                setMessage(res.data.message || "Email verified successfully!");
            })
            .catch(err => {
                setStatus("error");
                setMessage(
                    err.response?.data?.message || "Verification failed. The link may be invalid or expired."
                );
            });
    }, [searchParams]);

    return (
        <div style={{ padding: 40, textAlign: "center" }}>
            {status === "pending" && <h2>Verifying your email...</h2>}
            {status === "success" && (
                <>
                    <h2 style={{ color: "green" }}>Success!</h2>
                    <p>{message}</p>
                    <Link to="/login">Go to Login</Link>
                </>
            )}
            {status === "error" && (
                <>
                    <h2 style={{ color: "red" }}>Verification Failed</h2>
                    <p>{message}</p>
                    <Link to="/signup">Sign Up</Link>
                </>
            )}
        </div>
    );
} 