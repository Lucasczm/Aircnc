import React, { useState } from "react";
import api from "../../services/api";

import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";

export default function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      if (confirmPassword !== password) {
        return setLoginError("As senhas não coincidem");
      }
      setLoading(true);
      const response = await api.post("/users", { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("user", token);
      }
      setLoading(false);

      history.push("/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409)
          setLoginError("E-mail já registrado");
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
        Registre-se para oferecer <strong>spots</strong> para programadores e
        encontre <strong>talentos</strong> para sua empresa
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirme sua senha</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Digite novamente sua senha"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {loginError && (
          <div className="error">
            <span>{loginError}</span>
          </div>
        )}
        <button className="btn">REGISTAR</button>
      </form>
    </>
  );
}
