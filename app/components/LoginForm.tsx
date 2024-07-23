"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import Spinner from "./Spinner";
import { login } from "../lib/actions";

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(login, undefined);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  return (
    <form action={dispatch} className='p-6 bg-white shadow-md rounded-lg'>
      <div className='mb-4'>
        <label htmlFor='email' className='sr-only'>
          email
        </label>
        <input
          ref={emailRef}
          type='email'
          name='email'
          placeholder='Email'
          required
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='password' className='sr-only'>
          password
        </label>
        <input
          type='password'
          name='password'
          placeholder='Password'
          required
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      <div className='mb-4'>
        {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
      </div>
      <LoginButton />

      <div className='text-sm text-center mt-8'>
        Not registered yet?{" "}
        <Link href={"/signup"} className='underline text-blue-500'>
          Signup here
        </Link>{" "}
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  const handleClick = (event: any) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <button
      aria-disabled={pending}
      type='submit'
      onClick={handleClick}
      className={`w-full px-4 py-2 font-semibold text-white rounded-md transition-colors ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {pending ? <Spinner size={5} /> : "Login"}
    </button>
  );
}
