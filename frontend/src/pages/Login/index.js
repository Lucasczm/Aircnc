import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";

export default function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      const response = await api.post("/sessions", { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("user", token);
      } else {
        setLoginError(true);
      }
      setLoading(false);

      history.push("/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) setLoginError(true);
      }
      setLoading(false);
    }
  }

  return (
    <>
      <Modal show={isLoading}>
        <Spinner />
      </Modal>
      <p>
        Ofereça <strong>spots</strong> para programadores e encontre{" "}
        <strong>talentos</strong> para sua empresa
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label className="subLink">
          <Link to="/recover">
            <span>Esqueceu a senha?</span>
          </Link>
        </label>
        {loginError && (
          <div className="error">
            <span>E-mail ou senha são inválidos</span>
          </div>
        )}
        <button className="btn">Entrar</button>
        <label style={{ textAlign: "center", marginTop: "10px" }}>
          <Link to="/register">
            <span>Criar uma conta</span>
          </Link>
        </label>
      </form>
    </>
  );
}
