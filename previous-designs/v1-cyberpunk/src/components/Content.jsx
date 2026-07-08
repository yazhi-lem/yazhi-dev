import React from 'react';

export const Content = ({ t, openModule }) => (
    <div className="space-y-24 px-4">
        <header className="border-b-4 border-term-border pb-16">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                {t.title}
            </h1>
            <p className="mt-8 text-lg md:text-2xl font-bold uppercase tracking-tight opacity-70 max-w-xl leading-tight">
                {t.tagline}
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-12">
                <section>
                    <div className="flex gap-4 items-baseline mb-6">
                        <span className="text-4xl font-black opacity-20 italic">01</span>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">{t.missionTitle.replace('// ', '')}</h2>
                    </div>
                    <p className="text-2xl md:text-4xl font-bold leading-tight tracking-tight">
                        {t.missionBody}
                    </p>
                </section>

                <section>
                    <div className="flex gap-4 items-baseline mb-6">
                        <span className="text-4xl font-black opacity-20 italic">02</span>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">{t.visionTitle.replace('// ', '')}</h2>
                    </div>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed opacity-80">
                        {t.visionBody}
                    </p>
                </section>

                <section className="p-8 bg-term-text text-term-bg">
                    <div className="flex gap-4 items-baseline mb-6">
                        <span className="text-4xl font-black opacity-40 italic text-term-bg">03</span>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">{t.opensourceTitle.replace('// ', '')}</h2>
                    </div>
                    <p className="text-xl md:text-2xl font-bold leading-tight">
                        {t.opensourceBody}
                    </p>
                </section>
            </div>

            <div className="lg:col-span-4 space-y-12">
                <section className="border-l-4 border-term-border pl-8 pt-2">
                    <h2 className="text-xl font-black uppercase tracking-widest mb-8 opacity-40">
                        {t.valuesTitle.replace('// ', '')} // VISION_SYSTEM
                    </h2>
                    <ul className="space-y-8">
                        {t.values.map((v, i) => (
                            <li
                                key={i}
                                onClick={() => openModule(i)}
                                className="flex flex-col gap-1 group border-b border-term-border/5 pb-4 last:border-0 cursor-pointer hover:bg-term-accent/5 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold opacity-30 font-mono tracking-widest">MODULE_[0{i + 1}]</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-40 transition-opacity">[ VIEW_DETAILS ]</span>
                                </div>
                                <span className="text-2xl font-black uppercase tracking-tighter group-hover:text-term-accent transition-colors">
                                    {v}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="p-8 border-2 border-term-border border-dashed opacity-40 hover:opacity-100 transition-opacity">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Internal_Log</h3>
                    <p className="text-[11px] font-bold leading-relaxed uppercase">
                        Protocol: Open_Knowledge<br />
                        Node: South_Asia_Collective<br />
                        Licensing: Copyleft_2026<br />
                        Status: Fully_Autonomous
                    </p>
                </div>
            </div>
        </div>
    </div>
);
