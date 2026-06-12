import React from 'react';

export const ModuleOverlay = ({ isOpen, close, module, t }) => {
    if (!isOpen || !module) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-term-bg/90 backdrop-blur-md"
                onClick={close}
            ></div>
            <div className="w-full max-w-3xl z-10 transition-all transform scale-100">
                <div className="brutalist-card bg-term-bg border-[6px] relative p-12">
                    <button
                        onClick={close}
                        className="absolute top-6 right-8 text-3xl font-black hover:text-term-accent transition-colors"
                    >
                        [CLOSE]
                    </button>

                    <div className="space-y-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.4em] opacity-40">VISION_MODULE_ELABORATION</span>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mt-4 group">
                                {module.title}<span className="text-term-accent group-hover:opacity-100 opacity-20 transition-opacity">_</span>
                            </h2>
                        </div>

                        <div className="border-t-4 border-term-border pt-8">
                            <p className="text-xl md:text-3xl font-bold leading-tight opacity-90 italic">
                                "{module.description}"
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 opacity-40">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                                <span className="text-sm font-bold uppercase">YAZHI_RFC_0{Math.floor(Math.random() * 9 + 1)}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                                <span className="text-sm font-bold uppercase">In_Development</span>
                            </div>
                        </div>

                        <button
                            onClick={close}
                            className="brutalist-button bg-term-text text-term-bg w-full py-6 text-xl font-black hover:bg-term-accent hover:text-black mt-8"
                        >
                            ACKNOWLEDGE_LOG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
