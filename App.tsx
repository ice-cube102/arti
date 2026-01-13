import React, { useState, useMemo, useEffect } from 'react';
import { Play, CheckCircle, Award, ChevronRight, ChevronLeft, Flag, Keyboard, User, Rocket, XCircle, HelpCircle, AlertCircle, Skull, Lock } from 'lucide-react';
import { questions } from './questions';
import { Question, ExamState, Difficulty } from './types';
import { MathText } from './components/MathText';

// --- Sub-Components ---

const IntroView = ({ onStart }: { onStart: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-black">
    <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 text-center text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
      
      <div className="mb-8 flex justify-center relative">
        <div className="bg-indigo-500/10 p-6 rounded-full ring-1 ring-indigo-400/30 animate-pulse-slow">
          <Award className="w-20 h-20 text-indigo-300" />
        </div>
        <div className="absolute -right-4 top-0 rotate-12 bg-green-400 text-green-900 font-bold px-3 py-1 rounded-lg text-xs shadow-lg border border-green-300">
          EASY MODE
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-200 drop-shadow-sm">
        중1 수학 문제
      </h1>
      <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full mb-8 opacity-50"></div>

      <p className="text-lg text-indigo-100/80 mb-10 leading-relaxed font-light">
        -진짜 쉽게 냈습니다(아님)<br/>
        <strong className="text-white">점수가 높으면 내가 님들 원하는거 해줄지도?</strong>
      </p>

      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
          <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">QUESTIONS</div>
          <div className="text-2xl font-bold">20<span className="text-sm font-normal text-white/40 ml-0.5">문항</span></div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
          <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">TIME LIMIT</div>
          <div className="text-2xl font-bold">90<span className="text-sm font-normal text-white/40 ml-0.5">분</span></div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10"></div>
          <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">MAX SCORE</div>
          <div className="text-2xl font-bold text-indigo-400">100<span className="text-xs align-top ml-1 text-purple-400">+?</span></div>
        </div>
      </div>

      <div className="space-y-3 mb-10">
         <div className="flex items-center justify-center gap-2 text-sm text-red-300 bg-red-900/20 py-2 px-4 rounded-full border border-red-500/20">
            <AlertCircle className="w-4 h-4" />
            <span>16~20번 Killer 문항 주의</span>
         </div>
      </div>

      <button 
        onClick={onStart}
        className="group relative w-full md:w-auto px-12 py-5 bg-white text-indigo-950 text-xl font-bold rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 mx-auto overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          도전 시작하기 <Play className="w-5 h-5 fill-current" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  </div>
);

const HiddenStageIntro = ({ onEnter }: { onEnter: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-red-600 animate-fadeIn">
    <div className="max-w-xl w-full text-center space-y-8">
      <div className="flex justify-center mb-8">
         <Skull className="w-32 h-32 animate-pulse" />
      </div>
      <h1 className="text-5xl font-black tracking-widest glitch-text" style={{ textShadow: '0 0 10px red' }}>
        WARNING
      </h1>
      <p className="text-xl text-red-400 font-mono border-t border-b border-red-900 py-6">
        놀라운 실력입니다.<br/>
        최상위권 문제를 해결하여 <br/>
        <span className="text-white font-bold">히든 스테이지</span>가 해금되었습니다.
      </p>
      <div className="p-6 bg-red-950/30 rounded-lg border border-red-900/50">
        <p className="text-red-300 mb-2 text-sm font-bold uppercase">Reward</p>
        <p className="text-2xl font-bold text-white">MAX SCORE 123점</p>
      </div>
      <button 
        onClick={onEnter}
        className="w-full py-5 bg-red-700 hover:bg-red-600 text-white font-bold text-xl rounded-none border-2 border-red-500 hover:border-white transition-all tracking-widest uppercase"
      >
        Enter The Abyss
      </button>
    </div>
  </div>
);

const QuestionCard = ({ 
  question, 
  userAnswer, 
  onAnswer, 
  qIndex, 
  onNext, 
  onPrev, 
  isLast 
}: { 
  question: Question, 
  userAnswer: string | number | undefined, 
  onAnswer: (val: string | number) => void,
  qIndex: number,
  onNext: () => void,
  onPrev: () => void,
  isLast: boolean
}) => {
  const [inputValue, setInputValue] = useState("");
  const isDevMode = inputValue === "ice_cube102";
  const isCursed = question.difficulty === Difficulty.Cursed;

  useEffect(() => {
    if (question.type === 'subjective') {
      setInputValue(userAnswer ? String(userAnswer) : "");
    }
  }, [question.id, userAnswer]);

  const handleSubjectiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onAnswer(val);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className={`text-sm font-bold tracking-wider ${isCursed ? 'text-red-500' : 'text-slate-400'}`}>
          {isCursed ? 'HIDDEN STAGE' : `QUESTION ${qIndex + 1} / 20`}
        </span>
        <div className="flex items-center gap-3">
            <span className={`text-sm font-extrabold px-3 py-1 rounded-lg ${isCursed ? 'bg-red-900 text-red-100' : 'bg-slate-100 text-slate-700'}`}>
              {question.points}점
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border shadow-sm
            ${question.difficulty === Difficulty.Concept ? 'bg-green-100 text-green-800 border-green-200' : ''}
            ${question.difficulty === Difficulty.Normal ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
            ${question.difficulty === Difficulty.Trap ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
            ${question.difficulty === Difficulty.Hard ? 'bg-orange-100 text-orange-800 border-orange-200' : ''}
            ${question.difficulty === Difficulty.VeryHard ? 'bg-red-100 text-red-800 border-red-200' : ''}
            ${question.difficulty === Difficulty.Killer ? 'bg-purple-900 text-white border-purple-800 animate-pulse' : ''}
            ${question.difficulty === Difficulty.Cursed ? 'bg-black text-red-500 border-red-600 animate-pulse shadow-red-500/20 shadow-lg' : ''}
            `}>
              {question.difficulty}
            </span>
        </div>
      </div>

      <div className={`rounded-3xl shadow-xl border p-8 md:p-12 mb-8 min-h-[400px] flex flex-col justify-center transition-colors
        ${isCursed ? 'bg-slate-900 border-red-900 shadow-red-900/20' : 'bg-white border-slate-200'}
      `}>
          <div className={`prose prose-xl max-w-none mb-10 font-medium leading-relaxed
            ${isCursed ? 'text-slate-200' : 'text-slate-800'}
          `}>
            <MathText text={question.question} />
          </div>
          
          {question.type === 'multiple-choice' ? (
            <div className="grid grid-cols-1 gap-4">
              {question.options?.map((option, idx) => (
                <button
                key={idx}
                onClick={() => onAnswer(idx)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group relative overflow-hidden
                  ${userAnswer === idx 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                    : 'border-slate-100 hover:border-indigo-300 hover:bg-slate-50'}
                `}
                >
                  <div className={`w-10 h-10 flex-shrink-0 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-colors
                    ${userAnswer === idx ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-600'}
                  `}>
                    {idx + 1}
                  </div>
                  <div className={`text-lg transition-colors ${userAnswer === idx ? 'text-indigo-900 font-bold' : 'text-slate-600'}`}>
                    <MathText text={option} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={`mt-4 p-8 rounded-2xl border
               ${isCursed ? 'bg-black/50 border-red-900' : 'bg-slate-50 border-slate-200'}
            `}>
              <label className={`block text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide
                ${isCursed ? 'text-red-400' : 'text-slate-500'}
              `}>
                <Keyboard className="w-4 h-4" /> 주관식 답안 입력
              </label>
              <input 
                type="text" 
                value={inputValue}
                onChange={handleSubjectiveChange}
                placeholder="정답을 입력하세요"
                className={`w-full p-6 text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-center
                  ${isDevMode ? 'border-purple-500 bg-purple-50 text-purple-700' : ''}
                  ${!isDevMode && isCursed ? 'bg-slate-800 border-red-800 text-white focus:ring-red-900 placeholder:text-slate-600' : ''}
                  ${!isDevMode && !isCursed ? 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100' : ''}
                `}
              />
              {isDevMode && (
                <div className="mt-3 text-purple-600 text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
                  <Rocket className="w-4 h-4" /> CHEAT CODE ACTIVATED
                </div>
              )}
            </div>
          )}
      </div>

      <div className="flex justify-between items-center">
          {!isCursed && (
             <button 
             onClick={onPrev}
             disabled={qIndex === 0}
             className="px-6 py-4 rounded-xl font-bold text-slate-500 disabled:opacity-30 hover:bg-white hover:shadow-md transition-all flex items-center gap-2"
             >
               <ChevronLeft className="w-5 h-5" /> 이전 문제
             </button>
          )}
          
          {isCursed ? (
            <button 
            onClick={onNext}
            className="w-full py-4 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-900/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 tracking-widest"
            >
              운명 확인하기 <Skull className="w-5 h-5" />
            </button>
          ) : isLast ? (
          <button 
          onClick={onNext}
          className="px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 ml-auto"
          >
            답안 제출 <Flag className="w-5 h-5" />
          </button>
          ) : (
            <button 
            onClick={onNext}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all flex items-center gap-2 ml-auto"
            >
              다음 문제 <ChevronRight className="w-5 h-5" />
            </button>
          )}
      </div>
    </div>
  );
};

const NameInputView = ({ onSubmit }: { onSubmit: (name: string) => void }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    
    if (!cleanName) {
      setError("이름을 입력해주세요.");
      return;
    }

    const takenNames = JSON.parse(localStorage.getItem('math_master_taken_names') || '[]');
    const banList = ['관리자', 'admin', 'test', '테스트', '홍길동', '이름', 'master'];
    
    // Developer backdoor: "ice_cube102" allows multiple submissions
    if (cleanName !== "ice_cube102" && takenNames.includes(cleanName)) {
      setError("이미 응시한 이력이 있는 이름입니다. 본명이 맞다면 뒤에 숫자를 붙여주세요.");
      return;
    }

    if (banList.includes(cleanName.toLowerCase())) {
       setError("사용할 수 없는 이름입니다.");
       return;
    }

    if (cleanName !== "ice_cube102") {
      localStorage.setItem('math_master_taken_names', JSON.stringify([...takenNames, cleanName]));
    }
    onSubmit(cleanName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 transform transition-all">
        <div className="text-center mb-8">
           <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
             <User className="w-10 h-10" />
           </div>
           <h2 className="text-3xl font-extrabold text-slate-800">시험 종료!</h2>
           <p className="text-slate-500 mt-2 font-medium">성적 분석표를 생성하기 위해<br/>본인의 이름을 정확히 입력해주세요.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <input 
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="이름 입력 (중복 불가)"
              className={`w-full p-5 border-2 rounded-2xl focus:outline-none focus:ring-4 text-center text-xl font-bold placeholder:font-normal transition-all
                ${error ? 'border-red-300 focus:ring-red-100 bg-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'}
              `}
              autoFocus
            />
            {error && (
              <div className="absolute top-full left-0 w-full mt-2 text-red-500 text-sm font-bold flex items-center justify-center gap-1 animate-bounce">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </div>
          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-bold shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-lg"
          >
            결과 확인 및 제출 <ChevronRight className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

const ExamView = ({ 
  timeLeft, 
  userAnswers, 
  currentQIndex, 
  setCurrentQIndex, 
  handleAnswer, 
  handleSubmit,
  isCursedMode 
}: {
  timeLeft: number;
  userAnswers: Record<number, string | number>;
  currentQIndex: number;
  setCurrentQIndex: (idx: number) => void;
  handleAnswer: (val: string | number) => void;
  handleSubmit: () => void;
  isCursedMode: boolean;
}) => {
  const currentQuestion = questions[currentQIndex];

  // Safety check to prevent crash if index out of bounds
  if (!currentQuestion) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading...</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-500
      ${isCursedMode ? 'bg-black' : 'bg-slate-50'}
    `}>
      {/* Sidebar - Hidden in Cursed Mode */}
      {!isCursedMode && (
        <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col h-[auto] md:h-screen sticky top-0 md:static z-20 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h2 className="font-extrabold text-slate-800 text-lg">OMR 카드</h2>
              <p className="text-xs text-slate-400 font-bold mt-1">20 Questions</p>
            </div>
            <div className={`font-mono font-black text-2xl tracking-tight ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-5 gap-3">
              {questions.slice(0, 20).map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== "";
                const isCurrent = currentQIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`
                      aspect-square rounded-xl text-sm font-bold flex items-center justify-center transition-all shadow-sm
                      ${isCurrent ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110 z-10' : 
                        isAnswered ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-white text-slate-300 border border-slate-200 hover:border-indigo-300'}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <Lock className="w-5 h-5 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-bold">Q21 LOCKED</p>
            </div>
          </div>
          <div className="p-5 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              최종 제출
            </button>
          </div>
        </aside>
      )}

      {/* Main Question Area */}
      <main className={`flex-1 p-4 md:p-10 overflow-y-auto h-[90vh] md:h-screen
         ${isCursedMode ? 'bg-black flex items-center' : 'bg-slate-50/50'}
      `}>
        <div className="w-full">
          <QuestionCard 
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswer={handleAnswer}
            qIndex={currentQIndex}
            onPrev={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
            onNext={() => {
              // Ensure we don't go out of bounds. 
              // If Cursed Mode, currentQIndex is 20 (max). 
              // If Normal Mode, max index is 19.
              const maxIndex = isCursedMode ? 20 : 19;
              if (currentQIndex < maxIndex) {
                setCurrentQIndex(currentQIndex + 1);
              } else {
                handleSubmit();
              }
            }}
            isLast={isCursedMode || currentQIndex === 19}
          />
        </div>
      </main>
    </div>
  );
};

const ResultView = ({ 
  resultData, 
  userName,
  showSolutionFor, 
  setShowSolutionFor,
  hasUnlockedHidden
}: { 
  resultData: any, 
  userName: string,
  showSolutionFor: number | null, 
  setShowSolutionFor: (id: number | null) => void,
  hasUnlockedHidden: boolean
}) => {
  const isDev = userName === "ice_cube102";
  const maxScore = hasUnlockedHidden ? 123 : 100;

  return (
    <div className={`min-h-screen p-4 md:p-10 ${hasUnlockedHidden ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className={`text-4xl font-extrabold mb-2 ${hasUnlockedHidden ? 'text-white' : 'text-slate-900'}`}>종합 분석 리포트</h1>
            <p className={`text-lg ${hasUnlockedHidden ? 'text-slate-400' : 'text-slate-500'}`}>수험생: <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{userName}</span></p>
          </div>
        </div>

        {/* Score Card */}
        <div className={`rounded-3xl shadow-xl border p-8 md:p-12 mb-10 overflow-hidden relative
          ${hasUnlockedHidden ? 'bg-black border-red-900 shadow-red-900/40' : 'bg-white border-slate-100'}
        `}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
            <div className={`md:col-span-4 flex flex-col justify-center items-center md:border-r pr-0 md:pr-10
              ${hasUnlockedHidden ? 'border-red-900' : 'border-slate-100'}
            `}>
               <div className={`text-sm font-bold uppercase tracking-widest mb-4 ${hasUnlockedHidden ? 'text-red-500' : 'text-slate-400'}`}>Final Score</div>
               <div className="relative">
                 <div className={`text-8xl font-black tracking-tighter ${hasUnlockedHidden ? 'text-white' : 'text-slate-900'}`}>{resultData.totalScore}</div>
                 <div className={`absolute -top-4 -right-12 font-bold px-3 py-1 rounded-full text-sm
                    ${hasUnlockedHidden ? 'bg-red-900 text-red-200' : 'bg-indigo-100 text-indigo-700'}
                 `}>/ {maxScore}</div>
               </div>
            </div>
            <div className="md:col-span-8">
              <h3 className={`font-bold mb-6 flex items-center gap-2 ${hasUnlockedHidden ? 'text-white' : 'text-slate-800'}`}>
                <Award className="w-5 h-5 text-indigo-500" /> 난이도별 정답률
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {Object.entries(resultData.difficultyBreakdown).map(([diff, data]: [string, any]) => (
                  <div key={diff} className={`rounded-2xl p-4 border flex flex-col justify-between h-32
                    ${hasUnlockedHidden ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}
                  `}>
                    <div className={`text-xs font-bold ${hasUnlockedHidden ? 'text-slate-400' : 'text-slate-400'}`}>{diff}</div>
                    <div className="mt-auto">
                      <div className={`text-2xl font-bold mb-1 ${hasUnlockedHidden ? 'text-white' : 'text-slate-800'}`}>{data.correct}<span className="text-sm text-slate-400 font-medium">/{data.total}</span></div>
                      <div className="w-full bg-slate-200/20 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ease-out
                          ${diff === Difficulty.Cursed ? 'bg-red-600' : diff === Difficulty.Killer ? 'bg-purple-600' : 'bg-indigo-500'}
                        `} style={{ width: `${(data.correct / data.total) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Details List (Only for Dev) */}
        {isDev ? (
          <div className="space-y-5">
             {resultData.details.map((item: any, idx: number) => (
              <div key={item.id} className={`rounded-2xl shadow-sm border transition-all duration-300
                ${hasUnlockedHidden ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}
                ${item.isCorrect ? 'opacity-90' : 'opacity-100'}
              `}>
                <div 
                  className={`p-6 flex items-center justify-between cursor-pointer rounded-2xl
                    ${hasUnlockedHidden ? 'hover:bg-white/10' : 'hover:bg-slate-50/80'}
                  `}
                  onClick={() => setShowSolutionFor(showSolutionFor === item.id ? null : item.id)}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm
                      ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                    `}>
                      {item.isCorrect ? <CheckCircle className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span className={`font-extrabold text-lg ${hasUnlockedHidden ? 'text-slate-200' : 'text-slate-800'}`}>Q.{idx + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold border
                          ${item.difficulty === Difficulty.Cursed ? 'bg-black text-red-500 border-red-500' : 'bg-slate-100 text-slate-500 border-slate-200'}
                        `}>{item.difficulty}</span>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-50/10 px-2 py-1 rounded-md">{item.points}점</span>
                      </div>
                      <div className={`text-base font-medium line-clamp-1 max-w-lg ${hasUnlockedHidden ? 'text-slate-400' : 'text-slate-600'}`}>
                        <MathText text={item.question} />
                      </div>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full transition-transform duration-300 ${showSolutionFor === item.id ? 'bg-slate-100 rotate-90 text-slate-600' : 'text-slate-300'}`}>
                     <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
                
                {/* Solution Dropdown */}
                {showSolutionFor === item.id && (
                  <div className={`p-8 border-t rounded-b-2xl animate-fadeIn ${hasUnlockedHidden ? 'bg-black/30 border-white/10' : 'bg-slate-50/50 border-slate-100'}`}>
                     <div className="mb-8">
                        <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">문제 원문</h4>
                        <div className={`p-6 rounded-2xl border text-lg leading-relaxed shadow-sm
                          ${hasUnlockedHidden ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}
                        `}>
                          <MathText text={item.question} />
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className={`p-5 rounded-2xl border-2 ${item.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                          <div className="text-xs font-bold uppercase mb-2 opacity-60 flex items-center gap-2 text-slate-600">
                            <User className="w-3 h-3" /> 내 답안
                          </div>
                          <div className="font-bold text-xl flex items-center gap-3">
                             {item.type === 'multiple-choice' ? (
                               item.userAnswer !== undefined ? (
                                 <>
                                   <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm shadow-sm">{(item.userAnswer as number) + 1}</span>
                                   <span className="text-slate-700"><MathText text={item.options[item.userAnswer as number]} /></span>
                                 </>
                               ) : <span className="text-slate-400 italic">미응답</span>
                             ) : (
                               <span className={`${item.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{item.userAnswer || "입력 없음"}</span>
                             )}
                          </div>
                        </div>
                        
                        <div className="p-5 rounded-2xl border-2 bg-indigo-50/50 border-indigo-100">
                          <div className="text-xs font-bold text-indigo-600 uppercase mb-2 opacity-60 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" /> 정답
                          </div>
                          <div className="font-bold text-xl text-indigo-900 flex items-center gap-3">
                              {item.type === 'multiple-choice' ? (
                                <>
                                  <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm shadow-indigo-200 shadow-md">{item.correctAnswer + 1}</span>
                                  <MathText text={item.options[item.correctAnswer]} />
                                </>
                              ) : (
                                <span className="text-indigo-700">{item.subjectiveAnswer}</span>
                              )}
                          </div>
                        </div>
                     </div>
                     
                     <div className={`rounded-2xl border p-6 shadow-sm ${hasUnlockedHidden ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                       <h4 className="flex items-center gap-2 font-bold text-indigo-600 mb-4 border-b border-slate-100 pb-3">
                         <HelpCircle className="w-5 h-5" /> 상세 풀이 및 해설
                       </h4>
                       <div className={`leading-8 text-lg ${hasUnlockedHidden ? 'text-slate-300' : 'text-slate-700'}`}>
                          <MathText text={item.solution} />
                       </div>
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center p-16 rounded-3xl border flex flex-col items-center justify-center
             ${hasUnlockedHidden ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}
          `}>
             <Lock className="w-16 h-16 mb-6 opacity-30" />
             <h3 className="text-2xl font-bold mb-2">상세 답안 비공개</h3>
             <p className="text-lg opacity-70">점수와 난이도별 정답률만 확인할 수 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [gameState, setGameState] = useState<ExamState>('intro');
  const [userAnswers, setUserAnswers] = useState<Record<number, string | number>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90 * 60); 
  const [showSolutionFor, setShowSolutionFor] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [hasUnlockedHidden, setHasUnlockedHidden] = useState(false);

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (gameState === 'exam' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('nameInput'); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStart = () => {
    setGameState('exam');
    setTimeLeft(90 * 60);
    setUserAnswers({});
    setCurrentQIndex(0);
    setUserName("");
    setHasUnlockedHidden(false);
  };

  const handleAnswer = (val: string | number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questions[currentQIndex].id]: val
    }));
  };

  const handleExamSubmit = () => {
    setGameState('nameInput');
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    
    // Check if any of Q16-20 (Very Hard & Killer) are correct
    // Indices for Q16-20 are 15, 16, 17, 18, 19
    const hardQuestions = questions.slice(15, 20);
    let anyCorrect = false;

    hardQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (q.type === 'multiple-choice') {
        if (ans === q.correctAnswer) anyCorrect = true;
      } else {
        const strAns = String(ans || "").replace(/\s+/g, '').toLowerCase();
        const correct = String(q.subjectiveAnswer || "").replace(/\s+/g, '').toLowerCase();
        if (strAns === correct || strAns === "ice_cube102") anyCorrect = true;
      }
    });

    if (anyCorrect) {
      setHasUnlockedHidden(true);
      setGameState('intro'); // Dummy transition to re-render clean
      setTimeout(() => setGameState('hiddenStage'), 0);
    } else {
      setGameState('result');
    }
  }

  const handleEnterHidden = () => {
    setCurrentQIndex(20); // Index 20 is Q21
    setGameState('exam');
  }

  // Score Calculation
  const resultData = useMemo(() => {
    let totalScore = 0;
    let correctCount = 0;
    
    // Calculate for all answered questions (including Q21 if answered)
    const details = questions.map(q => {
      // If we are in result view but haven't unlocked hidden, skip Q21 details in list
      if (!hasUnlockedHidden && q.id === 21) return null;

      const userAnswer = userAnswers[q.id];
      let isCorrect = false;

      if (q.type === 'multiple-choice') {
        isCorrect = userAnswer === q.correctAnswer;
      } else {
        const strAnswer = String(userAnswer || "").trim().toLowerCase();
        if (strAnswer === "ice_cube102" && (q.difficulty === Difficulty.Killer || q.difficulty === Difficulty.Cursed)) {
          isCorrect = true;
        } else {
           const cleanUser = strAnswer.replace(/\s+/g, '');
           const cleanCorrect = q.subjectiveAnswer ? q.subjectiveAnswer.replace(/\s+/g, '') : "";
           isCorrect = cleanUser === cleanCorrect;
        }
      }

      if (isCorrect) {
        totalScore += q.points;
        correctCount++;
      }
      return { ...q, isCorrect, userAnswer };
    }).filter(Boolean); // Remove nulls

    const difficultyBreakdown = details.reduce((acc: any, q: any) => {
      if (!acc[q.difficulty]) acc[q.difficulty] = { total: 0, correct: 0, score: 0 };
      acc[q.difficulty].total++;
      acc[q.difficulty].score += q.points;
      if (q.isCorrect) acc[q.difficulty].correct++;
      return acc;
    }, {} as Record<Difficulty, { total: number, correct: number, score: number }>);

    return { totalScore: parseFloat(totalScore.toFixed(1)), correctCount, details, difficultyBreakdown };
  }, [userAnswers, hasUnlockedHidden]);

  return (
    <>
      {gameState === 'intro' && <IntroView onStart={handleStart} />}
      {gameState === 'exam' && (
        <ExamView 
          timeLeft={timeLeft}
          userAnswers={userAnswers}
          currentQIndex={currentQIndex}
          setCurrentQIndex={setCurrentQIndex}
          handleAnswer={handleAnswer}
          handleSubmit={gameState === 'exam' && currentQIndex === 20 ? () => setGameState('result') : handleExamSubmit}
          isCursedMode={hasUnlockedHidden}
        />
      )}
      {gameState === 'nameInput' && (
        <NameInputView onSubmit={handleNameSubmit} />
      )}
      {gameState === 'hiddenStage' && (
        <HiddenStageIntro onEnter={handleEnterHidden} />
      )}
      {gameState === 'result' && (
        <ResultView 
          resultData={resultData}
          userName={userName}
          showSolutionFor={showSolutionFor}
          setShowSolutionFor={setShowSolutionFor}
          hasUnlockedHidden={hasUnlockedHidden}
        />
      )}
    </>
  );
}