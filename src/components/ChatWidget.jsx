import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Minimize2,
  Maximize2,
  RefreshCw,
  AlertCircle,
  Plane,
} from 'lucide-react';

const WEBHOOK_URL =
  'https://santiagorendonr.app.n8n.cloud/webhook/f8e68882-0ad1-42c4-a5c6-6183dc253989';

const QUICK_PROMPTS = [
  '¿Cuáles son los vuelos críticos con cupos agotados?',
  '¿Cuál es el total de ingresos por equipaje (ancillaries)?',
  '¿Cómo está la tasa de check-in actualmente?',
  '¿Hay pagos rechazados que requieran atención?',
];

export default function ChatWidget({ reservas = [], vuelos = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    return 'session-' + Math.random().toString(36).substring(2, 9);
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola! Soy el Copiloto de Inteligencia Artificial de Nexus Aero. ¿En qué puedo asistirte con las operaciones aéreas, reservas o vuelos hoy?',
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al final al recibir o enviar mensajes
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Enfocar input al abrir
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Enviar mensaje al webhook de n8n
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessageId = Date.now();
    const newUserMessage = {
      id: userMessageId,
      sender: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Preparamos payload compatible con n8n Chat Trigger / Webhook
      const payload = {
        message: text,
        chatInput: text,
        query: text,
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        context: {
          totalVuelos: vuelos.length,
          vuelosCriticos: vuelos.filter((v) => Number(v.asientos_disponibles) === 0).length,
          totalReservas: reservas.length,
        },
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      let botReply = '';

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: El webhook de n8n no respondió correctamente.`
        );
      }

      // Intentar parsear respuesta JSON o texto
      const responseContentType = response.headers.get('content-type') || '';
      if (responseContentType.includes('application/json')) {
        const data = await response.json();
        // n8n suele retornar { output: "..." } o { response: "..." } o { text: "..." } o { message: "..." }
        if (typeof data === 'string') {
          botReply = data;
        } else if (data.output) {
          botReply = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
        } else if (data.response) {
          botReply = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
        } else if (data.text) {
          botReply = typeof data.text === 'string' ? data.text : JSON.stringify(data.text);
        } else if (data.message) {
          botReply = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
        } else if (Array.isArray(data) && data.length > 0) {
          botReply = data[0].output || data[0].text || data[0].message || JSON.stringify(data[0]);
        } else {
          botReply = JSON.stringify(data, null, 2);
        }
      } else {
        botReply = await response.text();
      }

      if (!botReply || botReply.trim() === '') {
        botReply = 'He procesado tu solicitud en el workflow de n8n con éxito.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error comunicándose con el webhook de n8n:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          isError: true,
          text:
            '⚠️ No se pudo obtener respuesta del webhook de n8n. Verifica que el workflow esté activado en n8n (toggle Active en ON) y que el nodo webhook responda.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: '¡Conversación reiniciada! ¿En qué puedo asistirte con las operaciones de la aerolínea?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Botón Flotante para Abrir el Chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #181A20 0%, #2B324E 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50px',
            boxShadow:
              '0 8px 30px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(99, 102, 241, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow =
              '0 12px 35px rgba(0, 0, 0, 0.35), 0 0 0 3px rgba(99, 102, 241, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow =
              '0 8px 30px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(99, 102, 241, 0.3)';
          }}
          title="Abrir Copiloto de IA N8N"
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Sparkles size={16} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Nexus AI Agent
            </div>
            <div style={{ fontSize: '0.68rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  display: 'inline-block',
                }}
              />
              N8N Conectado
            </div>
          </div>
        </button>
      )}

      {/* Ventana de Chat Expandible */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: isMinimized ? '340px' : '410px',
            height: isMinimized ? '58px' : '620px',
            maxHeight: 'calc(100vh - 48px)',
            maxWidth: 'calc(100vw - 32px)',
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow:
              '0 16px 40px -8px rgba(18, 22, 33, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            transition: 'height 0.25s ease, width 0.25s ease',
          }}
        >
          {/* Header del Chat */}
          <div
            style={{
              background: 'linear-gradient(135deg, #141724 0%, #1E2337 100%)',
              color: '#FFFFFF',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Nexus AI Agent</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      background: 'rgba(99, 102, 241, 0.25)',
                      color: '#C7D2FE',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontWeight: 600,
                    }}
                  >
                    n8n
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10B981',
                      display: 'inline-block',
                    }}
                  />
                  <span>En línea • Webhook Activo</span>
                </div>
              </div>
            </div>

            {/* Controles del Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={handleResetChat}
                title="Reiniciar conversación"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9499AD',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                }}
              >
                <RefreshCw size={15} />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Maximizar' : 'Minimizar'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9499AD',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                }}
              >
                {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9499AD',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Cuerpo del Chat (Visible solo si no está minimizado) */}
          {!isMinimized && (
            <>
              {/* Contenedor de Mensajes */}
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: '#F9FAFB',
                }}
              >
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isBot ? 'flex-start' : 'flex-end',
                        gap: '3px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: '8px',
                          maxWidth: '85%',
                          flexDirection: isBot ? 'row' : 'row-reverse',
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            background: isBot
                              ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                              : '#181A20',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            flexShrink: 0,
                          }}
                        >
                          {isBot ? <Sparkles size={13} /> : <User size={13} />}
                        </div>

                        {/* Burbuja de Mensaje */}
                        <div
                          style={{
                            padding: '11px 14px',
                            borderRadius: isBot
                              ? '16px 16px 16px 4px'
                              : '16px 16px 4px 16px',
                            background: isBot
                              ? msg.isError
                                ? '#FEF2F2'
                                : '#FFFFFF'
                              : 'linear-gradient(135deg, #181A20 0%, #2B324E 100%)',
                            color: isBot
                              ? msg.isError
                                ? '#B91C1C'
                                : '#181A20'
                              : '#FFFFFF',
                            fontSize: '0.85rem',
                            lineHeight: 1.45,
                            boxShadow: isBot
                              ? '0 2px 8px rgba(0, 0, 0, 0.04)'
                              : '0 2px 10px rgba(24, 26, 32, 0.15)',
                            border: isBot
                              ? msg.isError
                                ? '1px solid #FECACA'
                                : '1px solid rgba(0, 0, 0, 0.06)'
                              : 'none',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>

                      {/* Hora */}
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: '#9CA3AF',
                          margin: isBot ? '0 0 0 34px' : '0 34px 0 0',
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}

                {/* Indicador de "Escribiendo..." */}
                {isLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={13} />
                    </div>
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '16px 16px 16px 4px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        color: '#6366F1',
                        fontWeight: 600,
                      }}
                    >
                      <span className="pulse">Procesando en n8n...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Preguntas Sugeridas Rápidas */}
              <div
                style={{
                  padding: '8px 14px',
                  background: '#FFFFFF',
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                }}
              >
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    style={{
                      background: '#F4F2EE',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: '12px',
                      padding: '5px 10px',
                      fontSize: '0.72rem',
                      color: '#4B5563',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#EFF6FF';
                      e.currentTarget.style.color = '#2563EB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#F4F2EE';
                      e.currentTarget.style.color = '#4B5563';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Barra de Entrada de Texto */}
              <div
                style={{
                  padding: '12px 14px',
                  background: '#FFFFFF',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pregúntale al agente de IA (Enter para enviar)..."
                  rows={1}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    resize: 'none',
                    border: '1px solid #E5E7EB',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    fontSize: '0.84rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#F9FAFB',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366F1')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '12px',
                    background:
                      !inputMessage.trim() || isLoading
                        ? '#E5E7EB'
                        : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
                    boxShadow:
                      !inputMessage.trim() || isLoading
                        ? 'none'
                        : '0 3px 10px rgba(99, 102, 241, 0.35)',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                  title="Enviar mensaje"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
