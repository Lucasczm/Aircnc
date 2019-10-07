import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";

export default function Login({ match }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const { token } = match.params;
    if (confirmPassword !== password) {
      return setError("As senhas não coincidem");
    }
    setIsLoading(true);
    try {
      await api.put("/recover", {
        token: token,
        password
      });
      setSuccess(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.status === 401)
          setError("O token para recuperação de senha expirou ou é inválido");
        else setError("Um erro ocorreu, tente novamente!");
      }
    }
    setIsLoading(false);
  }

  return (
    <>
      <Modal show={isLoading}>
        <Spinner />
      </Modal>
      <p>Recuperação de senha</p>
      <form onSubmit={handleSubmit} disabled={success}>
        <label htmlFor="password">Sua nova senha</label>
        <input
          type="password"
          id="password"
          placeholder="Digite sua nova senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={success}
        />
        <label htmlFor="confirmPassword">Confirme sua nova senha</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Digite novamente sua nova senha"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          disabled={success}
        />
        {(success || error) && (
          <div className={`error ${success ? "success" : ""}`}>
            <span>
              {success
                ? "Sua senha foi alterada com sucesso, agora faça o login!"
                : error}
            </span>
          </div>
        )}
        {!success && <button className="btn">ALTERAR SENHA</button>}
      </form>
      {success && (
        <Link to="/login">
          <button className="btn">ENTRAR</button>
        </Link>
      )}
    </>
  );
}
