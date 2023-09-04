"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import './style.css'
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const Login = ({ url: String }) => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState('Login')

  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]);

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "authenticated") {
    router?.push("/");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    setSubmitting('Logging In')

    signIn("credentials", {
      email,
      password,
    });
  };

  return (
<>
<div className="dives">
        <form onSubmit={handleSubmit} className="form">
          <div className="inputgroup">
            <input required type="text" name="text" autocomplete="off" class="input"/>
            <label class="userlabel">Email*</label>
          </div>
          <div className="input-group">
            <input required type="password" name="password" autocomplete="off" class="inputs"/>
            <label class="user-label">Password*</label>
          </div>
          <button className="button">{submitting}</button>
          {error && error}
        </form>
        <span className="or">- OR -</span>
        <Link className="link" href="/register">
          Create new account
        </Link>
        </div>
        </>
  );
};

export default Login;
