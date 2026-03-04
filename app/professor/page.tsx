"use client";
import { useState, useEffect } from 'react';
import { Users, LogOut, Plus, Search, CheckCircle2, BookOpen, Loader2, TrendingUp, PowerOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAlunos, criarAluno, alternarStatusAluno } from '../actions';

export default function PainelProfessor() {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  const carregarAlunos = async () => {
    setIsLoading(true);
    try {
      const dados = await getAlunos();
      setAlunos(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isProf = localStorage.getItem('is_professor');
    if (!isProf) router.push('/professor/login');
    else carregarAlunos();
  }, [router]);

  const handleCriarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    setIsCreating(true);
    await criarAluno(novoNome);
    setNovoNome('');
    setIsModalOpen(false);
    await carregarAlunos();
    setIsCreating(false);
  };

  // NOVA FUNÇÃO: Alternar bloqueio do aluno
  const handleToggleStatus = async (alunoId: string, statusAtual: boolean) => {
    await alternarStatusAluno(alunoId, !statusAtual);
    await carregarAlunos(); // Atualiza a tabela imediatamente
  };

  const copiarCredenciais = (login: string, senhaTemp: string) => {
    const texto = `Olá! Seu acesso ao EnemSaaS:\nLogin: ${login}\nSenha: ${senhaTemp}`;
    navigator.clipboard.writeText(texto);
    setCopiedText(login);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const alunosFiltrados = alunos.filter(a => a.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900">
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <BookOpen className="text-blue-600 h-6 w-6" />
          <span className="font-black text-lg tracking-tight">EnemSaaS</span>
          <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest ml-2">Gestão</span>
        </div>
        <button onClick={() => { localStorage.clear(); router.push('/'); }} className="flex items-center text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">
          <LogOut className="h-4 w-4 mr-2" /> Sair do Painel
        </button>
      </header>

      <main className="max-w-[1200px] mx-auto p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Alunos Matriculados</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Gerencie acessos e monitore o engajamento da turma.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            <Plus className="h-5 w-5 mr-2" />
            Novo Aluno
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users className="h-6 w-6" /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total de Alunos</p>
              <p className="text-3xl font-black">{alunos.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp className="h-6 w-6" /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status da Plataforma</p>
              <p className="text-3xl font-black text-emerald-600">Ativa</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-800">Diretório de Acesso</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por nome..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Nome do Aluno</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Login</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Senha Provisória</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" /></td></tr>
                ) : alunosFiltrados.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">Nenhum aluno encontrado.</td></tr>
                ) : (
                  alunosFiltrados.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{aluno.nome}</td>
                      <td className="px-6 py-4 font-mono text-slate-600">{aluno.login}</td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        <span className="bg-slate-100 px-2 py-1 rounded border text-xs">{aluno.senhaTemp}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {/* Botão para ativar/desativar com visual dinâmico */}
                        <button 
                          onClick={() => handleToggleStatus(aluno.id, aluno.isActive)}
                          className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${aluno.isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'}`}
                        >
                          {aluno.isActive ? <><CheckCircle2 className="w-3 h-3 mr-1"/> Ativo</> : <><PowerOff className="w-3 h-3 mr-1"/> Bloqueado</>}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => router.push(`/professor/aluno/${aluno.id}`)}
                          className="text-slate-600 hover:text-slate-900 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-all"
                        >
                          Ver Relatório
                        </button>
                        <button 
                          onClick={() => copiarCredenciais(aluno.login, aluno.senhaTemp)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all"
                        >
                          {copiedText === aluno.login ? 'Copiado!' : 'Copiar Acesso'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de Criação (Mantido sem alterações) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Matricular Aluno</h3>
            <p className="text-slate-500 text-sm mb-6">O sistema irá gerar um login e senha únicos automaticamente.</p>
            
            <form onSubmit={handleCriarAluno}>
              <div className="mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-blue-600 outline-none transition-all font-medium"
                />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">Cancelar</button>
                <button type="submit" disabled={isCreating} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center">
                  {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Criar Acesso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}