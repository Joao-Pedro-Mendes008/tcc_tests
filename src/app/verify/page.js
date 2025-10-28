'use client'

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../signIn.css"
import supabase from "../../../connection";


export default function EmailVerification() {
    const router = useRouter();
    const handleClick = (e) => {
        e.preventDefault();
        router.push('/')
    }

    return (
        <div>
            <div className="container">
                <h1>Verifque seu email.</h1>
                <h3>Foi enviado um email de verificação na sua caixa de entrada.</h3>
                <button onClick={handleClick}>Voltar</button>
            </div>
        </div>
    )
}