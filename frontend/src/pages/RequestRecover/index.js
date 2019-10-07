import React, { useState } from 'react';
import api from '../../services/api';

import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

export default function RequestRecover() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/recover', {
        email
      });
      setSuccess(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.status === 404) setError('E-mail não cadastrado');
        else setError('Um erro ocorreu, tente novamente!');
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {(success || error) && (
          <div className={`error ${success ? 'success' : ''}`}>
            <span>
              {success
                ? 'Foi enviado um e-mail com os passos da recuperação de senha. Verifique também no seu span :D'
                : error}
            </span>
          </div>
        )}
        {!success && (<button className="btn">CONTINUAR</button>)}
      </form>
    </>
  );
}
