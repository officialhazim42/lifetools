import React from 'react';
import { TEMPLATES_DATA } from '../../data/templatesData';
import { DocumentEditor } from './DocumentEditor';

interface TemplateRunnerProps {
  templateId: string;
}

export const TemplateRunner: React.FC<TemplateRunnerProps> = ({ templateId }) => {
  const template = TEMPLATES_DATA.find((t) => t.id === templateId);

  if (!template) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Template "{templateId}" could not be loaded.
      </div>
    );
  }

  return <DocumentEditor template={template} />;
};

export function createTemplateComponent(templateId: string) {
  const Component: React.FC = () => <TemplateRunner templateId={templateId} />;
  Component.displayName = `Template_${templateId.replace(/-/g, '_')}`;
  return Component;
}
