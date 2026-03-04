"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, Target, User, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { getEstatisticasAluno } from "../../../actions";

export default function RelatorioAluno() {
  const params = useParams();
  const router = useRouter();
  const [alunoData, setAlunoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (params?.id) {
        const data = await getEstatisticasAluno(params.id as string);
        setAlunoData(data);
      }
      setIsLoading(false);
    };
    fetchStats();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!alunoData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Aluno não encontrado</h1>
        <button onClick={() => router.push('/professor')} className="text-blue-600 font-bold flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Painel
        </button>
      </div>
    );
  }

  const anosIds = Object.keys(alunoData.stats).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900 pb-20">
      {/* Header Operacional */}
      <header className="h-16 bg-white border-b flex items-center px-6 sticky top-0 z-20 shadow-sm">
        <button onClick={() => router.push('/professor')} className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Diretório
        </button>
      </header>

      <main className="max-w-[1000px] mx-auto p-6 lg:p-10">
        <div className="flex items-center space-x-4 mb-10">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-100">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{alunoData.nome}</h1>
            <p className="text-sm font-mono text-slate-500 mt-1">Login: {alunoData.login}</p>
          </div>
        </div>

        {anosIds.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Nenhum dado registrado</h3>
            <p className="text-slate-500 text-sm mt-2">Este aluno ainda não respondeu nenhuma questão.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anosIds.map((ano) => {
              const { acertos, erros, total } = alunoData.stats[ano];
              const aproveitamento = Math.round((acertos / total) * 100);

              return (
                <div key={ano} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <span className="font-black text-xl text-slate-800">ENEM {ano}</span>
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                      <Target className="h-3 w-3 mr-1" /> {aproveitamento}%
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500">Respondidas</span>
                      <span className="text-lg font-black text-slate-700">{total}</span>
                    </div>
                    
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: `${aproveitamento}%` }}></div>
                      <div className="bg-red-400 h-full" style={{ width: `${100 - aproveitamento}%` }}></div>
                    </div>

                    <div className="flex justify-between text-xs font-bold pt-2">
                      <span className="flex items-center text-emerald-600"><CheckCircle2 className="h-4 w-4 mr-1" /> {acertos} Acertos</span>
                      <span className="flex items-center text-red-500"><XCircle className="h-4 w-4 mr-1" /> {erros} Erros</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}