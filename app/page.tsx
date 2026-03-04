"use client";

import { BookOpen, Users, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-body">
      {/* Logo Centralizada */}
      <div className="flex items-center mb-12">
        <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm mr-3">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
          EnemSaaS
        </h1>
      </div>

      {/* Grid de Seleção de Acesso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* Card para o Professor */}
        <Link href="/professor/login" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">Área do Professor</h2>
          <p className="text-slate-500 text-sm mb-6">Gerencie seus alunos, gere acessos e acompanhe o progresso das turmas.</p>
          <div className="flex items-center text-blue-600 font-medium text-sm">
            Acessar Painel
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card para o Aluno */}
        <Link href="/aluno/login" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all">
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">Portal do Estudante</h2>
          <p className="text-slate-500 text-sm mb-6">Acesse o banco de questões completo do ENEM (2015-2025) e comece a estudar.</p>
          <div className="flex items-center text-emerald-600 font-medium text-sm">
            Entrar para Estudar
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

      </div>

      <p className="mt-12 text-slate-400 text-xs">
        &copy; 2026 EnemSaaS - Plataforma de Estudos para o ENEM.
      </p>
    </div>
  );
}