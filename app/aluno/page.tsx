"use client";
import { useState, useEffect, useMemo } from 'react';
import { BookOpen, LogOut, ChevronRight, Filter, Loader2, AlertCircle, CheckCircle2, XCircle, Search, Clock, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { salvarResposta, getHistoricoAluno, getLastQuestionIndex, resetarProvaAno } from '../actions';

const ANOS_COMPLETOS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

export default function AreaQuestoes() {
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [alunoNome, setAlunoNome] = useState('');
  
  const [historico, setHistorico] = useState<any[]>([]);
  const [stats, setStats] = useState({ acertos: 0, erros: 0, total: 0 });
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedDiscipline, setSelectedDiscipline] = useState('Todas');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const router = useRouter();

  // Relógio do Simulado
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isLoading && !hasAnswered) {
        setTempoSegundos(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading, hasAnswered]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const nome = localStorage.getItem('aluno_nome');
    const login = localStorage.getItem('aluno_login');
    if (!nome || !login) router.push('/aluno/login');
    else setAlunoNome(nome);
  }, [router]);

  const fetchQuestions = async (year: string) => {
    setIsLoading(true); setLoadProgress(0); setAllQuestions([]);
    setStats({ acertos: 0, erros: 0, total: 0 });
    setTempoSegundos(0); // Zera o cronômetro ao mudar de prova
    const login = localStorage.getItem('aluno_login') || '';
    
    try {
      let fetched: any[] = [];
      let offset = 0;
      let hasMore = true;
      while (hasMore) {
        const res = await fetch(`https://api.enem.dev/v1/exams/${year}/questions?limit=50&offset=${offset}`);
        const data = await res.json();
        const batch = Array.isArray(data) ? data : (data.questions || []);
        if (batch.length === 0) hasMore = false;
        else {
          fetched = [...fetched, ...batch];
          offset += batch.length;
          setLoadProgress(Math.min(Math.round((fetched.length / 180) * 100), 95));
          if (batch.length < 50) hasMore = false;
        }
      }

      const lastIndex = await getLastQuestionIndex(login, year);
      const historicoPorAno = await getHistoricoAluno(login, year);

      setAllQuestions(fetched);
      setHistorico(historicoPorAno); 
      setCurrentQuestionIndex(lastIndex); 
      
      setLoadProgress(100);
      setTimeout(() => { setIsLoading(false); }, 300);
    } catch (e) { setIsLoading(false); setAllQuestions([]); }
  };

  useEffect(() => { fetchQuestions(selectedYear); }, [selectedYear]);

  useEffect(() => {
    let res = Array.isArray(allQuestions) ? [...allQuestions] : [];
    if (selectedDiscipline !== 'Todas') res = res.filter(q => q.discipline === selectedDiscipline);
    if (searchKeyword.trim()) res = res.filter(q => q.context?.toLowerCase().includes(searchKeyword.toLowerCase()));
    
    setFilteredQuestions(res); 
    setHasAnswered(false); 
    setSelectedLetter(null);
  }, [allQuestions, selectedDiscipline, searchKeyword]);

  const handleResponder = async () => {
    if (!currentQuestion) return;
    const correta = currentQuestion.alternatives.find((a: any) => a.isCorrect);
    const acertou = selectedLetter === correta.letter;
    const login = localStorage.getItem('aluno_login') || '';

    const numeroQuestao = (currentQuestionIndex + 1).toString();
    await salvarResposta(login, numeroQuestao, acertou, selectedYear);

    setStats(p => ({ 
      ...p, 
      acertos: acertou ? p.acertos + 1 : p.acertos, 
      erros: !acertou ? p.erros + 1 : p.erros, 
      total: p.total + 1 
    }));

    setHistorico(p => [{ id: numeroQuestao, acerto: acertou }, ...p].slice(0, 10));
    setHasAnswered(true);
  };

  const handleResetarProva = async () => {
    if (!confirm(`Tem certeza que deseja apagar todo o seu progresso da prova do ENEM ${selectedYear}? Isso não pode ser desfeito.`)) return;
    setIsResetting(true);
    const login = localStorage.getItem('aluno_login') || '';
    
    await resetarProvaAno(login, selectedYear);
    
    // Limpa a tela na mesma hora
    setStats({ acertos: 0, erros: 0, total: 0 });
    setHistorico([]);
    setCurrentQuestionIndex(0);
    setHasAnswered(false);
    setSelectedLetter(null);
    setTempoSegundos(0);
    setIsResetting(false);
  };

  const disciplines = useMemo(() => {
    if (!allQuestions || allQuestions.length === 0) return ['Todas'];
    return ['Todas', ...Array.from(new Set(allQuestions.map(q => q.discipline).filter(Boolean)))];
  }, [allQuestions]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const aproveitamento = stats.total > 0 ? Math.round((stats.acertos / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900">
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-2"><BookOpen className="text-blue-600" /><span className="font-bold">EnemSaaS</span></div>
        <div className="flex items-center space-x-6">
          {/* Cronômetro */}
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-mono text-sm font-bold shadow-inner">
            <Clock className="h-4 w-4" />
            <span>{formatTime(tempoSegundos)}</span>
          </div>
          <div className="hidden md:block text-xs font-bold text-slate-500 uppercase">Olá, {alunoNome}</div>
          <button onClick={() => {localStorage.clear(); router.push('/');}}><LogOut className="h-5 w-5 text-slate-400 hover:text-red-500 transition-colors" /></button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        <aside className="w-full lg:w-72 p-6 bg-white border-r space-y-6">
          <div className="flex items-center font-bold text-sm border-b pb-2"><Filter className="h-4 w-4 mr-2" /> Filtros da Prova</div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2 tracking-widest">Ano do ENEM</label>
            <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} className="w-full border p-2.5 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
              {ANOS_COMPLETOS.map(a => <option key={a} value={a}>ENEM {a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2 tracking-widest">Matéria</label>
            <select value={selectedDiscipline} onChange={e=>setSelectedDiscipline(e.target.value)} className="w-full border p-2.5 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
              {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          {/* Botão de Resetar Progresso */}
          <div className="pt-4 border-t">
            <button 
              onClick={handleResetarProva} 
              disabled={isResetting || isLoading}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 p-3 rounded-xl text-xs font-bold flex items-center justify-center transition-all disabled:opacity-50"
            >
              {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><RotateCcw className="h-4 w-4 mr-2" /> Reiniciar Prova {selectedYear}</>}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <Loader2 className="animate-spin text-blue-600 mb-4 h-10 w-10" />
              <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden mb-2"><div className="bg-blue-600 h-full transition-all duration-300" style={{width:`${loadProgress}%`}}></div></div>
              <p className="text-sm font-bold text-slate-500">Sincronizando Prova {selectedYear} ({loadProgress}%)</p>
            </div>
          ) : currentQuestion ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
              <div className="prose mb-8 text-slate-700 leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: currentQuestion.context }} />
              {currentQuestion.files?.map((f:any, i:any) => <img key={i} src={f} className="mb-8 rounded-xl border mx-auto max-w-full shadow-sm" />)}
              <div className="font-bold mb-8 text-lg text-slate-900" dangerouslySetInnerHTML={{ __html: currentQuestion.alternativesIntroduction }} />
              <div className="space-y-3">
                {currentQuestion.alternatives.map((alt: any) => {
                  let s = "w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-4 ";
                  if (!hasAnswered) s += selectedLetter === alt.letter ? "border-blue-600 bg-blue-50 shadow-sm" : "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                  else s += alt.isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-900" : (selectedLetter === alt.letter ? "border-red-500 bg-red-50 text-red-900" : "opacity-40 border-slate-100");
                  return <button key={alt.letter} disabled={hasAnswered} onClick={()=>setSelectedLetter(alt.letter)} className={s}><span className="font-bold text-blue-600 min-w-[24px]">{alt.letter})</span><span dangerouslySetInnerHTML={{__html:alt.text}}/></button>
                })}
              </div>
              <div className="mt-10 pt-6 border-t flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">Questão {currentQuestionIndex+1} de {filteredQuestions.length}</span>
                <div className="space-x-3">
                  {!hasAnswered ? <button onClick={handleResponder} disabled={!selectedLetter} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-200 transition-all shadow-lg shadow-blue-100">Responder</button> : <button onClick={()=>{setCurrentQuestionIndex(i=>i+1); setHasAnswered(false); setSelectedLetter(null);}} className="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold flex items-center hover:bg-slate-800 transition-all shadow-lg">Próxima <ChevronRight className="ml-2 h-4 w-4"/></button>}
                </div>
              </div>
            </div>
          ) : <div className="text-center p-20 bg-white border-dashed border-2 rounded-2xl"><AlertCircle className="h-12 w-12 text-slate-200 mx-auto mb-4" /><p className="text-slate-500">Nenhuma questão encontrada.</p></div>}
        </main>

        <aside className="w-full lg:w-80 p-6 bg-white border-l space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
            <div className="text-xs font-bold uppercase opacity-80 mb-1 tracking-widest">Aproveitamento</div>
            <div className="text-4xl font-black mb-2">{aproveitamento}%</div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden"><div className="bg-white h-full transition-all duration-700" style={{width:`${aproveitamento}%`}}></div></div>
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Atividade Recente</div>
            <div className="space-y-3">
              {historico.length === 0 ? <p className="text-xs text-slate-400 italic">Nenhuma resposta gravada...</p> : historico.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-right duration-300">
                  <span className="text-xs font-bold text-slate-600">Questão {h.id}</span>
                  {h.acerto ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}