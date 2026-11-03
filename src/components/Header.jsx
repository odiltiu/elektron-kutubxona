import React from 'react';
import { BookOpen, QrCode, Sparkles, PlusCircle } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenScanner, onOpenAi, onOpenAddBook }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo va Tizim nomi */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Smart Kutubxona</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  2026 Pro
                </span>
              </div>
              <p className="text-xs text-slate-500">Talabalar va kitoblar hisobi tizimi</p>
            </div>
          </div>

          {/* Asosiy navigatsiya tablari */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Boshqaruv
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📚 Kitoblar fondi
            </button>
            <button
              onClick={() => setActiveTab('borrows')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'borrows'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔄 Ijaralar va Qaytarish
            </button>
          </nav>

          {/* Tezkor amallar (Skaner, AI, Yangi kitob) */}
          <div className="flex items-center gap-2">
            
            {/* Skaner apparati / QR kod o'quvchi */}
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all border border-slate-200"
              title="QR skaner apparatidan kitobni o'qitish"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">QR Skaner</span>
            </button>

            {/* AI Kutubxonachi yordamchisi */}
            <button
              onClick={onOpenAi}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-purple-700 rounded-xl text-sm font-medium transition-all border border-purple-200/60 shadow-sm"
              title="Sun'iy intellekt yordamchisi"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">AI Yordamchi</span>
            </button>

            {/* Yangi kitob qo'shish */}
            <button
              onClick={onOpenAddBook}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm shadow-emerald-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Kitob qo'shish</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
