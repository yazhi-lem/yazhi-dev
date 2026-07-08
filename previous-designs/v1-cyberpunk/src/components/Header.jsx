import { Sun, Moon } from 'lucide-react';

export const Header = ({ lang, setLang, theme, setTheme, t }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-8 px-4">
        <div className="flex flex-col select-none relative">
            <div className="h-20 md:h-24 flex items-center relative">
                {/* Symbol */}
                <div className="logo-animate absolute left-0 text-7xl md:text-8xl font-black tracking-tighter leading-none z-20">
                    ⅄<span className="text-term-accent">.</span>
                </div>

                {/* Text */}
                <div className="text-reveal-animate absolute left-0 text-6xl md:text-7xl font-black tracking-widest leading-none opacity-0">
                    YAZHI<span className="text-term-accent">_</span>
                </div>
            </div>
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-20 mt-4">
                Systems_Autonomy // Node_01
            </span>

        </div>

        <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
                {['en', 'ta', 'ml', 'hi', 'te', 'kn'].map((l) => (
                    <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`brutalist-button text-xs ${lang === l ? 'active' : ''}`}
                    >
                        {l}
                    </button>
                ))}
            </div>

            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="brutalist-button p-2 flex items-center justify-center bg-term-text text-term-bg hover:bg-term-accent hover:text-black"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        </div>
    </div>
);


