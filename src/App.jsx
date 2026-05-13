'use client';

import { useState, useEffect } from 'react';

/* ─── SUPABASE (troque pela sua instância) ─────────────────────────────── */
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient('SUA_URL', 'SUA_ANON_KEY');

/* ─── MOCK SUPABASE para demonstração ─────────────────────────────────── */
import { supabase } from './supabase';

/* ─── CONSTANTES ───────────────────────────────────────────────────────── */
const RESPONSAVEIS = [
  'Adriano',
  'Cristina',
  'Igor',
  'João',
  'Mara',
  'Maria',
  'Fernanda',
];

const RESP_COLORS = {
  Adriano: '#6C8EBF',
  Cristina: '#B56FA8',
  Igor: '#5FAD8E',
  João: '#C4934A',
  Mara: '#D4697A',
  Maria: '#7B8FCC',
  Fernanda: '#8F8F8F',
};

const RESP_INITIALS = {
  Adriano: 'AD',
  Cristina: 'CR',
  Igor: 'IG',
  João: 'JO',
  Mara: 'MA',
  Maria: 'MR',
  Fernanda: 'FE',
};

const fmt = (v) =>
  `R$ ${Number(v || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function normalizarMes(mes) {
  if (!mes) return null;
  if (mes.includes('-')) return mes.slice(0, 7);
  if (mes.includes('/')) {
    const [m, a] = mes.split('/');
    return `20${a}-${m.padStart(2, '0')}`;
  }
  return null;
}

const FORM_VAZIO = {
  data: '',
  responsavel: RESPONSAVEIS[0],
  descricao: '',
  valor: '',
  parcelas: 1,
};

/* ─── ESTILOS ──────────────────────────────────────────────────────────── */
const C = {
  bg: '#0F1117',
  surface: '#1A1D27',
  surface2: '#22263A',
  border: '#2C3150',
  text: '#E8EAF6',
  muted: '#7B82A8',
  accent: '#4F6AF0',
  accentLight: '#7B93FF',
  success: '#52C97A',
  danger: '#E05C6A',
  warning: '#F0B44F',
};

const S = {
  root: {
    background: C.bg,
    minHeight: '100vh',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    maxWidth: 600,
    margin: '0 auto',
    position: 'relative',
    color: C.text,
  },
  header: {
    background: C.surface,
    padding: '18px 20px 14px',
    borderBottom: `1px solid ${C.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSub: {
    color: C.accent,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 3,
    margin: 0,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: C.text,
    fontSize: 20,
    fontWeight: 800,
    margin: '3px 0 0',
  },
  monthPicker: {
    background: C.surface2,
    color: C.text,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '7px 10px',
    fontSize: 13,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  },
  main: { padding: '16px 16px 110px' },
  toast: {
    position: 'fixed',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    zIndex: 200,
    whiteSpace: 'nowrap',
  },
  card: {
    background: C.surface,
    borderRadius: 14,
    padding: 16,
    border: `1px solid ${C.border}`,
    marginBottom: 12,
  },
  cardTitle: {
    color: C.muted,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    margin: '0 0 14px',
  },
  /* DASHBOARD */
  totalBox: {
    background: `linear-gradient(135deg, ${C.accent}22 0%, ${C.surface2} 100%)`,
    border: `1px solid ${C.accent}44`,
    borderRadius: 16,
    padding: '20px 20px',
    marginBottom: 14,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  respRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: `1px solid ${C.border}`,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
    color: '#fff',
  },
  bar: {
    flex: 1,
    height: 5,
    background: C.surface2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  /* LANÇAMENTOS */
  respCard: {
    background: C.surface,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    marginBottom: 12,
    overflow: 'hidden',
  },
  respCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    cursor: 'pointer',
  },
  chevron: {
    marginLeft: 'auto',
    color: C.muted,
    fontSize: 12,
    transition: 'transform 0.2s',
  },
  item: {
    background: C.surface2,
    padding: '11px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderTop: `1px solid ${C.border}`,
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: C.muted,
    fontSize: 15,
    cursor: 'pointer',
    padding: '0 2px',
    flexShrink: 0,
  },
  badge: {
    background: C.border,
    color: C.muted,
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: 5,
  },
  /* FILTROS */
  filtrosGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  select: {
    background: C.surface2,
    color: C.text,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '9px 10px',
    fontSize: 13,
    outline: 'none',
    width: '100%',
    fontFamily: "'DM Sans', sans-serif",
  },
  dateField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '6px 10px',
  },
  dateLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateInput: {
    background: 'transparent',
    color: C.text,
    border: 'none',
    fontSize: 13,
    outline: 'none',
    padding: '2px 0',
    fontFamily: "'DM Sans', sans-serif",
    width: '100%',
  },
  clearBtn: {
    marginTop: 10,
    background: 'transparent',
    color: C.danger,
    border: `1px solid ${C.danger}44`,
    borderRadius: 8,
    padding: '7px 12px',
    fontSize: 12,
    cursor: 'pointer',
    width: '100%',
    fontFamily: "'DM Sans', sans-serif",
  },
  /* FORM */
  label: {
    color: C.muted,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
  },
  input: {
    background: C.surface2,
    color: C.text,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: 14,
    fontFamily: "'DM Sans', sans-serif",
  },
  respBtns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 6,
    marginBottom: 14,
  },
  respBtn: {
    background: C.surface2,
    color: C.muted,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '10px 4px',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.15s',
  },
  saveBtn: {
    width: '100%',
    padding: '13px',
    background: C.accent,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  /* MODAL */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalBox: {
    background: C.surface,
    borderRadius: '20px 20px 0 0',
    padding: 20,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    border: `1px solid ${C.border}`,
    borderBottom: 'none',
  },
  deleteBtn: {
    width: '100%',
    marginTop: 10,
    padding: '11px',
    background: 'transparent',
    color: C.danger,
    border: `1px solid ${C.danger}44`,
    borderRadius: 10,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
  },
  deleteBtnSm: {
    flex: 1,
    padding: '8px 4px',
    background: C.danger,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 11,
    cursor: 'pointer',
    fontWeight: 700,
  },
  cancelBtnSm: {
    flex: 1,
    padding: '8px 4px',
    background: C.surface2,
    color: C.muted,
    border: 'none',
    borderRadius: 8,
    fontSize: 11,
    cursor: 'pointer',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: `2px solid ${C.border}`,
    background: C.surface2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 600,
    background: C.surface,
    borderTop: `1px solid ${C.border}`,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 24px',
    zIndex: 20,
  },
  navBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    cursor: 'pointer',
    padding: '4px 12px',
    borderRadius: 10,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.3,
    fontFamily: "'DM Sans', sans-serif",
  },
};

/* ═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [expandedResp, setExpandedResp] = useState(null);

  const [filtroResp, setFiltroResp] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  const [editando, setEditando] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editarProximas, setEditarProximas] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState(FORM_VAZIO);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cartao_compartilhado')
      .select('*')
      .order('data', { ascending: false });
    if (error) showToast('Erro ao buscar dados', 'error');
    else setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ── ADD ── */
  const handleAdd = async () => {
    if (!form.data || !form.valor) {
      showToast('Preencha data e valor', 'error');
      return;
    }
    const qtd = Math.max(1, parseInt(form.parcelas) || 1);
    setSaving(true);
    const valorParcela = Number(form.valor) / qtd;
    const novas = [];
    for (let i = 1; i <= qtd; i++) {
      const d = new Date(form.data + 'T12:00:00');
      d.setMonth(d.getMonth() + (i - 1));
      novas.push({
        data: d.toISOString().slice(0, 10),
        responsavel: form.responsavel,
        descricao: form.descricao,
        valor: valorParcela,
        parcelado: qtd > 1,
        numero_parcela: i,
        total_parcelas: qtd,
        mes_referente: d.toISOString().slice(0, 7),
        pago: null,
      });
    }
    const { error } = await supabase.from('cartao_compartilhado').insert(novas);
    setSaving(false);
    if (error) {
      showToast('Erro ao salvar', 'error');
      return;
    }
    showToast(qtd > 1 ? `${qtd} parcelas criadas!` : 'Lançamento salvo!');
    setForm(FORM_VAZIO);
    fetchData();
    setTab('lancamentos');
  };

  /* ── GRUPO PARCELAS ── */
  const getGrupo = (t) => {
    if (!t.parcelado) return [t];
    return transactions
      .filter(
        (x) =>
          x.parcelado &&
          x.descricao === t.descricao &&
          x.responsavel === t.responsavel &&
          x.total_parcelas === t.total_parcelas &&
          Number(x.valor) === Number(t.valor)
      )
      .sort((a, b) => a.numero_parcela - b.numero_parcela);
  };

  const getProximasParcelas = (t) => {
    if (!t.parcelado) return [];
    return getGrupo(t).filter((x) => x.numero_parcela !== t.numero_parcela);
  };

  /* ── EDIT ── */
  const abrirEdicao = (t, e) => {
    e?.stopPropagation();
    setEditando(t);
    setEditForm({
      data: t.data,
      responsavel: t.responsavel,
      descricao: t.descricao || '',
      valor: t.valor,
    });
    setEditarProximas(false);
    setConfirmDelete(false);
  };

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    const payload = {
      data: editForm.data,
      responsavel: editForm.responsavel,
      descricao: editForm.descricao,
      valor: Number(editForm.valor),
    };
    let ids = [editando.id];
    if (editarProximas && editando.parcelado) {
      const irmas = getGrupo(editando).filter(
        (x) => x.numero_parcela > editando.numero_parcela
      );
      ids = [editando.id, ...irmas.map((x) => x.id)];
    }
    const { error } = await supabase
      .from('cartao_compartilhado')
      .update(payload)
      .in('id', ids);
    setSavingEdit(false);
    if (error) {
      showToast('Erro ao salvar', 'error');
      return;
    }
    showToast('Atualizado!');
    setEditando(null);
    fetchData();
  };

  const handleDelete = async (apenasEsta) => {
    setSavingEdit(true);
    let ids = [editando.id];
    if (!apenasEsta && editando.parcelado)
      ids = getGrupo(editando).map((x) => x.id);
    const { error } = await supabase
      .from('cartao_compartilhado')
      .delete()
      .in('id', ids);
    setSavingEdit(false);
    if (error) {
      showToast('Erro ao excluir', 'error');
      return;
    }
    showToast('Excluído!');
    setEditando(null);
    fetchData();
  };

  /* ── DADOS ── */
  const filtradas = transactions.filter(
    (t) => normalizarMes(t.mes_referente) === mes
  );

  const lancamentos = filtradas.filter((t) => {
    if (filtroResp && t.responsavel !== filtroResp) return false;
    if (filtroDataInicio && t.data < filtroDataInicio) return false;
    if (filtroDataFim && t.data > filtroDataFim) return false;
    return true;
  });

  const totalMes = filtradas.reduce((a, b) => a + Number(b.valor || 0), 0);

  const porResponsavel = RESPONSAVEIS.map((r) => ({
    nome: r,
    valor: filtradas
      .filter((t) => t.responsavel === r)
      .reduce((a, b) => a + Number(b.valor || 0), 0),
  }))
    .filter((r) => r.valor > 0)
    .sort((a, b) => b.valor - a.valor);

  /* Agrupa para aba Lançamentos */
  const respComLancamentos = RESPONSAVEIS.map((r) => ({
    nome: r,
    items: lancamentos.filter((t) => t.responsavel === r),
    total: lancamentos
      .filter((t) => t.responsavel === r)
      .reduce((a, b) => a + Number(b.valor || 0), 0),
  })).filter((r) => r.items.length > 0);

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div style={S.root}>
      {/* Inject Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2C3150; border-radius: 10px; }
        input[type='date']::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        input[type='month']::-webkit-calendar-picker-indicator { filter: invert(0.7); }
      `}</style>

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <div>
            <p style={S.headerSub}>💳 Fatura Compartilhada</p>
            <h1 style={S.headerTitle}>Cartão da Família</h1>
          </div>
          <input
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            style={S.monthPicker}
          />
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            ...S.toast,
            background: toast.type === 'error' ? C.danger : C.success,
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* MODAL EDIÇÃO */}
      {editando && (
        <div style={S.modalOverlay} onClick={() => setEditando(null)}>
          <div style={S.modalBox} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  color: C.text,
                  fontSize: 16,
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                Editar lançamento
              </p>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: C.muted,
                  fontSize: 22,
                  cursor: 'pointer',
                }}
                onClick={() => setEditando(null)}
              >
                ×
              </button>
            </div>

            <label style={S.label}>Data</label>
            <div style={{ ...S.dateField, marginBottom: 14 }}>
              <span style={S.dateLabel}>Data</span>
              <input
                type="date"
                style={S.dateInput}
                value={editForm.data}
                onChange={(e) =>
                  setEditForm({ ...editForm, data: e.target.value })
                }
              />
            </div>

            <label style={S.label}>Responsável</label>
            <div style={{ ...S.respBtns, marginBottom: 14 }}>
              {RESPONSAVEIS.map((r) => (
                <button
                  key={r}
                  style={{
                    ...S.respBtn,
                    ...(editForm.responsavel === r
                      ? {
                          background: RESP_COLORS[r] + '33',
                          borderColor: RESP_COLORS[r],
                          color: RESP_COLORS[r],
                          fontWeight: 700,
                        }
                      : {}),
                  }}
                  onClick={() => setEditForm({ ...editForm, responsavel: r })}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background:
                        RESP_COLORS[r] +
                        (editForm.responsavel === r ? 'FF' : '44'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#fff',
                    }}
                  >
                    {RESP_INITIALS[r]}
                  </span>
                  {r}
                </button>
              ))}
            </div>

            <label style={S.label}>Descrição</label>
            <input
              type="text"
              style={S.input}
              value={editForm.descricao}
              onChange={(e) =>
                setEditForm({ ...editForm, descricao: e.target.value })
              }
            />

            <label style={S.label}>Valor (R$)</label>
            <input
              type="number"
              style={S.input}
              value={editForm.valor}
              onChange={(e) =>
                setEditForm({ ...editForm, valor: e.target.value })
              }
            />

            {editando.parcelado && getProximasParcelas(editando).length > 0 && (
              <div style={S.checkRow}>
                <div
                  style={{
                    ...S.checkbox,
                    ...(editarProximas
                      ? { background: C.accent, borderColor: C.accent }
                      : {}),
                  }}
                  onClick={() => setEditarProximas(!editarProximas)}
                >
                  {editarProximas && (
                    <span
                      style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ color: C.muted, fontSize: 13 }}>
                  Aplicar para {getProximasParcelas(editando).length} próximas
                  parcelas também
                </span>
              </div>
            )}

            <button
              style={{ ...S.saveBtn, marginTop: 6 }}
              onClick={handleSaveEdit}
              disabled={savingEdit}
            >
              {savingEdit ? 'Salvando...' : 'Salvar alterações'}
            </button>

            {!confirmDelete ? (
              <button
                style={S.deleteBtn}
                onClick={() => setConfirmDelete(true)}
              >
                Excluir lançamento
              </button>
            ) : (
              <div
                style={{
                  marginTop: 10,
                  padding: 12,
                  background: C.surface2,
                  borderRadius: 10,
                }}
              >
                <p style={{ color: C.text, fontSize: 13, margin: '0 0 10px' }}>
                  Confirmar exclusão:
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={S.deleteBtnSm}
                    onClick={() => handleDelete(true)}
                  >
                    Apenas esta
                  </button>
                  {editando.parcelado && (
                    <button
                      style={S.deleteBtnSm}
                      onClick={() => handleDelete(false)}
                    >
                      Todo parcelamento
                    </button>
                  )}
                  <button
                    style={S.cancelBtnSm}
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main style={S.main}>
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 80,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: `3px solid ${C.border}`,
                borderTop: `3px solid ${C.accent}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: C.muted, marginTop: 12 }}>Carregando...</p>
          </div>
        ) : (
          <>
            {/* ── DASHBOARD ────────────────────────────────────── */}
            {tab === 'dashboard' && (
              <div>
                {/* Total */}
                <div style={S.totalBox}>
                  <div>
                    <p
                      style={{
                        color: C.muted,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        margin: '0 0 4px',
                      }}
                    >
                      Total da fatura
                    </p>
                    <p
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: C.text,
                        margin: 0,
                      }}
                    >
                      {fmt(totalMes)}
                    </p>
                    <p
                      style={{
                        color: C.muted,
                        fontSize: 12,
                        margin: '4px 0 0',
                      }}
                    >
                      {filtradas.length} lançamentos
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p
                      style={{
                        color: C.muted,
                        fontSize: 11,
                        margin: '0 0 4px',
                      }}
                    >
                      Responsáveis
                    </p>
                    <p
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: C.accentLight,
                        margin: 0,
                      }}
                    >
                      {porResponsavel.length}
                    </p>
                  </div>
                </div>

                {porResponsavel.length === 0 ? (
                  <EmptyState msg="Nenhum lançamento neste mês." />
                ) : (
                  <div style={S.card}>
                    <p style={S.cardTitle}>Gastos por responsável</p>
                    {porResponsavel.map((r, i) => {
                      const pct = totalMes ? (r.valor / totalMes) * 100 : 0;
                      return (
                        <div
                          key={r.nome}
                          style={{
                            ...S.respRow,
                            borderBottom:
                              i === porResponsavel.length - 1
                                ? 'none'
                                : `1px solid ${C.border}`,
                          }}
                        >
                          <div
                            style={{
                              ...S.avatar,
                              background: RESP_COLORS[r.nome],
                            }}
                          >
                            {RESP_INITIALS[r.nome]}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: 5,
                              }}
                            >
                              <span style={{ fontWeight: 700, fontSize: 14 }}>
                                {r.nome}
                              </span>
                              <span
                                style={{
                                  fontWeight: 800,
                                  fontSize: 14,
                                  color: RESP_COLORS[r.nome],
                                }}
                              >
                                {fmt(r.valor)}
                              </span>
                            </div>
                            <div style={S.bar}>
                              <div
                                style={{
                                  height: 5,
                                  borderRadius: 10,
                                  width: `${pct}%`,
                                  background: RESP_COLORS[r.nome],
                                  transition: 'width 0.4s',
                                }}
                              />
                            </div>
                            <p
                              style={{
                                color: C.muted,
                                fontSize: 11,
                                margin: '3px 0 0',
                              }}
                            >
                              {pct.toFixed(1)}% do total
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── LANÇAMENTOS ──────────────────────────────────── */}
            {tab === 'lancamentos' && (
              <div>
                {/* Filtros */}
                <div style={S.card}>
                  <p style={S.cardTitle}>Filtros</p>
                  <div style={S.filtrosGrid}>
                    <select
                      style={S.select}
                      value={filtroResp}
                      onChange={(e) => setFiltroResp(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {RESPONSAVEIS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <div /> {/* spacer */}
                    <div style={S.dateField}>
                      <span style={S.dateLabel}>De</span>
                      <input
                        type="date"
                        style={S.dateInput}
                        value={filtroDataInicio}
                        onChange={(e) => setFiltroDataInicio(e.target.value)}
                      />
                    </div>
                    <div style={S.dateField}>
                      <span style={S.dateLabel}>Até</span>
                      <input
                        type="date"
                        style={S.dateInput}
                        value={filtroDataFim}
                        onChange={(e) => setFiltroDataFim(e.target.value)}
                      />
                    </div>
                  </div>
                  {(filtroResp || filtroDataInicio || filtroDataFim) && (
                    <button
                      style={S.clearBtn}
                      onClick={() => {
                        setFiltroResp('');
                        setFiltroDataInicio('');
                        setFiltroDataFim('');
                      }}
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>

                {respComLancamentos.length === 0 ? (
                  <EmptyState msg="Nenhum lançamento encontrado." />
                ) : (
                  respComLancamentos.map((resp) => {
                    const isOpen = expandedResp === resp.nome;
                    return (
                      <div key={resp.nome} style={S.respCard}>
                        {/* Header do responsável */}
                        <div
                          style={S.respCardHeader}
                          onClick={() =>
                            setExpandedResp(isOpen ? null : resp.nome)
                          }
                        >
                          <div
                            style={{
                              ...S.avatar,
                              background: RESP_COLORS[resp.nome],
                            }}
                          >
                            {RESP_INITIALS[resp.nome]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 800,
                                fontSize: 15,
                              }}
                            >
                              {resp.nome}
                            </p>
                            <p
                              style={{
                                margin: '2px 0 0',
                                fontSize: 12,
                                color: C.muted,
                              }}
                            >
                              {resp.items.length} lançamento
                              {resp.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 800,
                                fontSize: 16,
                                color: RESP_COLORS[resp.nome],
                              }}
                            >
                              {fmt(resp.total)}
                            </p>
                          </div>
                          <span
                            style={{
                              ...S.chevron,
                              transform: isOpen
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                              marginLeft: 10,
                            }}
                          >
                            ▼
                          </span>
                        </div>

                        {/* Lista de lançamentos */}
                        {isOpen &&
                          resp.items.map((t) => (
                            <div
                              key={t.id}
                              style={{
                                ...S.item,
                                borderLeft: `3px solid ${
                                  RESP_COLORS[t.responsavel]
                                }`,
                              }}
                            >
                              <button
                                style={S.editBtn}
                                onClick={(e) => abrirEdicao(t, e)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: C.text,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {t.descricao || t.responsavel}
                                </p>
                                <p
                                  style={{
                                    margin: '2px 0 0',
                                    fontSize: 11,
                                    color: C.muted,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                  }}
                                >
                                  {t.data}
                                  {t.parcelado && (
                                    <span style={S.badge}>
                                      {t.numero_parcela}/{t.total_parcelas}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <p
                                style={{
                                  margin: 0,
                                  fontWeight: 800,
                                  fontSize: 14,
                                  flexShrink: 0,
                                  color: C.text,
                                }}
                              >
                                {fmt(t.valor)}
                              </p>
                            </div>
                          ))}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ── NOVO ─────────────────────────────────────────── */}
            {tab === 'novo' && (
              <div>
                <div style={S.card}>
                  <p style={S.cardTitle}>Novo Lançamento</p>

                  <label style={S.label}>Data de cobrança *</label>
                  <div style={{ ...S.dateField, marginBottom: 14 }}>
                    <span style={S.dateLabel}>Data</span>
                    <input
                      type="date"
                      style={S.dateInput}
                      value={form.data}
                      onChange={(e) =>
                        setForm({ ...form, data: e.target.value })
                      }
                    />
                  </div>

                  <label style={S.label}>Responsável</label>
                  <div style={S.respBtns}>
                    {RESPONSAVEIS.map((r) => (
                      <button
                        key={r}
                        style={{
                          ...S.respBtn,
                          ...(form.responsavel === r
                            ? {
                                background: RESP_COLORS[r] + '22',
                                borderColor: RESP_COLORS[r],
                                color: RESP_COLORS[r],
                                fontWeight: 700,
                              }
                            : {}),
                        }}
                        onClick={() => setForm({ ...form, responsavel: r })}
                      >
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background:
                              RESP_COLORS[r] +
                              (form.responsavel === r ? 'FF' : '55'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 800,
                            color: '#fff',
                          }}
                        >
                          {RESP_INITIALS[r]}
                        </span>
                        {r}
                      </button>
                    ))}
                  </div>

                  <label style={S.label}>Descrição</label>
                  <input
                    type="text"
                    placeholder="Ex: Supermercado"
                    style={S.input}
                    value={form.descricao}
                    onChange={(e) =>
                      setForm({ ...form, descricao: e.target.value })
                    }
                  />

                  <label style={S.label}>Valor total (R$) *</label>
                  <input
                    type="number"
                    placeholder="0,00"
                    style={S.input}
                    value={form.valor}
                    onChange={(e) =>
                      setForm({ ...form, valor: e.target.value })
                    }
                  />

                  <label style={S.label}>Número de parcelas</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    style={S.input}
                    value={form.parcelas}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        parcelas:
                          e.target.value === ''
                            ? ''
                            : Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                  />

                  {Number(form.valor) > 0 && Number(form.parcelas) > 1 && (
                    <div
                      style={{
                        background: C.surface2,
                        borderRadius: 10,
                        padding: '10px 14px',
                        marginBottom: 14,
                        marginTop: -8,
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: C.accentLight,
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {form.parcelas}× de{' '}
                        {fmt(Number(form.valor) / Number(form.parcelas))}/mês
                      </p>
                    </div>
                  )}

                  <button
                    style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }}
                    onClick={handleAdd}
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar lançamento'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* NAV */}
      <nav style={S.nav}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'lancamentos', label: 'Lançamentos', icon: '📋' },
          { id: 'novo', label: 'Novo', icon: '＋' },
        ].map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              style={S.navBtn}
              onClick={() => setTab(item.id)}
            >
              <span
                style={{
                  fontSize: item.id === 'novo' ? 22 : 18,
                  ...(item.id === 'novo' && active
                    ? { filter: `drop-shadow(0 0 6px ${C.accent})` }
                    : {}),
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  ...S.navLabel,
                  color: active ? C.accentLight : C.muted,
                }}
              >
                {item.label}
              </span>
              {active && (
                <div
                  style={{
                    width: 20,
                    height: 2,
                    borderRadius: 2,
                    background: C.accent,
                    marginTop: 1,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function EmptyState({ msg }) {
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <p style={{ fontSize: 40 }}>🌿</p>
      <p style={{ color: '#7B82A8', marginTop: 8, fontSize: 14 }}>{msg}</p>
    </div>
  );
}
