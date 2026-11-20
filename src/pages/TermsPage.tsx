import React from 'react';
import { FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <SEO
        title="Terms of Use - LifeTools"
        description="Review the terms and conditions governing the use of the LifeTools utility platform."
      />

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3 border border-slate-200 dark:border-slate-700">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Terms of Use
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Effective Date: November 2026
        </p>
      </div>

      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using LifeTools ("the Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, you should discontinue use of the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Permitted Use & Free License
          </h2>
          <p>
            LifeTools provides all digital utilities free of charge for personal, educational, research, and commercial purposes. You may use the outputs, formatted documents, processed images, generated passwords, and QR codes freely without royalty obligations.
          </p>
        </section>

        <section className="space-y-3 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            3. Health & Financial Disclaimers
          </h2>
          <p className="text-amber-800 dark:text-amber-200/90">
            <strong>Calculators and Health Tools:</strong> Tools such as the BMI Calculator, Calorie Calculator, Loan Calculator, EMI Calculator, and Tax/GST Calculator are provided solely for informational and estimation purposes.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-200/90 text-xs">
            <li>Health calculations do not constitute medical advice or diagnosis. Always consult a qualified physician or healthcare professional.</li>
            <li>Financial calculations are mathematical models based on user-supplied variables. Consult a licensed financial planner or accountant before entering into binding debt or contracts.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Disclaimer of Warranties
          </h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. LifeTools does not warrant that calculations, conversions, or image manipulations are error-free or uninterrupted.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            5. Limitation of Liability
          </h2>
          <p>
            In no event shall LifeTools or its creator (@officialhazim42) be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use or inability to use the tools or reliance on results.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to revise or modify these Terms at any time. Continued use of LifeTools following the posting of modifications indicates your acknowledgment and acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
};
