import React, { useState, useMemo } from 'react';
import api from '../../services/api';

import camera from '../../assets/camera.svg';
import './styles.css';

import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

export default function New({ history }) {
  const [isLoading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [company, setCompany] = useState('');
  const [techs, setTechs] = useState('');
  const [price, setPrice] = useState('');

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('user');
    const data = new FormData();
    data.append('thumbnail', thumbnail);
    data.append('company', company);
    data.append('techs', techs);
    data.append('price', price);

    await api.post('/spots', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    history.push('/dashboard');
  }

  return (
    <>
      <Modal show={isLoading}>
        <Spinner />
      </Modal>
      <form onSubmit={handleSubmit}>
        <label
          id="thumbnail"
          style={{ backgroundImage: `url(${preview})` }}
          className={thumbnail ? 'has-thumbnail' : ''}
        >
          <input type="file" onChange={e => setThumbnail(e.target.files[0])} />
          <img src={camera} alt="Select img" />
        </label>

        <label htmlFor="company">Empresa *</label>
        <input
          id="company"
          placeholder="Sua empresa"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />

        <label htmlFor="techs">
          Tecnologias * <span>(separadas por vígula)</span>
        </label>
        <input
          id="techs"
          placeholder="Quais tecnologias utilizam?"
          value={techs}
          onChange={e => setTechs(e.target.value)}
        />

        <label htmlFor="price">Valor da díaria</label>
        <input
          id="price"
          placeholder="Deixe vazio caso gratuito"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <button type="submit" className="btn">
          CADASTRAR
        </button>
      </form>
    </>
  );
}
