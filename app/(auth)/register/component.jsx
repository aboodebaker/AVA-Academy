"use client";
import React, { useState } from "react";
import "./page.css";
import './style.css'
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = (schools) => {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState('Create')

  const router = useRouter();
  console.log(schools)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const grade = e.target[3].value;
    const classes = e.target[4].value;
    const role = e.target[5].value;
    const school = e.target[6].value;

    try {
      setSubmitting('Creating')
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          grade,
          classes,
          role,
          school,
        }),
      });

      const body = await res.json()
      res.status === 200 && signIn("credentials", {
      email,
      password,
    });
      res.status === !200 && setError(body.error)
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  return (
    <>
    <div className="dives min-h-dvh">
            <form onSubmit={handleSubmit} className="form">
              <div className="inputgroup">
                <input required type="text" name="text" autocomplete="off" class="input"/>
                <label class="userlabel">Name*</label>
              </div>
              <div className="input-groups">
                <input required type="text" name="password" autocomplete="off" class="inputs"/>
                <label class="user-labels">Email*</label>
              </div>
              <div className="inpugroup">
                <input required type="password" name="password" autocomplete="off" class="inpu"/>
                <label class="user-labe">Password*</label>
              </div>
              
              <div className="selection">
              <label htmlFor="gradeSelector" className="text">Select your Grade:</label>
              <select id="gradeSelector">
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
              </select>
            </div>

            <div className="selection">
              <label htmlFor="classSelector" className="text">Select your class:</label>
              <select id="classSelector">
                <option value={null}>none</option>
                <option value="A">Class A</option>
                <option value="B">Class B</option>
                <option value="C">Class C</option>
                <option value="D">Class D</option>
              </select>
            </div>

            <div className="selection">
              <label htmlFor="roleSelector" className="text">Select your Role:</label>
              <select id="roleSelector">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>

            <div className="selection">
              <label htmlFor="schoolSelector" className="text">Select your School:</label>
              <select id="schoolSelector" name="school">
                <option value={null}>none</option>
                {schools.schools.map((school) => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>


              <button className="button">{submitting}</button>
              {error && error}
            </form>
            <span className="or">- OR - </span>
            <Link className="link" href="/login">
              LOGIN
            </Link>
            </div>
            </>
  );
};

export default Register;