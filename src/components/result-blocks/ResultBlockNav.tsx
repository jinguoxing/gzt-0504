import React from 'react';

/**
 * Navigation context for result blocks to communicate
 * click events back to the parent page's sidebar.
 */
export interface ResultBlockNavContextType {
  /** Navigate to a field detail panel */
  onFieldClick?: (field: { field: string; semantic: string; confidence: string | number; source: string }) => void;
  /** Navigate to a risk/issue detail panel */
  onIssueClick?: (issue: { id: string; title: string; severity: string; description?: string }) => void;
  /** Navigate to a deliverable detail panel */
  onDeliverableClick?: (deliverable: { id: string; name: string; type: string; description?: string }) => void;
}

export const ResultBlockNavContext = React.createContext<ResultBlockNavContextType>({});
