import React, { useState } from 'react';
import { MessageCircle, X, Send, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { BANK_DETAILS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const WhatsAppConcierge: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    t('whatsapp_prompt_1') || 'Hello! I would like to inquire about the Sigiriya & Yala Luxury Tour.',
    t('whatsapp_prompt_2') || 'I need a private chauffeur quote with Mercedes S-Class for 5 days.',
    t('whatsapp_prompt_3') || 'I want to check domestic seaplane charter availability to Kandy.',
    t('whatsapp_prompt_4') || 'Hello, I submitted a bank transfer and would like an audit update.',
  ];

  const handleSendWhatsApp = (textToSend?: string) => {
    const message = textToSend || customMsg || 'Hello Premier Tour Concierge, I would like to customize a luxury itinerary.';
    const encoded = encodeURIComponent(message);
    const targetUrl = `${BANK_DETAILS.whatsappDirectLink}?text=${encoded}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div id="whatsapp-concierge-widget" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Concierge Popover Dialogue */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
                  Premier WhatsApp Desk
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </h4>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  Typically replies in &lt; 5 mins
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[var(--background)] space-y-3">
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Direct 24/7 VIP Travel Specialist
              </div>
              Chat directly with our operations desk for bespoke itinerary quotes, flight charters, and wire verification updates.
            </div>

            {/* Quick Prompt Buttons */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Inquiries
              </p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendWhatsApp(prompt)}
                  className="w-full text-left p-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 rounded-lg border border-slate-200 hover:border-emerald-300 text-xs transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-[var(--primary-dark)] shrink-0 ml-1.5" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
                  className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  onClick={() => handleSendWhatsApp()}
                  className="px-3.5 py-2 bg-[var(--primary-dark)] hover:bg-[var(--primary)] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        id="open-whatsapp-concierge-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[var(--primary-dark)] hover:bg-[var(--primary)] text-white rounded-full shadow-xl hover:shadow-[var(--primary-dark)]/30 transition-all duration-200 cursor-pointer border border-emerald-400/30 font-medium text-xs tracking-wide"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        </div>
        <span className="font-bold tracking-tight">WhatsApp Concierge</span>
      </button>
    </div>
  );
};
