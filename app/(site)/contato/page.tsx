'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { createLead } from '@/lib/services/leads';
import type { LeadCreatePayload } from '@/lib/api-types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return '';

  const ddd = digits.slice(0, 2);
  if (digits.length <= 2) return `(${ddd}`;

  const hasNine = digits.length > 10;
  const firstPart = digits.slice(2, hasNine ? 7 : 6);
  const lastPart = digits.slice(hasNine ? 7 : 6, hasNine ? 11 : 10);

  if (!lastPart) return `(${ddd}) ${firstPart}`;

  return `(${ddd}) ${firstPart}-${lastPart}`;
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
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  message: string;
}>;

export default function ContatoPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    message: '',
  });
  const [states, setStates] = useState<IbgeState[]>([]);
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    let active = true;

    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
        );
        const data: IbgeState[] = await response.json();
        if (active) setStates(data);
      } catch (fetchError) {
        if (active) setStates([]);
      } finally {
        if (active) setLoadingStates(false);
      }
    };

    loadStates();

    return () => {
      active = false;
    };
  }, []);

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
      } catch (fetchError) {
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
      case 'name':
        return trimmed.length >= 3 ? undefined : 'Nome muito curto.';
      case 'email':
        return EMAIL_REGEX.test(trimmed) ? undefined : 'E-mail invalido.';
      case 'phone':
        return onlyDigits(value).length >= 10 ? undefined : 'Telefone incompleto.';
      case 'state':
      case 'city':
        return trimmed ? undefined : 'Selecione uma opcao.';
      case 'message':
        return trimmed.length >= 10 ? undefined : 'Escreva um pouco mais.';
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
      'name',
      'email',
      'phone',
      'state',
      'city',
      'message',
    ];

    fieldsToValidate.forEach((field) => {
      const message = validateField(field, form[field]);
      if (message) nextErrors[field] = message;
    });

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const emailValue = form.email.trim();

    setSubmitting(true);

    try {
      const payload: LeadCreatePayload = {
        name: form.name,
        email: emailValue,
        phone: form.phone,
        city: form.city,
        state: form.state,
        message: form.message,
        type: 'CONTACT',
      };

      await createLead(payload);

      setStatus('Contato enviado com sucesso. Responderemos em breve!');
      setForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        message: '',
      });
    } catch (submitError) {
      setError('Não foi possível enviar sua mensagem agora. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-4 lg:px-8 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-white text-3xl sm:text-4xl font-black">Entre em contato</h1>
          <p className="text-white/50 text-base">
            Envie sua mensagem e nossa equipe responderá em breve.
          </p>
        </header>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                  Nome
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full h-12 px-4 rounded-xl bg-black/60 border ${
                    fieldErrors.name
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-white/10 focus:border-[#39FF14]/60'
                  } text-white placeholder-white/30 outline-none transition-colors`}
                  placeholder="Seu nome completo"
                  required
                />
                {fieldErrors.name && (
                  <p className="text-rose-400 text-xs font-semibold">{fieldErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                  E-mail
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full h-12 px-4 rounded-xl bg-black/60 border ${
                    fieldErrors.email
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-white/10 focus:border-[#39FF14]/60'
                  } text-white placeholder-white/30 outline-none transition-colors`}
                  placeholder="voce@email.com"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-rose-400 text-xs font-semibold">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur('phone')}
                  inputMode="tel"
                  className={`w-full h-12 px-4 rounded-xl bg-black/60 border ${
                    fieldErrors.phone
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-white/10 focus:border-[#39FF14]/60'
                  } text-white placeholder-white/30 outline-none transition-colors`}
                  placeholder="(11) 99999-9999"
                  required
                />
                {fieldErrors.phone && (
                  <p className="text-rose-400 text-xs font-semibold">{fieldErrors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                  Estado
                </label>
                <select
                  value={form.state}
                  onChange={handleStateChange}
                  onBlur={() => handleBlur('state')}
                  className={`w-full h-12 px-4 rounded-xl bg-black/60 border ${
                    fieldErrors.state
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-white/10 focus:border-[#39FF14]/60'
                  } text-white outline-none transition-colors`}
                  disabled={loadingStates}
                  required
                >
                  <option value="">
                    {loadingStates ? 'Carregando estados...' : 'Selecione o estado'}
                  </option>
                  {states.map((state) => (
                    <option key={state.id} value={state.sigla}>
                      {state.nome}
                    </option>
                  ))}
                </select>
                {fieldErrors.state && (
                  <p className="text-rose-400 text-xs font-semibold">{fieldErrors.state}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Cidade
              </label>
              <select
                value={form.city}
                onChange={(event) => handleChange('city', event.target.value)}
                onBlur={() => handleBlur('city')}
                className={`w-full h-12 px-4 rounded-xl bg-black/60 border ${
                  fieldErrors.city
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:border-[#39FF14]/60'
                } text-white outline-none transition-colors`}
                disabled={!form.state || loadingCities}
                required
              >
                <option value="">
                  {!form.state
                    ? 'Selecione um estado primeiro'
                    : loadingCities
                      ? 'Carregando cidades...'
                      : 'Selecione a cidade'}
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.nome}>
                    {city.nome}
                  </option>
                ))}
              </select>
              {fieldErrors.city && (
                <p className="text-rose-400 text-xs font-semibold">{fieldErrors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Mensagem
              </label>
              <textarea
                value={form.message}
                onChange={(event) => handleChange('message', event.target.value)}
                onBlur={() => handleBlur('message')}
                className={`w-full min-h-[150px] rounded-xl px-4 py-3 bg-black/60 border ${
                  fieldErrors.message
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:border-[#39FF14]/60'
                } text-white placeholder-white/30 outline-none transition-colors resize-none`}
                placeholder="Descreva sua dúvida ou sugestão..."
                required
              />
              {fieldErrors.message && (
                <p className="text-rose-400 text-xs font-semibold">{fieldErrors.message}</p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
                {error}
              </div>
            )}

            {status && (
              <div className="p-4 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-sm">
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {submitting ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-[#39FF14] text-sm font-bold uppercase tracking-widest mb-2">
                Telefone
              </div>
              <a href="tel:+5511999999999" className="text-white hover:text-[#39FF14] transition-colors">
                +55 (11) 99999-9999
              </a>
            </div>
            <div>
              <div className="text-[#39FF14] text-sm font-bold uppercase tracking-widest mb-2">
                E-mail
              </div>
              <a href="mailto:contato@vitally.com" className="text-white hover:text-[#39FF14] transition-colors">
                contato@vitally.com
              </a>
            </div>
            <div>
              <div className="text-[#39FF14] text-sm font-bold uppercase tracking-widest mb-2">
                Horário
              </div>
              <p className="text-white/70">
                Seg - Sex<br />
                09:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
