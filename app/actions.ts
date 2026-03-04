"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

// 1. SINCRONIZAÇÃO DO BANCO (SEED)
export async function seedDatabase() {
  let prof = await prisma.professor.findUnique({ where: { email: "admin@email.com" } });
  
  if (!prof) {
    prof = await prisma.professor.create({
      data: { nome: "Professor Admin", email: "admin@email.com", senha: "123" }
    });
  }

  const alunoTeste = await prisma.aluno.findUnique({ where: { login: "aluno.teste" } });
  
  if (!alunoTeste) {
    await prisma.aluno.create({
      data: { 
        nome: "Aluno de Teste", 
        login: "aluno.teste", 
        senhaTemp: "PROVA2026", 
        isActive: true, 
        professorId: prof.id 
      }
    });
  }
  return prof.id;
}

// 2. LOGINS
export async function loginProfessor(email: string, senha: string) {
  await seedDatabase();
  const prof = await prisma.professor.findFirst({ where: { email, senha } });
  return prof ? { success: true } : { success: false };
}

export async function loginAluno(usuario: string, senha: string) {
  await seedDatabase();
  const aluno = await prisma.aluno.findFirst({ where: { login: usuario, senhaTemp: senha } });
  
  if (!aluno) return { success: false, message: "Usuário ou senha incorretos." };
  // Bloqueia o login se o professor desativou a conta
  if (!aluno.isActive) return { success: false, message: "Acesso bloqueado. Contate o professor." };
  
  return { success: true, alunoNome: aluno.nome, alunoLogin: aluno.login };
}

// 3. GESTÃO DE RESPOSTAS (HISTÓRICO POR ANO)
export async function salvarResposta(alunoLogin: string, numeroQuestao: string, acertou: boolean, ano: string) {
  try {
    const aluno = await prisma.aluno.findUnique({ where: { login: alunoLogin } });
    if (!aluno) return;

    await prisma.resposta.create({
      data: { 
        acertou, 
        questaoId: numeroQuestao, 
        ano: ano, 
        alunoId: aluno.id 
      }
    });
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
  }
}

export async function getHistoricoAluno(alunoLogin: string, ano: string) {
  try {
    const aluno = await prisma.aluno.findUnique({ 
      where: { login: alunoLogin },
      include: { 
        respostas: { 
          where: { ano: ano }, 
          orderBy: { createdAt: 'desc' }, 
          take: 10 
        } 
      }
    });
    return aluno?.respostas.map(r => ({ id: r.questaoId, acerto: r.acertou })) || [];
  } catch (error) {
    return []; 
  }
}

export async function getLastQuestionIndex(alunoLogin: string, ano: string) {
  try {
    const ultima = await prisma.resposta.findFirst({
      where: { aluno: { login: alunoLogin }, ano: ano },
      orderBy: { createdAt: 'desc' }
    });
    return ultima ? parseInt(ultima.questaoId) : 0;
  } catch (error) {
    return 0;
  }
}

// NOVA FUNÇÃO: Apaga o progresso do aluno em um ano específico
export async function resetarProvaAno(alunoLogin: string, ano: string) {
  try {
    const aluno = await prisma.aluno.findUnique({ where: { login: alunoLogin } });
    if (!aluno) return { success: false };

    await prisma.resposta.deleteMany({
      where: { alunoId: aluno.id, ano: ano }
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 4. GESTÃO DE ALUNOS (PAINEL DO PROFESSOR)
export async function getAlunos() {
  const profId = await seedDatabase();
  return await prisma.aluno.findMany({ where: { professorId: profId }, orderBy: { createdAt: 'desc' } });
}

export async function criarAluno(nome: string) {
  const profId = await seedDatabase();
  const partes = nome.toLowerCase().trim().split(' ');
  const login = `${partes[0]}.${Math.floor(Math.random() * 1000)}`;
  const senhaTemp = Math.random().toString(36).slice(-6).toUpperCase();
  
  await prisma.aluno.create({ 
    data: { nome, login, senhaTemp, professorId: profId! } 
  });
  revalidatePath('/professor');
}

export async function getEstatisticasAluno(alunoId: string) {
  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    include: { respostas: true }
  });

  if (!aluno) return null;

  const statsPorAno: Record<string, { acertos: number; erros: number; total: number }> = {};

  aluno.respostas.forEach((r) => {
    if (!statsPorAno[r.ano]) {
      statsPorAno[r.ano] = { acertos: 0, erros: 0, total: 0 };
    }
    statsPorAno[r.ano].total += 1;
    if (r.acertou) statsPorAno[r.ano].acertos += 1;
    else statsPorAno[r.ano].erros += 1;
  });

  return { nome: aluno.nome, login: aluno.login, stats: statsPorAno, totalRespostas: aluno.respostas.length };
}

// NOVA FUNÇÃO: Ativa ou Desativa o acesso do aluno
export async function alternarStatusAluno(alunoId: string, novoStatus: boolean) {
  await prisma.aluno.update({
    where: { id: alunoId },
    data: { isActive: novoStatus }
  });
  revalidatePath('/professor');
  return { success: true };
}