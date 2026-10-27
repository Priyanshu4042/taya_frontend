export interface Item {
  id: string;
  type: string;
  title: string;
  amount?: number | null;
  due_date?: string | null;
  due_time?: string | null;
  biller_name?: string | null;
  status: string;
  confidence?: number;
  links?: string | null;
  raw_snippet?: string | null;
  created_at?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string | null;
  description?: string | null;
  html_link?: string | null;
}

export interface PipelineResponse {
  success: boolean;
  stage: string;
  message: string;
  cleaned_text?: string;
  regex_result?: {
    candidate: boolean;
    keyword: boolean;
    date: boolean;
    amount_ref: boolean;
  };
  actionability_result?: {
    actionable: boolean;
    confidence: number;
    reason: string;
  };
  stored_record?: Record<string, unknown>;
  extracted_record?: Record<string, unknown>;
}
