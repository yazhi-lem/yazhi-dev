import React, { useState } from 'react';

export const ContactForm = ({ t, close }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('IDLE');

    const handleTransmit = (e) => {
        e.preventDefault();
        setStatus('SENDING...');
        setTimeout(() => {
            setStatus('SUCCESS');
            setTimeout(() => {
                if (close) close();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="pt-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic opacity-20">{t.formTitle.replace('// ', '')}</h2>

            {status === 'SUCCESS' ? (
                <div className="py-12 text-center">
                    <div className="text-6xl mb-4 text-term-accent font-black">⅄</div>
                    <div className="text-xl font-bold uppercase tracking-widest">Broadcast_Received</div>
                    <div className="text-xs opacity-40 mt-2 italic font-bold uppercase tracking-[0.3em]">Protocol // Awaiting_Join</div>
                </div>
            ) : (
                <form onSubmit={handleTransmit} className="space-y-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Return_Address</label>
                        <input
                            type="email"
                            required
                            placeholder={t.formEmail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent border-2 border-term-border p-3 text-lg font-bold placeholder:opacity-20 outline-none focus:bg-term-accent focus:text-black transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Broadcast_Data</label>
                        <textarea
                            required
                            rows="3"
                            placeholder={t.formPlaceholder}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-transparent border-2 border-term-border p-3 text-lg font-bold placeholder:opacity-20 outline-none focus:bg-term-accent focus:text-black transition-colors resize-none"
                        />
                    </div>
                    <button
                        disabled={status !== 'IDLE'}
                        className={`brutalist-button w-full h-16 text-xl font-black italic ${status === 'IDLE' ? 'bg-term-accent text-black hover:bg-term-text hover:text-term-bg' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        {status === 'IDLE' ? t.formSubmit : status}
                    </button>
                </form>
            )}
        </div>
    );
};


