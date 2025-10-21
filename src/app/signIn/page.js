import { useState, useContext, useEffect } from "react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const handleSubmit = () => {
        
    }
    return (
        <div>
            <div>
                <form onSubmit={''}>
                    <input placeholder="Email:" onChange={(e) => {setEmail}}/>
                    <input placeholder="Senha:" onChange={(e) => {setPassword}}/>
                </form>
            </div>
        </div>
    )
}