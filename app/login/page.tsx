"use client";

import { useState } from 'react';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Aqui no futuro você conectará com sua API/Banco de Dados
    // Simulando um carregamento para o visual ficar completo:
    setTimeout(() => {
      setIsLoading(false);
      // window.location.href = '/'; // Redirecionaria para o Dashboard
      alert('Login simulado com sucesso! Redirecionando para o painel...');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body text-slate-900">
      
      {/* Cabeçalho do Login */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm mb-4">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-heading font-bold tracking-tight text-slate-900">
          Acesse seu painel
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Plataforma de gestão do Banco de Questões ENEM
        </p>
      </div>

      {/* Card do Formulário */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card border border-slate-200 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Campo E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                E-mail ou Usuário
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 bg-white placeholder-slate-400"
                  placeholder="professor@email.com"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 bg-white placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Lembrar-me e Esqueci a Senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {/* Botão de Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Autenticando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Entrar no Painel
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Rodapé discreto */}
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>&copy; 2026 Plataforma ENEM. Acesso restrito.</p>
      </div>
    </div>
  );
}