'use client';

import { useEffect, useState, useCallback } from 'react';
import { createLead } from '@/lib/services/leads';
import type { LeadCreatePayload } from '@/lib/api-types';
import './whatsapp-widget.css';

const SEGMENTS = [
  'Academia',
  'Faculdade',
  'Studio',
  'Condomínio',
  'Hotel & Resort',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatPhone = (value: string) => {
  return onlyDigits(value).slice(0, 11);
};

type IbgeState = {
  id: number;
  sigla: string;
  nome: string;
};

type IbgeCity = {
  id: number;
  nome: string;
};

type FieldErrors = Partial<{
  segment: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
}>;

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [form, setForm] = useState({
    segment: '',
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
  });

  const [states, setStates] = useState<IbgeState[]>([]);
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, []);

  // Load states
  useEffect(() => {
    if (!isOpen || states.length > 0) return;

    let active = true;

    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
        );
        const data: IbgeState[] = await response.json();
        if (active) setStates(data);
      } catch {
        if (active) setStates([]);
      } finally {
        if (active) setLoadingStates(false);
      }
    };

    loadStates();

    return () => {
      active = false;
    };
  }, [isOpen, states.length]);

  // Load cities when state changes
  useEffect(() => {
    if (!form.state) {
      setCities([]);
      setLoadingCities(false);
      return;
    }

    let active = true;

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.state}/municipios`
        );
        const data: IbgeCity[] = await response.json();
        if (active) setCities(data);
      } catch {
        if (active) setCities([]);
      } finally {
        if (active) setLoadingCities(false);
      }
    };

    loadCities();

    return () => {
      active = false;
    };
  }, [form.state]);

  const setFieldError = (field: keyof typeof form, message?: string) => {
    setFieldErrors((prev) => {
      if (!message && !prev[field]) return prev;
      const next = { ...prev };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const validateField = (field: keyof typeof form, value: string) => {
    const trimmed = value.trim();
    switch (field) {
      case 'segment':
        return trimmed ? undefined : 'Selecione uma opção.';
      case 'name':
        return trimmed.length >= 3 ? undefined : 'Nome muito curto.';
      case 'email':
        return EMAIL_REGEX.test(trimmed) ? undefined : 'E-mail inválido.';
      case 'phone':
        return onlyDigits(value).length >= 10 ? undefined : 'Telefone incompleto.';
      case 'state':
      case 'city':
        return trimmed ? undefined : 'Selecione uma opção.';
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof typeof form) => {
    const message = validateField(field, form[field]);
    setFieldError(field, message);
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldError(key, undefined);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('phone', formatPhone(event.target.value));
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setForm((prev) => ({ ...prev, state: selected, city: '' }));
    setCities([]);
    setFieldError('state', undefined);
    setFieldError('city', undefined);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setError('');
    setFieldErrors({});

    const nextErrors: FieldErrors = {};
    const fieldsToValidate: (keyof typeof form)[] = [
      'segment',
      'name',
      'email',
      'phone',
      'state',
      'city',
    ];

    fieldsToValidate.forEach((field) => {
      const message = validateField(field, form[field]);
      if (message) nextErrors[field] = message;
    });

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setSubmitting(true);

    try {
      const payload: LeadCreatePayload = {
        name: form.name,
        email: form.email.trim(),
        phone: `+55${form.phone}`,
        city: form.city,
        state: form.state,
        type: 'WHATSAPP',
        segment: form.segment,
      };

      await createLead(payload);

      setStatus('Dados enviados com sucesso! Entraremos em contato em breve.');
      setForm({
        segment: '',
        name: '',
        email: '',
        phone: '',
        state: '',
        city: '',
      });

      setTimeout(() => {
        handleClose();
        setStatus('');
      }, 3000);
    } catch {
      setError('Não foi possível enviar seus dados. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="whatsapp-fab"
        onClick={isOpen ? handleClose : handleOpen}
        aria-label="Abrir WhatsApp"
        id="whatsapp-fab"
        type="button"
      >
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.052 9.38L1.056 31.2l6.04-1.94A15.89 15.89 0 0016.004 32C24.826 32 32 24.824 32 16S24.826 0 16.004 0zm9.32 22.608c-.396 1.116-1.956 2.04-3.216 2.312-.864.184-1.992.332-5.792-1.244-4.86-2.016-7.984-6.94-8.228-7.26-.232-.32-1.96-2.612-1.96-4.984 0-2.372 1.24-3.54 1.68-4.024.44-.484.96-.604 1.28-.604.32 0 .64.004.92.016.296.012.692-.112 1.084.828.396.952 1.348 3.296 1.468 3.536.12.24.196.52.04.84-.16.32-.24.52-.476.8-.24.28-.504.628-.72.844-.24.24-.488.5-.208.98.28.48 1.244 2.052 2.672 3.324 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.28-.32 1.2-1.396 1.52-1.876.32-.48.64-.396 1.08-.236.44.16 2.784 1.312 3.264 1.552.48.24.8.356.916.556.12.196.12 1.152-.276 2.268z" />
        </svg>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className={`whatsapp-panel ${isClosing ? 'closing' : ''}`}>
          {/* Header */}
          <div className="whatsapp-header">
            <img
              src="/consultor.png"
              alt="Consultor Vitally"
              className="whatsapp-header-avatar"
            />
            <div className="whatsapp-header-info">
              <div className="whatsapp-header-name">Consultor Vitally</div>
            </div>
            <button
              className="whatsapp-header-close"
              onClick={handleClose}
              aria-label="Fechar"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="whatsapp-body">
            <div className="whatsapp-bubble">
              Olá, gostaria de orçar nossos produtos pelo WhatsApp? Me informe seu email e telefone para iniciarmos uma conversa sem compromisso :)
            </div>

            <form onSubmit={handleSubmit} className="whatsapp-form">
              {/* Segment dropdown */}
              <select
                className="whatsapp-select"
                value={form.segment}
                onChange={(e) => handleChange('segment', e.target.value)}
                onBlur={() => handleBlur('segment')}
                id="whatsapp-segment"
              >
                <option value="">Quero um orçamento para:</option>
                {SEGMENTS.map((seg) => (
                  <option key={seg} value={seg}>
                    {seg}
                  </option>
                ))}
              </select>
              {fieldErrors.segment && (
                <span className="whatsapp-field-error">{fieldErrors.segment}</span>
              )}

              {/* Name */}
              <input
                type="text"
                className="whatsapp-input"
                placeholder="Digite seu nome"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                id="whatsapp-name"
              />
              {fieldErrors.name && (
                <span className="whatsapp-field-error">{fieldErrors.name}</span>
              )}

              {/* Email */}
              <input
                type="email"
                className="whatsapp-input"
                placeholder="Digite seu e-mail"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                id="whatsapp-email"
              />
              {fieldErrors.email && (
                <span className="whatsapp-field-error">{fieldErrors.email}</span>
              )}

              {/* Phone */}
              <div className="whatsapp-phone-wrapper">
                <span className="whatsapp-phone-prefix">+55</span>
                <input
                  type="tel"
                  className="whatsapp-input whatsapp-phone-input"
                  placeholder="11999999999"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur('phone')}
                  inputMode="tel"
                  id="whatsapp-phone"
                />
              </div>
              {fieldErrors.phone && (
                <span className="whatsapp-field-error">{fieldErrors.phone}</span>
              )}

              {/* State */}
              <select
                className="whatsapp-select"
                value={form.state}
                onChange={handleStateChange}
                onBlur={() => handleBlur('state')}
                disabled={loadingStates}
                id="whatsapp-state"
              >
                <option value="">
                  {loadingStates ? 'Carregando...' : 'Insira seu estado'}
                </option>
                {states.map((s) => (
                  <option key={s.id} value={s.sigla}>
                    {s.nome}
                  </option>
                ))}
              </select>
              {fieldErrors.state && (
                <span className="whatsapp-field-error">{fieldErrors.state}</span>
              )}

              {/* City */}
              <select
                className="whatsapp-select"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                disabled={!form.state || loadingCities}
                id="whatsapp-city"
              >
                <option value="">
                  {!form.state
                    ? 'Insira a sua cidade'
                    : loadingCities
                      ? 'Carregando...'
                      : 'Insira a sua cidade'}
                </option>
                {cities.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {fieldErrors.city && (
                <span className="whatsapp-field-error">{fieldErrors.city}</span>
              )}

              {error && <div className="whatsapp-error">{error}</div>}
              {status && <div className="whatsapp-success">{status}</div>}

              {/* Submit */}
              <button
                type="submit"
                className="whatsapp-submit"
                disabled={submitting}
                id="whatsapp-submit"
              >
                {submitting ? 'Enviando...' : 'Enviar Dados'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
