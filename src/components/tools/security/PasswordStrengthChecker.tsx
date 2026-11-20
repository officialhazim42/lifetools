import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Key } from 'lucide-react';

export const PasswordStrengthChecker: React.FC = () => {
  const [password, setPassword] = useState('Tr0ub4dor&3#Safe');
  const [showPassword, setShowPassword] = useState(false);

  // Entropy calculation
  const calculateEntropy = (pwd: string) => {
    if (!pwd) return 0;
    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 33;

    if (poolSize === 0) return 0;
    return Math.round(pwd.length * Math.log2(poolSize));
  };

  const entropy = calculateEntropy(password);

  // Estimated crack time based on 100 billion guesses / sec (modern GPU cluster)
  const getCrackTime = (bits: number) => {
    if (bits <= 0) return 'Instant';
    if (bits < 28) return 'Under a second';
    if (bits < 36) return 'A few seconds';
    if (bits < 45) return 'A few minutes';
    if (bits < 55) return 'Several hours';
    if (bits < 65) return 'A few months';
    if (bits < 75) return 'Several years';
    if (bits < 90) return 'Centuries';
    return 'Millions of years';
  };

  // Checklist
  const checks = [
    { label: 'At least 12 characters long', passed: password.length >= 12 },
    { label: 'Contains lowercase letters (a-z)', passed: /[a-z]/.test(password) },
    { label: 'Contains uppercase letters (A-Z)', passed: /[A-Z]/.test(password) },
    { label: 'Contains numerical digits (0-9)', passed: /[0-9]/.test(password) },
    { label: 'Contains special symbols (!@#$%^&*)', passed: /[^a-zA-Z0-9]/.test(password) },
    { label: 'No obvious sequential patterns (123, abc)', passed: !/(123|abc|qwerty|password|admin)/i.test(password) }
  ];

  const passedCount = checks.filter(c => c.passed).length;

  const getStrengthTier = () => {
    if (entropy < 30) return { label: 'Very Weak', color: 'text-rose-500', bg: 'bg-rose-500', barWidth: '20%' };
    if (entropy < 50) return { label: 'Weak', color: 'text-amber-500', bg: 'bg-amber-500', barWidth: '40%' };
    if (entropy < 70) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500', barWidth: '65%' };
    if (entropy < 90) return { label: 'Strong', color: 'text-emerald-500', bg: 'bg-emerald-500', barWidth: '85%' };
    return { label: 'Very Strong (Bulletproof)', color: 'text-cyan-500', bg: 'bg-cyan-500', barWidth: '100%' };
  };

  const strength = getStrengthTier();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Password Strength & Entropy Checker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Audit password complexity, estimate crack resistance, and measure information entropy with 100% client-side privacy.
        </p>
      </div>

      {/* Input Field */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Test Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Type or paste password to evaluate..."
              className="w-full text-xl font-mono px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Strength Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">Security Strength Rating:</span>
            <span className={`font-bold ${strength.color}`}>{strength.label}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength.bg}`}
              style={{ width: strength.barWidth }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Zero Network Transmission: Password analysis is evaluated solely within your local browser runtime.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Information Entropy
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {entropy} <span className="text-xs font-normal text-slate-400">bits</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {entropy >= 60 ? 'Resistant to brute-force' : 'Susceptible to GPU clusters'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Brute Force Crack Time
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {getCrackTime(entropy)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">At 100 billion guesses/sec</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Length & Characters
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {password.length} <span className="text-xs font-normal text-slate-400">chars</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {passedCount} of 6 security rules met
          </span>
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
          Security Criteria Analysis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {checks.map((c, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                c.passed
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              {c.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
