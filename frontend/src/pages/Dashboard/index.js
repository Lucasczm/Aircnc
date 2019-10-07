import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';

import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

import './styles.css';

export default function Dashboard({ history }) {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingApproved, setLoadingApproved] = useState(true);
  const [modal, setModal] = useState(false);
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showBookingApproved, setShowBookingApproved] = useState(false);
  const [bookingApproved, setBookingApproved] = useState([]);

  const token = localStorage.getItem('user');
  const socket = useMemo(
    () =>
      socketio(api.defaults.baseURL, {
        query: { token }
      }),
    [token]
  );

  useEffect(() => {
    async function loadRequests() {
      const token = localStorage.getItem('user');
      const response = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    }
    loadRequests();
    socket.on('booking_request', data => {
      setRequests([...requests, data]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadSpots() {
      const token = localStorage.getItem('user');
      try {
        const response = await api.get('/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSpots(response.data);
      } catch (error) {
        if (error.response) {
          if (error.response) {
            if (error.response.status === 401) history.push('/');
          }
        }
      }
      setLoading(false);
    }
    loadSpots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAccept(id) {
    setModal(true);
    await api.post(`bookings/${id}/approvals`);
    setRequests(requests.filter(request => request._id !== id));
    setModal(false);
  }

  async function handleReject(id) {
    setModal(true);
    await api.post(`bookings/${id}/rejections`);
    setRequests(requests.filter(request => request._id !== id));
    setModal(false);
  }

  async function hadleShowBookings() {
    setShowBookingApproved(!showBookingApproved);
    if (!showBookingApproved) {
      setLoadingApproved(true);
      const response = await api.get('/bookings/approvals');
      setLoadingApproved(false);
      setBookingApproved(response.data);
    }
  }
  return (
    <>
      <Modal show={modal}>
        <Spinner />
      </Modal>
      <Modal show={showBookingApproved}>
        {isLoadingApproved && <Spinner />}
        {!isLoadingApproved && (
          <>
            <div class="scroll-y">
              <ul className="spot-list-vertical">
                {bookingApproved.map(item => (
                  <li key={item._id}>
                    <div class="spot-item">
                      <header
                        style={{
                          backgroundImage: `url(${item.spot.thumbnail})`
                        }}
                      />
                    </div>
                    <div>
                      <p>
                        <strong>{item.spot.company}</strong>
                      </p>
                      <span>
                        Reservado no dia <strong>{item.date}</strong>
                        <br />
                      </span>
                      <span>
                        Por <strong>{item.user.email}</strong>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="btn"
              onClick={hadleShowBookings}
              style={{ marginTop: 10 }}
            >
              VOLTAR
            </button>
          </>
        )}
      </Modal>
      <ul className="notifications">
        {requests.map(request => (
          <li key={request._id}>
            <div>
              <strong>{request.user.email}</strong> está solicitando uma reserva
              em
              <strong> {request.spot.company}</strong> para a data:
              <strong> {request.date}</strong>
            </div>
            <div>
              <button
                className="accept"
                onClick={() => handleAccept(request._id)}
              >
                ACEITAR
              </button>
              <button
                className="reject"
                onClick={() => handleReject(request._id)}
              >
                REJEITAR
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isLoading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Spinner />
        </div>
      )}
      <ul className="spot-list">
        {spots.map(spot => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${spot.thumbnail})` }} />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
          </li>
        ))}
      </ul>
      <button onClick={hadleShowBookings} className="btn secondary">
        VER RESERVAS
      </button>
      <Link to="/new">
        <button className="btn">CADASTRAR NOVO SPOT</button>
      </Link>
    </>
  );
}
