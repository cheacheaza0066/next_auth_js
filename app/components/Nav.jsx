"use client"

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import Swal from 'sweetalert2';

export default function Nav() {
    const { data: session, status } = useSession();
    const textStyle = {
        heading: "Ubuntu, sans-serif",
        sans: "Cabin, sans-serif",
        monospace: "Fira Code, monospace",
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                signOut();
            }
        });
    };

    return (
        <nav className='bg-slate-950 text-white p-5'>
            <div className="container mx-auto">
                <div className='flex justify-between items-center'>
                    <div>
                        <Link href="/">Home</Link>
                    </div>
                    <ul className='flex'>
                        {status === "authenticated" ? (
                            <>
                                <li className='mx-3 bg-red-500 px-3 cursor-pointer'>
                                    <a onClick={handleLogout}>Logout</a>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className='mx-3'>
                                    <Link href="/login">Sign In</Link>
                                </li>
                                <li className='mx-3'>
                                    <Link href="/register">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
