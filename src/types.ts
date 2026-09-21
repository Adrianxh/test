export type VendorCategory = 'research_peptide_retailer' | 'peptide_synthesis_company' | 'peptide_manufacturer' | 'pharmaceutical_supplier' | 'analytical_laboratory' | 'directory' | 'marketplace' | 'inactive_business' | 'unknown';
export type AccessType = 'public' | 'free_account_required' | 'restricted' | 'inaccessible';
export type OperatingStatus = 'active' | 'inactive' | 'unknown';
export type EvidenceStatus = 'pending' | 'partial' | 'documented' | 'verified';
export type VerificationStatus = 'not_checked' | 'officially_verified' | 'directly_confirmed' | 'verified_mismatch' | 'insufficient_identifiers' | 'lookup_unavailable' | 'inconclusive';
export type ClaimVerificationStatus = 'verified' | 'documented_claim' | 'unverified' | 'contradicted' | 'not_assessed' | 'inaccessible';
export type ExtractionStatus = 'pending' | 'partial' | 'complete' | 'failed' | 'requires_review';
export type CrawlJobStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
export type FlagReviewStatus = 'open' | 'under_review' | 'resolved' | 'dismissed';
export type TestCategory = 'molecular_identity' | 'purity' | 'quantitative_assay' | 'impurity_analysis' | 'sterility' | 'endotoxins' | 'water_content' | 'residual_solvents' | 'counterions' | 'other';

export interface Vendor {
  id: string;
  brand_name: string;
  canonical_url: string;
  alternate_domains: string[];
  legal_company_name: string;
  business_registration: string;
  claimed_country: string;
  verified_jurisdiction: string;
  business_category: VendorCategory;
  access_type: AccessType;
  operating_status: OperatingStatus;
  public_business_contact: string;
  testing_claims: string;
  manufacturer_claims: string;
  manufacturing_origin_claims: string;
  testing_page_url: string;
  first_seen: string;
  last_checked: string;
  discovery_source: string;
  evidence_status: EvidenceStatus;
  login_required: boolean;
  automation_permission: string;
  catalog_access_status: string;
  coa_access_status: string;
  collection_method: string;
  last_access_check: string;
  missing_data_reason: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  product_name: string;
  product_url: string;
  compound_name: string;
  chemical_form: string;
  modifications: string;
  formulation: string;
  blend_components: string[];
  labeled_strength: number;
  labeled_unit: string;
  package_size: string;
  price: number;
  currency: string;
  stock_status: string;
  product_category: string;
  associated_batch: string;
  associated_certificate: string;
  collection_timestamp: string;
}

export interface Certificate {
  id: string;
  vendor_id: string;
  product_id: string;
  batch_id: string;
  issuing_laboratory_id: string;
  document_url: string;
  local_document_path: string;
  sha256_hash: string;
  report_number: string;
  task_number: string;
  public_verification_key: string;
  sample_identifier: string;
  batch_identifier: string;
  sample_date: string;
  test_date: string;
  report_date: string;
  compound: string;
  chemical_form: string;
  reported_methods: string[];
  verification_url: string;
  verification_status: VerificationStatus;
  extraction_status: ExtractionStatus;
}

export interface TestResult {
  id: string;
  certificate_id: string;
  analyte: string;
  test_type: string;
  method: string;
  reported_value: string;
  original_unit: string;
  measurement_basis: string;
  acceptance_criteria: string;
  reported_pass_fail: string;
  measurement_uncertainty: string;
  detection_limit: string;
  quantification_limit: string;
  source_page: string;
  source_excerpt: string;
  review_status: string;
  test_category: TestCategory;
}

export interface Laboratory {
  id: string;
  official_name: string;
  legal_entity: string;
  official_website: string;
  jurisdiction: string;
  testing_services: string[];
  documented_methods: string[];
  report_verification_portal: string;
  accreditation_claim: string;
  accreditation_standard: string;
  accreditation_body: string;
  accreditation_number: string;
  accreditation_status: string;
  accreditation_scope_url: string;
  verification_date: string;
  source_evidence: string;
}

export interface ResearchFlag {
  id: string;
  rule_id: string;
  affected_record_ids: string[];
  exact_reason: string;
  source_evidence: string;
  extraction_confidence: number;
  verification_status: string;
  human_review_status: FlagReviewStatus;
  resolution_notes: string;
  created_at: string;
}

export interface MarketingClaim {
  id: string;
  vendor_id: string;
  product_id: string;
  exact_original_text: string;
  claim_category: string;
  source_url: string;
  capture_date: string;
  verification_status: ClaimVerificationStatus;
  review_notes: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'discovery';
  vendor_id?: string;
}

export interface CrawlJob {
  id: string;
  status: CrawlJobStatus;
  vendor_id: string;
  started_at: string;
  completed_at: string;
  pages_examined: number;
  documents_downloaded: number;
  records_extracted: number;
  records_rejected: number;
  errors: number;
  progress: number;
}

export interface AppSettings {
  max_concurrent_requests: number;
  per_domain_rate: number;
  request_timeout_ms: number;
  retry_count: number;
  max_pages_per_vendor: number;
  max_crawl_depth: number;
  max_pdf_size_mb: number;
  max_total_download_gb: number;
  browser_visible: boolean;
  default_collection_mode: string;
  auto_download_pdfs: boolean;
  backup_frequency_hours: number;
  export_destination: string;
  research_scope: string;
}

export interface DashboardStats {
  total_vendors: number;
  vendors_investigated: number;
  vendors_pending: number;
  active_crawls: number;
  products_discovered: number;
  certificates_found: number;
  certificates_parsed: number;
  laboratories_identified: number;
  verified_reports: number;
  unresolved_flags: number;
  download_failures: number;
  last_successful_collection: string;
}
