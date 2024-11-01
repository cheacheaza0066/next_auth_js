/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from 'react'
import { Button ,TextField } from '@mui/material';
import Swal from "sweetalert2";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


export default function Register() {
    const [name,setName] = useState("");
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {data:session} = useSession();
  if(session) redirect("/welcome");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "Passwords do not match",
        icon: "error",
        confirmButtonText: "Cool",
      });
      return; 
    }

    if (!name || !email || !password || !confirmPassword) {
      Swal.fire("Please fill in all fields!");
      return; 
    }
    

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to register");
      }
      
      // Only reset the form if registration is successful
      e.target.reset(); // Move this line inside the success block.

      Swal.fire({
        title: "Success!",
        text: "User registered successfully.",
        icon: "success",
        confirmButtonText: "Cool",
      });

    } catch (error) {
      console.error("Error during register:", error.message); // Log the actual error
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className='container mx-auto flex flex-col items-center justify-center'>
      <h3 className='text-xl my-6'>Register Page</h3>
      <form onSubmit={handleSubmit} action="" className='flex flex-col w-2/4 space-y-4'>
      <TextField
          onChange={(e) => setName(e.target.value)}
          id="name"
          label="Name"
          variant="outlined"
          className=""
        />
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          type='email'
          id="email"
          label="Email"
          variant="outlined"
          className=""
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          id="password"
          label="Password"
          variant="outlined"
          className=""
        />
        <TextField
          onChange={(e) => setConfirmPassword(e.target.value)}
          type='password'

          id="confirm-password"
          label="Confirm-password"
          variant="outlined"
          className=""
        />
        <Button type="submit" color="success" variant="contained">
          Sign up
        </Button>
      </form>
    </div>
  )
}
