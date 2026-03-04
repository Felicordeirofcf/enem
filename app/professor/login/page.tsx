"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginProfessor } from '../../actions';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginProfessor() {
  const [email, setEmail] = useState('admin@email.com');
  const [senha, setSenha] = useState('123');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro('');

    try {
      const res = await loginProfessor(email, senha);
      
      if (res.success) {
        // 1. Salva a autorização no navegador
        localStorage.setItem('is_professor', 'true');
        // 2. Redireciona para o painel de gestão
        router.push('/professor'); 
      } else {
        setErro('Credenciais inválidas. Verifique o e-mail e a senha.');
      }
    } catch (error) {
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-body p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="bg-blue-600 p-3 rounded-xl mb-4 text-white shadow-lg shadow-blue-100">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-6">Admin EnemSaaS</h1>

        {erro && (
          <div className="w-full bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@email.com"
            className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-600 text-sm font-medium transition-colors"
            required
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-600 text-sm font-medium transition-colors"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>Entrar no Painel <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}