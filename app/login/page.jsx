"use client"
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { signIn } from 'next-auth/react'
import { useRouter, redirect } from 'next/navigation'
import { useSession } from 'next-auth/react';
import Swal from "sweetalert2";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { data: session } = useSession();
  if (session) router.replace('welcome');


  const handleSubmit = async (e) =>{
    e.preventDefault();  
    try {
      const res = await signIn("credentials", {
        email, password, redirect: false
    })

    if (res.error) {
      Swal.fire({
        title: "Error!",
        text: "Invalid credentials",
        icon: "error",
        confirmButtonText: "Cool",
      });
      return; 
    }
    router.replace("welcome");


    } catch (error) {
      console.log(error);
    }
  
  }
  
  
  return (
    <div className='container mx-auto flex flex-col items-center justify-center'>
    <h3 className='text-xl my-6'>Login page</h3>
    <form onSubmit={handleSubmit}  className='flex flex-col w-2/4 space-y-6'> 
        <TextField onChange={(e)=> setEmail(e.target.value)} type='email' id="email" label="Email" variant="outlined" className=''/>
        <TextField onChange={(e)=> setPassword(e.target.value)} type='password' id="password" label="Password" variant="outlined" className=''/>
        <Button type='submit' color="success" variant="contained">Sign in</Button>

    </form>
    <div className='flex flex-col space-y-4 mt-6'>
        <Button
          variant="outlined"
          startIcon={<GitHubIcon />}
          onClick={() => signIn('github')}
          style={{
            color: '#333',
            borderColor: '#333',
            fontWeight: 'bold',
            textTransform: 'none',
          }}
          className='py-2'
        >
          Sign in with GitHub
        </Button>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => signIn('google')}
          style={{
            color: '#DB4437',
            borderColor: '#DB4437',
            fontWeight: 'bold',
            textTransform: 'none',
          }}
          className='py-2'
        >
          Sign in with Google
        </Button>
      </div>
    <div className='my-3'>
    <p>Already have account   <Link className='text-blue-600 hover:underline' href="/register">register page</Link>
    </p>
    </div>
</div>
  )
}
