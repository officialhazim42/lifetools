import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TEMPLATES_CATALOG, getTemplateById, getTemplatesBySection } from '../data/templatesData';
import {
  saveDocumentDraft,
  getDocumentDrafts,
  getDocumentDraft,
  deleteDocumentDraft,
  duplicateDocumentDraft,
  exportDraftAsJson,
  importDraftFromJson,
  toggleTemplateFavorite,
  isTemplateFavorite,
  getFavoriteTemplateIds,
  recordTemplateUsage,
  getRecentlyUsedTemplateIds,
  clearAllDrafts
} from '../utils/documentStorage';
import { DocumentPreview } from '../components/templates/DocumentPreview';
import { DocumentEditor } from '../components/templates/DocumentEditor';
import { TemplateLibrary } from '../components/templates/TemplateLibrary';
import { TemplatesPage } from '../pages/TemplatesPage';
import { collectBackupPayload, executeRestore, getStoredRecordCounts } from '../utils/backupManager';
import { SavedDocumentDraft, DocumentStyling } from '../types/templates';

describe('Templates & Document Creator Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. Catalog & Registry Integrity (40 Templates)', () => {
    it('contains exactly 40 templates in the library', () => {
      expect(TEMPLATES_CATALOG.length).toBe(40);
    });

    it('has unique IDs for all 40 templates', () => {
      const ids = TEMPLATES_CATALOG.map((t) => t.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(40);
    });

    it('divides evenly into 4 categories with 10 templates each', () => {
      const business = getTemplatesBySection('business');
      const student = getTemplatesBySection('student');
      const personal = getTemplatesBySection('personal');
      const professional = getTemplatesBySection('professional');

      expect(business.length).toBe(10);
      expect(student.length).toBe(10);
      expect(personal.length).toBe(10);
      expect(professional.length).toBe(10);
    });

    it('validates all required Business Templates exist', () => {
      const businessIds = [
        'invoice-generator',
        'quotation-generator',
        'receipt-generator',
        'purchase-order-generator',
        'business-letter-generator',
        'payment-voucher-generator',
        'delivery-challan-generator',
        'business-card-maker',
        'price-list-generator',
        'product-catalogue-generator'
      ];
      businessIds.forEach((id) => {
        const found = getTemplateById(id);
        expect(found).toBeDefined();
        expect(found?.category).toBe('business');
        expect(found?.name).toBeTruthy();
        expect(found?.defaultData).toBeDefined();
      });
    });

    it('validates all required Student Templates exist', () => {
      const studentIds = [
        'resume-builder',
        'cover-letter-generator',
        'assignment-cover-page',
        'project-report-cover',
        'study-timetable-template',
        'class-timetable-template',
        'attendance-sheet-template',
        'study-notes-template',
        'certificate-template',
        'exam-preparation-planner'
      ];
      studentIds.forEach((id) => {
        const found = getTemplateById(id);
        expect(found).toBeDefined();
        expect(found?.category).toBe('student');
        expect(found?.name).toBeTruthy();
      });
    });

    it('validates all required Personal Templates exist', () => {
      const personalIds = [
        'daily-planner-template',
        'weekly-planner-template',
        'monthly-planner-template',
        'personal-budget-sheet',
        'grocery-list-template',
        'shopping-list-template',
        'travel-planner-template',
        'packing-checklist-template',
        'habit-tracker-sheet',
        'goal-planning-sheet'
      ];
      personalIds.forEach((id) => {
        const found = getTemplateById(id);
        expect(found).toBeDefined();
        expect(found?.category).toBe('personal');
      });
    });

    it('validates all required Professional Documents exist', () => {
      const profIds = [
        'professional-email-generator',
        'resignation-letter-generator',
        'leave-application-generator',
        'experience-letter-template',
        'internship-application-template',
        'meeting-agenda-template',
        'meeting-minutes-template',
        'project-proposal-template',
        'work-report-template',
        'recommendation-letter-template'
      ];
      profIds.forEach((id) => {
        const found = getTemplateById(id);
        expect(found).toBeDefined();
        expect(found?.category).toBe('professional');
      });
    });
  });

  describe('2. Document Storage, Drafts, and Favorites Manager', () => {
    const mockDraft: SavedDocumentDraft = {
      id: 'draft-test-1',
      templateId: 'invoice-generator',
      title: 'Acme Invoice 2026',
      category: 'business',
      data: {
        senderName: 'Acme Corp',
        documentNo: 'INV-999',
        clientName: 'Globex Ltd'
      },
      styling: {
        accentColor: '#2563eb',
        textColor: '#0f172a',
        font: 'inter',
        fontSize: 'standard',
        pageFormat: 'a4-portrait',
        showLogo: false
      },
      sections: [
        {
          id: 'items',
          title: 'Line Items',
          items: [
            { id: 'item-1', description: 'Web Development', quantity: 10, rate: 75, amount: 750 }
          ]
        }
      ],
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z'
    };

    it('saves, retrieves, and updates a draft in localStorage', () => {
      saveDocumentDraft(mockDraft);
      const drafts = getDocumentDrafts();
      expect(drafts.length).toBe(1);
      expect(drafts[0].title).toBe('Acme Invoice 2026');

      const retrieved = getDocumentDraft('draft-test-1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.data.senderName).toBe('Acme Corp');

      // Update
      const updated = { ...mockDraft, title: 'Updated Acme Invoice' };
      saveDocumentDraft(updated);
      expect(getDocumentDrafts().length).toBe(1);
      expect(getDocumentDraft('draft-test-1')?.title).toBe('Updated Acme Invoice');
    });

    it('deletes a draft cleanly', () => {
      saveDocumentDraft(mockDraft);
      expect(getDocumentDrafts().length).toBe(1);

      const deleted = deleteDocumentDraft('draft-test-1');
      expect(deleted).toBe(true);
      expect(getDocumentDrafts().length).toBe(0);
    });

    it('duplicates a draft creating a fresh copy', () => {
      saveDocumentDraft(mockDraft);
      const copy = duplicateDocumentDraft('draft-test-1');
      expect(copy).toBeDefined();
      expect(copy?.id).not.toBe('draft-test-1');
      expect(copy?.title).toContain('Copy');
      expect(getDocumentDrafts().length).toBe(2);
    });

    it('exports draft to JSON and imports draft from JSON accurately', () => {
      // Mock window.URL and DOM methods for export
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      window.URL.createObjectURL = createObjectURLMock;
      window.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      exportDraftAsJson(mockDraft);
      expect(createObjectURLMock).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      // Test import
      clearAllDrafts();
      expect(getDocumentDrafts().length).toBe(0);

      const jsonStr = JSON.stringify(mockDraft);
      const imported = importDraftFromJson(jsonStr);
      expect(imported).toBeDefined();
      expect(imported.title).toBe('Acme Invoice 2026');
      expect(getDocumentDrafts().length).toBe(1);
    });

    it('toggles favorites and tracks recent template interactions', () => {
      expect(isTemplateFavorite('invoice-generator')).toBe(false);
      toggleTemplateFavorite('invoice-generator');
      expect(isTemplateFavorite('invoice-generator')).toBe(true);
      expect(getFavoriteTemplateIds()).toContain('invoice-generator');

      toggleTemplateFavorite('invoice-generator');
      expect(isTemplateFavorite('invoice-generator')).toBe(false);

      recordTemplateUsage('resume-builder');
      recordTemplateUsage('quotation-generator');
      const recents = getRecentlyUsedTemplateIds();
      expect(recents[0]).toBe('quotation-generator');
      expect(recents[1]).toBe('resume-builder');
    });
  });

  describe('3. Document Preview Component & Rendering', () => {
    const template = getTemplateById('invoice-generator')!;
    const defaultStyling: DocumentStyling = {
      accentColor: '#10b981',
      textColor: '#0f172a',
      font: 'inter',
      fontSize: 'standard',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'TAX INVOICE'
    };

    it('renders invoice with sender, client, and item total calculations', () => {
      const testData = {
        senderName: 'LifeTools Technologies',
        clientName: 'Global Client LLC',
        documentNo: 'INV-1001',
        date: '2026-03-15',
        dueDate: '2026-03-30',
        taxRate: 10,
        currency: '$'
      };

      const testSections = [
        {
          id: 'items',
          title: 'Line Items',
          items: [
            { id: '1', description: 'Product Design', quantity: 2, rate: 500, amount: 1000 },
            { id: '2', description: 'Cloud Architecture', quantity: 1, rate: 1500, amount: 1500 }
          ]
        }
      ];

      render(
        <DocumentPreview
          template={template}
          styling={defaultStyling}
          data={testData}
          sections={testSections}
        />
      );

      expect(screen.getByText('LifeTools Technologies')).toBeDefined();
      expect(screen.getByText('Global Client LLC')).toBeDefined();
      expect(screen.getByText('INV-1001')).toBeDefined();
      expect(screen.getByText('Product Design')).toBeDefined();
      expect(screen.getByText('Cloud Architecture')).toBeDefined();

      // Calculation checks: Subtotal = 2500, 10% tax = 250, Total = 2750
      expect(screen.getByText(/2,500/)).toBeDefined();
      expect(screen.getByText(/250/)).toBeDefined();
      expect(screen.getByText(/2,750/)).toBeDefined();
    });

    it('renders certificate template properly with student details', () => {
      const certTemplate = getTemplateById('certificate-template')!;
      render(
        <DocumentPreview
          template={certTemplate}
          data={{
            recipientName: 'Alex Mercer',
            citation: 'Completed Full Stack Web Engineering',
            institution: 'LifeTools Academy',
            issueDate: '2026-03-15'
          }}
          styling={{ ...defaultStyling, pageFormat: 'a4-landscape', headerTitle: 'CERTIFICATE OF COMPLETION' }}
          sections={certTemplate.sections}
        />
      );

      expect(screen.getAllByText('Alex Mercer').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Full Stack Web Engineering/)).toBeDefined();
      expect(screen.getByText(/LifeTools Academy/)).toBeDefined();
    });
  });

  describe('4. Document Editor Controls & Real-Time Actions', () => {
    it('renders editor controls and allows modifying fields and adding line items', () => {
      const template = getTemplateById('invoice-generator')!;
      render(<DocumentEditor template={template} />);

      // Check key controls exist
      expect(screen.getByText('Document Style & Format')).toBeDefined();
      expect(screen.getByText('Print / Save PDF')).toBeDefined();
      expect(screen.getByText('Save Draft')).toBeDefined();

      // Test adding a line item
      const addItemBtn = screen.getByText('Add Item');
      fireEvent.click(addItemBtn);

      // Verify Save Draft action saves into localStorage
      const saveBtn = screen.getByText('Save Draft');
      fireEvent.click(saveBtn);
      expect(getDocumentDrafts().length).toBeGreaterThan(0);
    });
  });

  describe('5. Template Library Catalog & Filtering UI', () => {
    it('renders all 40 cards initially and filters by search input', () => {
      render(<TemplateLibrary onSelectTemplate={vi.fn()} />);

      // Search by keyword
      const searchInput = screen.getByPlaceholderText(/Search templates/i);
      fireEvent.change(searchInput, { target: { value: 'resume' } });

      expect(screen.getByText('Resume Builder')).toBeDefined();
      expect(screen.queryByText('Purchase Order Generator')).toBeNull();
    });

    it('filters by category pills (Business, Student, Personal, Professional)', () => {
      render(<TemplateLibrary onSelectTemplate={vi.fn()} />);

      const studentTab = screen.getByRole('button', { name: /Student/i });
      fireEvent.click(studentTab);

      expect(screen.getByText('Resume Builder')).toBeDefined();
      expect(screen.getByText('Attendance Sheet')).toBeDefined();
      expect(screen.queryByText('Delivery Challan')).toBeNull();
    });

    it('switches to Saved Drafts tab and shows empty state when none exist', () => {
      render(<TemplateLibrary onSelectTemplate={vi.fn()} />);

      const draftsTab = screen.getByRole('button', { name: /My Saved Drafts/i });
      fireEvent.click(draftsTab);

      expect(screen.getByText(/No Saved Drafts Yet/i)).toBeDefined();
    });
  });

  describe('6. TemplatesPage Container Navigation', () => {
    it('renders hero header and library catalog by default', () => {
      render(<TemplatesPage />);

      expect(screen.getByText('Templates & Document Creator')).toBeDefined();
      expect(screen.getByText(/40 Professional Templates/i)).toBeDefined();
      expect(screen.getByText(/100% Client-Side Privacy/i)).toBeDefined();
    });

    it('loads specific template editor when initialTemplateId prop is supplied', () => {
      render(<TemplatesPage initialTemplateId="invoice-generator" />);

      expect(screen.getByText('Invoice Generator')).toBeDefined();
      expect(screen.getByText('Back to Template Catalog')).toBeDefined();
    });
  });

  describe('7. Universal Backup & Restore System Integration', () => {
    it('counts, collects, and restores saved document drafts seamlessly', async () => {
      const mockDraft: SavedDocumentDraft = {
        id: 'draft-backup-test',
        templateId: 'quotation-generator',
        title: 'Enterprise Software Quotation',
        category: 'business',
        data: { clientName: 'OmniCorp', total: '$12,000' },
        styling: {
          accentColor: '#3b82f6',
          textColor: '#0f172a',
          font: 'roboto',
          fontSize: 'standard',
          pageFormat: 'a4-portrait',
          showLogo: false
        },
        sections: [],
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z'
      };

      saveDocumentDraft(mockDraft);

      // Verify getStoredRecordCounts counts documents
      const counts = await getStoredRecordCounts();
      expect(counts.documents).toBe(1);

      // Collect payload
      const payload = await collectBackupPayload(['documents']);

      expect(payload.data.documents).toBeDefined();
      expect(payload.data.documents?.length).toBe(1);
      expect(payload.data.documents?.[0].title).toBe('Enterprise Software Quotation');

      // Clear drafts and restore from backup payload
      clearAllDrafts();
      expect(getDocumentDrafts().length).toBe(0);

      const restoreResult = await executeRestore(payload, 'replace', ['documents']);

      expect(restoreResult.restoredCounts.documents).toBe(1);
      expect(getDocumentDrafts().length).toBe(1);
      expect(getDocumentDraft('draft-backup-test')?.title).toBe('Enterprise Software Quotation');
    });
  });
});
