'use client'
import { signIn } from "../../api/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./signIn.css"

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const result = await signIn(email, password);
      console.log("Resultado login:", result);

      if (!result || result.error || !result.user) {
        setErrorMessage("Email ou senha incorretos");
        return;
      }

      router.push("/userDefault");
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErrorMessage("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="primaryText">Bem vindo!</div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
      <h3>
        Não possui cadastro? <Link href="/signUp">Cadastrar-se</Link>
      </h3>
      <h3>
        Não possui cadastro do consultório? <br />
        <Link href="/consulSignUp">Cadastro do Consultório</Link>
      </h3>
    </div>
  )
}
