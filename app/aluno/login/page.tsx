"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAluno } from '../../actions';
import { BookOpen, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [u, setU] = useState('');
  const [s, setS] = useState('');
  const [l, setL] = useState(false);
  const router = useRouter();

  const handle = async (e: any) => {
    e.preventDefault();
    setL(true);
    const res = await loginAluno(u, s);
    if (res.success) {
      localStorage.setItem('aluno_nome', res.alunoNome!);
      localStorage.setItem('aluno_login', res.alunoLogin!); // Crucial para o histórico
      router.push('/aluno');
    } else {
      alert(res.message);
      setL(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-body">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-slate-900">Portal do Aluno</h2>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <input type="text" placeholder="Usuário" value={u} onChange={e=>setU(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="Senha" value={s} onChange={e=>setS(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={l} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center items-center">
            {l ? <Loader2 className="animate-spin" /> : <>Entrar <ArrowRight className="ml-2 h-4 w-4"/></>}
          </button>
        </form>
      </div>
    </div>
  );
}