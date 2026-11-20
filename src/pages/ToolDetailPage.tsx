import React, { useEffect, useRef, Suspense } from 'react';
import { getToolById, TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ToolLayout } from '../components/common/ToolLayout';
import { useRecentTools } from '../context/RecentToolsContext';
import { Loader2, ArrowLeft } from 'lucide-react';

interface ToolDetailPageProps {
  toolId: string;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ toolId }) => {
  const tool = getToolById(toolId);
  const { recordToolUsage } = useRecentTools();
  const lastRecordedId = useRef<string | null>(null);

  useEffect(() => {
    if (tool && lastRecordedId.current !== tool.id) {
      lastRecordedId.current = tool.id;
      recordToolUsage(tool.id);
    }
  }, [tool, recordToolUsage]);

  if (!tool) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tool Not Found</h2>
        <p className="text-slate-500 text-sm">
          The requested utility does not exist or may have been renamed.
        </p>
        <a
          href="#/tools"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Tools</span>
        </a>
      </div>
    );
  }

  // Find related tool items
  const relatedToolsList = (tool.relatedTools || [])
    .map(id => TOOLS_REGISTRY.find(t => t.id === id))
    .filter((t): t is typeof TOOLS_REGISTRY[0] => t !== undefined);

  const ToolComponent = tool.component;

  return (
    <ToolLayout tool={tool} relatedToolsList={relatedToolsList}>
      <Suspense
        fallback={
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-mono">Initializing client-side engine...</span>
          </div>
        }
      >
        <ToolComponent />
      </Suspense>
    </ToolLayout>
  );
};
