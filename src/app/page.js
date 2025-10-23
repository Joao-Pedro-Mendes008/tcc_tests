'use client'
import react from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../../models/authModel";
import { useState, useContext, useEffect } from "react";
import "./signIn.css"

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const router = useRouter();

    const handleSubmit = () => {
        signIn(email, password)
    };
    const SignUpNav = () => {
        router.push('/signUp')
    };

    return (
        <div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <input placeholder="Email:" onChange={(e) => { setEmail }} />
                    <input placeholder="Senha:" onChange={(e) => { setPassword }} />
                    <button type="submit">Entrar</button>
                </form>
                <a onClick={SignUpNav}> Cadastrar-se </a>
            </div>
        </div>
    )
}
