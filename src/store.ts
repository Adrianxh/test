import { Vendor, Product, Certificate, TestResult, Laboratory, ResearchFlag, MarketingClaim, ActivityEvent, CrawlJob, AppSettings, DashboardStats } from './types';

const STORAGE_KEY = 'peptide_atlas_data';

interface AppState {
  vendors: Vendor[];
  products: Product[];
  certificates: Certificate[];
  test_results: TestResult[];
  laboratories: Laboratory[];
  research_flags: ResearchFlag[];
  marketing_claims: MarketingClaim[];
  activity_events: ActivityEvent[];
  crawl_jobs: CrawlJob[];
  settings: AppSettings;
  crawl_status: 'idle' | 'running' | 'paused' | 'stopped';
  current_vendor_index: number;
}

const defaultSettings: AppSettings = {
  max_concurrent_requests: 3,
  per_domain_rate: 2,
  request_timeout_ms: 30000,
  retry_count: 3,
  max_pages_per_vendor: 50,
  max_crawl_depth: 4,
  max_pdf_size_mb: 25,
  max_total_download_gb: 5,
  browser_visible: true,
  default_collection_mode: 'public',
  auto_download_pdfs: true,
  backup_frequency_hours: 4,
  export_destination: './exports',
  research_scope: 'research_peptides',
};

// Generate realistic sample data for demonstration
function generateSampleData(): AppState {
  const vendors: Vendor[] = [
    {
      id: 'v001', brand_name: 'Apollo Peptides', canonical_url: 'https://apollopeptides.com',
      alternate_domains: [], legal_company_name: 'Apollo Peptides LLC', business_registration: '',
      claimed_country: 'USA', verified_jurisdiction: '', business_category: 'research_peptide_retailer',
      access_type: 'public', operating_status: 'active', public_business_contact: 'support@apollopeptides.com',
      testing_claims: 'Third-party tested, HPLC verified', manufacturer_claims: '',
      manufacturing_origin_claims: '', testing_page_url: 'https://apollopeptides.com/pages/testing',
      first_seen: '2024-01-15', last_checked: '2025-06-10', discovery_source: 'original_vendor_seed',
      evidence_status: 'documented', login_required: false, automation_permission: 'permitted',
      catalog_access_status: 'accessible', coa_access_status: 'accessible', collection_method: 'http',
      last_access_check: '2025-06-10', missing_data_reason: ''
    },
    {
      id: 'v002', brand_name: 'Peptide Sciences', canonical_url: 'https://www.peptidesciences.com',
      alternate_domains: [], legal_company_name: 'Peptide Sciences Inc.', business_registration: '',
      claimed_country: 'USA', verified_jurisdiction: 'California', business_category: 'research_peptide_retailer',
      access_type: 'public', operating_status: 'active', public_business_contact: 'info@peptidesciences.com',
      testing_claims: 'Independent lab testing, >99% purity', manufacturer_claims: 'Synthesized in USA',
      manufacturing_origin_claims: 'USA', testing_page_url: 'https://www.peptidesciences.com/pages/lab-tests',
      first_seen: '2024-01-15', last_checked: '2025-06-10', discovery_source: 'original_vendor_seed',
      evidence_status: 'verified', login_required: false, automation_permission: 'permitted',
      catalog_access_status: 'accessible', coa_access_status: 'accessible', collection_method: 'http',
      last_access_check: '2025-06-10', missing_data_reason: ''
    },
    {
      id: 'v003', brand_name: 'Limitless Life Nootropics', canonical_url: 'https://limitlesslifeusa.com',
      alternate_domains: [], legal_company_name: 'Limitless Life LLC', business_registration: '',
      claimed_country: 'USA', verified_jurisdiction: '', business_category: 'research_peptide_retailer',
      access_type: 'public', operating_status: 'active', public_business_contact: '',
      testing_claims: 'Third-party tested', manufacturer_claims: '',
      manufacturing_origin_claims: '', testing_page_url: '',
      first_seen: '2024-02-20', last_checked: '2025-06-09', discovery_source: 'original_vendor_seed',
      evidence_status: 'partial', login_required: false, automation_permission: 'permitted',
      catalog_access_status: 'accessible', coa_access_status: 'partially_accessible', collection_method: 'http',
      last_access_check: '2025-06-09', missing_data_reason: 'COA page requires navigation'
    },
    {
      id: 'v004', brand_name: 'Core Peptides', canonical_url: 'https://corepeptides.com',
      alternate_domains: [], legal_company_name: '', business_registration: '',
      claimed_country: 'USA', verified_jurisdiction: '', business_category: 'research_peptide_retailer',
      access_type: 'free_account_required', operating_status: 'active', public_business_contact: '',
      testing_claims: '99%+ purity, batch tested', manufacturer_claims: '',
      manufacturing_origin_claims: '', testing_page_url: 'https://corepeptides.com/testing',
      first_seen: '2024-03-01', last_checked: '2025-06-08', discovery_source: 'original_vendor_seed',
      evidence_status: 'pending', login_required: true, automation_permission: 'unclear',
      catalog_access_status: 'requires_login', coa_access_status: 'requires_login', collection_method: 'pending',
      last_access_check: '2025-06-08', missing_data_reason: 'Free account required for COA access'
    },
    {
      id: 'v005', brand_name: 'Biotech Peptides', canonical_url: 'https://biotechpeptides.com',
      alternate_domains: [], legal_company_name: 'Biotech Peptides International', business_registration: '',
      claimed_country: 'USA', verified_jurisdiction: '', business_category: 'peptide_synthesis_company',
      access_type: 'public', operating_status: 'active', public_business_contact: 'sales@biotechpeptides.com',
      testing_claims: 'HPLC, Mass Spec verified', manufacturer_claims: 'Custom synthesis available',
      manufacturing_origin_claims: '', testing_page_url: 'https://biotechpeptides.com/quality',
      first_seen: '2024-01-20', last_checked: '2025-06-10', discovery_source: 'original_vendor_seed',
      evidence_status: 'documented', login_required: false, automation_permission: 'permitted',
      catalog_access_status: 'accessible', coa_access_status: 'accessible', collection_method: 'http',
      last_access_check: '2025-06-10', missing_data_reason: ''
    },
    {
      id: 'v006', brand_name: 'Pure Peptides', canonical_url: 'https://purepeptides.com',
      alternate_domains: [], legal_company_name: '', business_registration: '',
      claimed_country: 'Unknown', verified_jurisdiction: '', business_category: 'unknown',
      access_type: 'inaccessible', operating_status: 'unknown', public_business_contact: '',
      testing_claims: '', manufacturer_claims: '', manufacturing_origin_claims: '',
      testing_page_url: '', first_seen: '2024-04-01', last_checked: '2025-06-07',
      discovery_source: 'original_vendor_seed', evidence_status: 'pending',
      login_required: false, automation_permission: 'unknown',
      catalog_access_status: 'inaccessible', coa_access_status: 'inaccessible', collection_method: 'failed',
      last_access_check: '2025-06-07', missing_data_reason: 'Domain not resolving'
    },
    {
      id: 'v007', brand_name: 'Nova Labs Peptides', canonical_url: 'https://novalabspeptides.com',
      alternate_domains: [], legal_company_name: 'Nova Labs Inc.', business_registration: '',
      claimed_country: 'USA', verified_jurisdiction: '', business_category: 'research_peptide_retailer',
      access_type: 'public', operating_status: 'active', public_business_contact: '',
      testing_claims: 'GMP manufactured, third-party tested', manufacturer_claims: 'GMP facility',
      manufacturing_origin_claims: 'USA', testing_page_url: 'https://novalabspeptides.com/lab-reports',
      first_seen: '2024-05-10', last_checked: '2025-06-10', discovery_source: 'original_vendor_seed',
      evidence_status: 'documented', login_required: false, automation_permission: 'permitted',
      catalog_access_status: 'accessible', coa_access_status: 'accessible', collection_method: 'http',
      last_access_check: '2025-06-10', missing_data_reason: ''
    },
    {
      id: 'v008', brand_name: 'Synthetic Peptide Co', canonical_url: 'https://syntheticpeptide.com',
      alternate_domains: [], legal_company_name: '', business_registration: '',
      claimed_country: 'Canada', verified_jurisdiction: '', business_category: 'peptide_manufacturer',
      access_type: 'public', operating_status: 'active', public_business_contact: '',
      testing_claims: 'ISO 17025 accredited lab testing', manufacturer_claims: 'In-house manufacturing',
      manufacturing_origin_claims: 'Canada', testing_page_url: '',
      first_seen: '2024-06-15', last_checked: '2025-06-09', discovery_source: 'vendor_link_discovery',
      evidence_status: 'partial', login_required: false, automation_permission: 'permitted',
      catalog_access_status: 'accessible', coa_access_status: 'not_found', collection_method: 'http',
      last_access_check: '2025-06-09', missing_data_reason: 'No public COA page identified'
    },
  ];

  const products: Product[] = [
    { id: 'p001', vendor_id: 'v001', product_name: 'BPC-157 5mg', product_url: 'https://apollopeptides.com/products/bpc-157', compound_name: 'BPC-157', chemical_form: 'free_acid', modifications: '', formulation: 'lyophilized', blend_components: [], labeled_strength: 5, labeled_unit: 'mg', package_size: '1 vial', price: 34.99, currency: 'USD', stock_status: 'in_stock', product_category: 'healing_peptides', associated_batch: 'BPC-2024-001', associated_certificate: 'c001', collection_timestamp: '2025-06-10T14:30:00Z' },
    { id: 'p002', vendor_id: 'v001', product_name: 'TB-500 5mg', product_url: 'https://apollopeptides.com/products/tb-500', compound_name: 'TB-500', chemical_form: 'free_acid', modifications: '', formulation: 'lyophilized', blend_components: [], labeled_strength: 5, labeled_unit: 'mg', package_size: '1 vial', price: 39.99, currency: 'USD', stock_status: 'in_stock', product_category: 'healing_peptides', associated_batch: 'TB-2024-003', associated_certificate: 'c002', collection_timestamp: '2025-06-10T14:31:00Z' },
    { id: 'p003', vendor_id: 'v002', product_name: 'Semaglutide 3mg', product_url: 'https://peptidesciences.com/products/semaglutide', compound_name: 'Semaglutide', chemical_form: 'free_acid', modifications: '', formulation: 'lyophilized', blend_components: [], labeled_strength: 3, labeled_unit: 'mg', package_size: '1 vial', price: 89.99, currency: 'USD', stock_status: 'in_stock', product_category: 'metabolic_peptides', associated_batch: 'SEM-2024-012', associated_certificate: 'c003', collection_timestamp: '2025-06-10T14:32:00Z' },
    { id: 'p004', vendor_id: 'v002', product_name: 'CJC-1295 DAC', product_url: 'https://peptidesciences.com/products/cjc-1295-dac', compound_name: 'CJC-1295', chemical_form: 'free_acid', modifications: 'DAC (Drug Affinity Complex)', formulation: 'lyophilized', blend_components: [], labeled_strength: 2, labeled_unit: 'mg', package_size: '1 vial', price: 44.99, currency: 'USD', stock_status: 'in_stock', product_category: 'growth_hormone', associated_batch: 'CJC-2024-007', associated_certificate: 'c004', collection_timestamp: '2025-06-10T14:33:00Z' },
    { id: 'p005', vendor_id: 'v005', product_name: 'GHK-Cu 50mg', product_url: 'https://biotechpeptides.com/products/ghk-cu', compound_name: 'GHK-Cu', chemical_form: 'copper_complex', modifications: '', formulation: 'lyophilized', blend_components: [], labeled_strength: 50, labeled_unit: 'mg', package_size: '1 vial', price: 29.99, currency: 'USD', stock_status: 'in_stock', product_category: 'cosmetic_peptides', associated_batch: 'GHK-2024-002', associated_certificate: 'c005', collection_timestamp: '2025-06-10T14:34:00Z' },
    { id: 'p006', vendor_id: 'v007', product_name: 'Ipamorelin 5mg', product_url: 'https://novalabspeptides.com/products/ipamorelin', compound_name: 'Ipamorelin', chemical_form: 'free_acid', modifications: '', formulation: 'lyophilized', blend_components: [], labeled_strength: 5, labeled_unit: 'mg', package_size: '1 vial', price: 32.99, currency: 'USD', stock_status: 'in_stock', product_category: 'growth_hormone', associated_batch: 'IPO-2024-005', associated_certificate: 'c006', collection_timestamp: '2025-06-10T14:35:00Z' },
    { id: 'p007', vendor_id: 'v007', product_name: 'Selank 5mg', product_url: 'https://novalabspeptides.com/products/selank', compound_name: 'Selank', chemical_form: 'free_acid', modifications: '', formulation: 'lyophilized', blend_components: [], labeled_strength: 5, labeled_unit: 'mg', package_size: '1 vial', price: 27.99, currency: 'USD', stock_status: 'in_stock', product_category: 'nootropic_peptides', associated_batch: '', associated_certificate: '', collection_timestamp: '2025-06-10T14:36:00Z' },
    { id: 'p008', vendor_id: 'v001', product_name: 'BPC-157/TB-500 Blend', product_url: 'https://apollopeptides.com/products/bpc-tb500-blend', compound_name: 'BPC-157 + TB-500', chemical_form: 'blend', modifications: '', formulation: 'lyophilized', blend_components: ['BPC-157', 'TB-500'], labeled_strength: 5, labeled_unit: 'mg', package_size: '1 vial', price: 59.99, currency: 'USD', stock_status: 'in_stock', product_category: 'healing_peptides', associated_batch: 'BLD-2024-001', associated_certificate: 'c007', collection_timestamp: '2025-06-10T14:37:00Z' },
  ];

  const laboratories: Laboratory[] = [
    { id: 'lab001', official_name: 'Janoshik Testing', legal_entity: 'Janoshik LLC', official_website: 'https://janoshik.com', jurisdiction: 'USA', testing_services: ['HPLC', 'Mass Spectrometry', 'NMR'], documented_methods: ['HPLC-UV', 'LC-MS/MS'], report_verification_portal: 'https://janoshik.com/verify', accreditation_claim: 'ISO/IEC 17025', accreditation_standard: 'ISO/IEC 17025:2017', accreditation_body: 'A2LA', accreditation_number: '7023.01', accreditation_status: 'verified', accreditation_scope_url: 'https://a2la.org/scope/7023.01', verification_date: '2025-05-20', source_evidence: 'A2LA public database' },
    { id: 'lab002', official_name: 'AnaLab International', legal_entity: 'AnaLab Corp.', official_website: 'https://analab-intl.com', jurisdiction: 'USA', testing_services: ['HPLC', 'Amino Acid Analysis', 'Karl Fischer'], documented_methods: ['HPLC-UV', 'AAA'], report_verification_portal: '', accreditation_claim: 'ISO/IEC 17025', accreditation_standard: 'ISO/IEC 17025:2017', accreditation_body: '', accreditation_number: '', accreditation_status: 'unverified', accreditation_scope_url: '', verification_date: '', source_evidence: 'vendor COA header' },
    { id: 'lab003', official_name: 'MZ Biolabs', legal_entity: 'MZ Biolabs GmbH', official_website: 'https://mzbiolabs.de', jurisdiction: 'Germany', testing_services: ['HPLC', 'MS', 'Endotoxin', 'Sterility'], documented_methods: ['HPLC', 'LC-MS', 'LAL'], report_verification_portal: 'https://mzbiolabs.de/verify', accreditation_claim: 'ISO/IEC 17025', accreditation_standard: 'ISO/IEC 17025:2017', accreditation_body: 'DAR ACCRED', accreditation_number: 'D-PL-19023', accreditation_status: 'verified', accreditation_scope_url: '', verification_date: '2025-04-15', source_evidence: 'DAR public register' },
  ];

  const certificates: Certificate[] = [
    { id: 'c001', vendor_id: 'v001', product_id: 'p001', batch_id: 'BPC-2024-001', issuing_laboratory_id: 'lab001', document_url: 'https://apollopeptides.com/coa/bpc-157-2024-001.pdf', local_document_path: 'data/pdfs/c001.pdf', sha256_hash: 'a1b2c3d4e5f6...', report_number: 'JAN-2024-0891', task_number: '', public_verification_key: 'VRF891X', sample_identifier: 'BPC-157 Lot 001', batch_identifier: 'BPC-2024-001', sample_date: '2024-03-15', test_date: '2024-03-18', report_date: '2024-03-20', compound: 'BPC-157', chemical_form: 'free_acid', reported_methods: ['HPLC', 'MS'], verification_url: 'https://janoshik.com/verify', verification_status: 'officially_verified', extraction_status: 'complete' },
    { id: 'c002', vendor_id: 'v001', product_id: 'p002', batch_id: 'TB-2024-003', issuing_laboratory_id: 'lab001', document_url: 'https://apollopeptides.com/coa/tb-500-2024-003.pdf', local_document_path: 'data/pdfs/c002.pdf', sha256_hash: 'b2c3d4e5f6a7...', report_number: 'JAN-2024-1042', task_number: '', public_verification_key: 'VRF042Y', sample_identifier: 'TB-500 Lot 003', batch_identifier: 'TB-2024-003', sample_date: '2024-05-10', test_date: '2024-05-12', report_date: '2024-05-14', compound: 'TB-500', chemical_form: 'free_acid', reported_methods: ['HPLC', 'MS'], verification_url: 'https://janoshik.com/verify', verification_status: 'officially_verified', extraction_status: 'complete' },
    { id: 'c003', vendor_id: 'v002', product_id: 'p003', batch_id: 'SEM-2024-012', issuing_laboratory_id: 'lab002', document_url: 'https://peptidesciences.com/coa/semaglutide-sem-2024-012.pdf', local_document_path: 'data/pdfs/c003.pdf', sha256_hash: 'c3d4e5f6a7b8...', report_number: 'ANL-2024-3321', task_number: '', public_verification_key: '', sample_identifier: 'Semaglutide Sample', batch_identifier: 'SEM-2024-012', sample_date: '2024-06-01', test_date: '2024-06-05', report_date: '2024-06-07', compound: 'Semaglutide', chemical_form: 'free_acid', reported_methods: ['HPLC', 'AAA'], verification_url: '', verification_status: 'insufficient_identifiers', extraction_status: 'complete' },
    { id: 'c004', vendor_id: 'v002', product_id: 'p004', batch_id: 'CJC-2024-007', issuing_laboratory_id: 'lab001', document_url: 'https://peptidesciences.com/coa/cjc-1295-dac-2024-007.pdf', local_document_path: 'data/pdfs/c004.pdf', sha256_hash: 'd4e5f6a7b8c9...', report_number: 'JAN-2024-1567', task_number: '', public_verification_key: 'VRF567Z', sample_identifier: 'CJC-1295 DAC', batch_identifier: 'CJC-2024-007', sample_date: '2024-07-20', test_date: '2024-07-22', report_date: '2024-07-24', compound: 'CJC-1295', chemical_form: 'free_acid', reported_methods: ['HPLC', 'MS'], verification_url: 'https://janoshik.com/verify', verification_status: 'officially_verified', extraction_status: 'complete' },
    { id: 'c005', vendor_id: 'v005', product_id: 'p005', batch_id: 'GHK-2024-002', issuing_laboratory_id: 'lab003', document_url: 'https://biotechpeptides.com/coa/ghk-cu-2024-002.pdf', local_document_path: 'data/pdfs/c005.pdf', sha256_hash: 'e5f6a7b8c9d0...', report_number: 'MZ-2024-0445', task_number: 'T-2024-0891', public_verification_key: 'GHK-VER-445', sample_identifier: 'GHK-Cu Sample', batch_identifier: 'GHK-2024-002', sample_date: '2024-04-10', test_date: '2024-04-12', report_date: '2024-04-15', compound: 'GHK-Cu', chemical_form: 'copper_complex', reported_methods: ['HPLC', 'MS', 'AAS'], verification_url: 'https://mzbiolabs.de/verify', verification_status: 'officially_verified', extraction_status: 'complete' },
    { id: 'c006', vendor_id: 'v007', product_id: 'p006', batch_id: 'IPO-2024-005', issuing_laboratory_id: 'lab001', document_url: 'https://novalabspeptides.com/coa/ipamorelin-2024-005.pdf', local_document_path: 'data/pdfs/c006.pdf', sha256_hash: 'f6a7b8c9d0e1...', report_number: 'JAN-2024-2001', task_number: '', public_verification_key: 'VRF001A', sample_identifier: 'Ipamorelin', batch_identifier: 'IPO-2024-005', sample_date: '2024-08-01', test_date: '2024-08-03', report_date: '2024-08-05', compound: 'Ipamorelin', chemical_form: 'free_acid', reported_methods: ['HPLC', 'MS'], verification_url: 'https://janoshik.com/verify', verification_status: 'officially_verified', extraction_status: 'complete' },
    { id: 'c007', vendor_id: 'v001', product_id: 'p008', batch_id: 'BLD-2024-001', issuing_laboratory_id: 'lab002', document_url: 'https://apollopeptides.com/coa/blend-2024-001.pdf', local_document_path: 'data/pdfs/c007.pdf', sha256_hash: 'a7b8c9d0e1f2...', report_number: 'ANL-2024-4501', task_number: '', public_verification_key: '', sample_identifier: 'BPC/TB Blend', batch_identifier: 'BLD-2024-001', sample_date: '2024-09-10', test_date: '2024-09-12', report_date: '2024-09-14', compound: 'BPC-157 / TB-500', chemical_form: 'blend', reported_methods: ['HPLC'], verification_url: '', verification_status: 'insufficient_identifiers', extraction_status: 'partial' },
  ];

  const test_results: TestResult[] = [
    { id: 'tr001', certificate_id: 'c001', analyte: 'BPC-157', test_type: 'Purity', method: 'HPLC-UV', reported_value: '99.2', original_unit: '%', measurement_basis: 'peak_area', acceptance_criteria: '≥98%', reported_pass_fail: 'PASS', measurement_uncertainty: '±0.3%', detection_limit: '', quantification_limit: '', source_page: '1', source_excerpt: 'HPLC Purity: 99.2%', review_status: 'verified', test_category: 'purity' },
    { id: 'tr002', certificate_id: 'c001', analyte: 'BPC-157', test_type: 'Identity', method: 'LC-MS/MS', reported_value: '694.8', original_unit: 'Da', measurement_basis: 'molecular_weight', acceptance_criteria: '694.8 ± 1 Da', reported_pass_fail: 'PASS', measurement_uncertainty: '±0.5 Da', detection_limit: '', quantification_limit: '', source_page: '1', source_excerpt: 'MS: [M+H]+ = 694.8 Da', review_status: 'verified', test_category: 'molecular_identity' },
    { id: 'tr003', certificate_id: 'c001', analyte: 'Water Content', test_type: 'Karl Fischer', method: 'Karl Fischer Titration', reported_value: '3.8', original_unit: '%', measurement_basis: 'mass_fraction', acceptance_criteria: '≤6%', reported_pass_fail: 'PASS', measurement_uncertainty: '±0.2%', detection_limit: '', quantification_limit: '', source_page: '2', source_excerpt: 'KF Water: 3.8%', review_status: 'verified', test_category: 'water_content' },
    { id: 'tr004', certificate_id: 'c003', analyte: 'Semaglutide', test_type: 'Purity', method: 'HPLC-UV', reported_value: '98.7', original_unit: '%', measurement_basis: 'peak_area', acceptance_criteria: '≥98%', reported_pass_fail: 'PASS', measurement_uncertainty: '', detection_limit: '', quantification_limit: '', source_page: '1', source_excerpt: 'Purity by HPLC: 98.7%', review_status: 'pending_review', test_category: 'purity' },
    { id: 'tr005', certificate_id: 'c003', analyte: 'Semaglutide', test_type: 'Identity', method: 'LC-MS', reported_value: '4113.6', original_unit: 'Da', measurement_basis: 'molecular_weight', acceptance_criteria: '4113.6 ± 2 Da', reported_pass_fail: 'PASS', measurement_uncertainty: '±1 Da', detection_limit: '', quantification_limit: '', source_page: '1', source_excerpt: 'MS confirmed identity', review_status: 'pending_review', test_category: 'molecular_identity' },
    { id: 'tr006', certificate_id: 'c005', analyte: 'GHK-Cu', test_type: 'Purity', method: 'HPLC', reported_value: '99.1', original_unit: '%', measurement_basis: 'peak_area', acceptance_criteria: '≥98%', reported_pass_fail: 'PASS', measurement_uncertainty: '±0.2%', detection_limit: '', quantification_limit: '', source_page: '1', source_excerpt: 'Purity: 99.1%', review_status: 'verified', test_category: 'purity' },
    { id: 'tr007', certificate_id: 'c005', analyte: 'Endotoxin', test_type: 'LAL', method: 'Kinetic Chromogenic LAL', reported_value: '<0.25', original_unit: 'EU/mL', measurement_basis: 'concentration', acceptance_criteria: '<5 EU/mL', reported_pass_fail: 'PASS', measurement_uncertainty: '', detection_limit: '0.03 EU/mL', quantification_limit: '', source_page: '2', source_excerpt: 'Endotoxin: <0.25 EU/mL', review_status: 'verified', test_category: 'endotoxins' },
    { id: 'tr008', certificate_id: 'c006', analyte: 'Ipamorelin', test_type: 'Purity', method: 'HPLC-UV', reported_value: '99.4', original_unit: '%', measurement_basis: 'peak_area', acceptance_criteria: '≥99%', reported_pass_fail: 'PASS', measurement_uncertainty: '±0.3%', detection_limit: '', quantification_limit: '', source_page: '1', source_excerpt: 'HPLC Purity: 99.4%', review_status: 'verified', test_category: 'purity' },
    { id: 'tr009', certificate_id: 'c006', analyte: 'Ipamorelin', test_type: 'Identity', method: 'MS', reported_value: '711.8', original_unit: 'Da', measurement_basis: 'molecular_weight', acceptance_criteria: '711.8 ± 1 Da', reported_pass_fail: 'PASS', measurement_uncertainty: '±0.5 Da', detection_limit: '', quantification_limit: '', source_page: '1', source_excerpt: 'MS: 711.8 Da', review_status: 'verified', test_category: 'molecular_identity' },
    { id: 'tr010', certificate_id: 'c007', analyte: 'BPC-157', test_type: 'Purity', method: 'HPLC', reported_value: '97.8', original_unit: '%', measurement_basis: 'peak_area', acceptance_criteria: '≥98%', reported_pass_fail: 'FAIL', measurement_uncertainty: '±0.5%', detection_limit: '', quantification_limit: '', source_page: '1', source_excerpt: 'BPC-157 component: 97.8%', review_status: 'flagged', test_category: 'purity' },
  ];

  const research_flags: ResearchFlag[] = [
    { id: 'f001', rule_id: 'RULE_PURITY_FAIL', affected_record_ids: ['tr010', 'c007'], exact_reason: 'Certificate c007 reports BPC-157 purity at 97.8% which fails the stated acceptance criteria of ≥98%. Product is still listed as in-stock.', source_evidence: 'c007, tr010', extraction_confidence: 0.95, verification_status: 'confirmed', human_review_status: 'open', resolution_notes: '', created_at: '2025-06-10T14:40:00Z' },
    { id: 'f002', rule_id: 'RULE_MISSING_VERIFICATION', affected_record_ids: ['c003'], exact_reason: 'Certificate c003 from AnaLab International has no public verification portal and no verification key. Cannot independently authenticate.', source_evidence: 'c003', extraction_confidence: 0.9, verification_status: 'confirmed', human_review_status: 'open', resolution_notes: '', created_at: '2025-06-10T14:41:00Z' },
    { id: 'f003', rule_id: 'RULE_UNVERIFIED_ACCREDITATION', affected_record_ids: ['lab002'], exact_reason: 'AnaLab International claims ISO/IEC 17025 accreditation but no accreditation body or number is documented. Cannot verify.', source_evidence: 'lab002', extraction_confidence: 0.85, verification_status: 'confirmed', human_review_status: 'under_review', resolution_notes: 'Checking accreditation databases', created_at: '2025-06-10T14:42:00Z' },
    { id: 'f004', rule_id: 'RULE_MISSING_BATCH', affected_record_ids: ['p007'], exact_reason: 'Product Selank (p007) from Nova Labs has no associated batch or certificate. Cannot verify product quality claims.', source_evidence: 'p007', extraction_confidence: 0.95, verification_status: 'confirmed', human_review_status: 'open', resolution_notes: '', created_at: '2025-06-10T14:43:00Z' },
  ];

  const marketing_claims: MarketingClaim[] = [
    { id: 'mc001', vendor_id: 'v001', product_id: '', exact_original_text: 'Third-party tested, HPLC verified', claim_category: 'testing', source_url: 'https://apollopeptides.com', capture_date: '2025-06-10', verification_status: 'documented_claim', review_notes: 'Supported by Janoshik COAs' },
    { id: 'mc002', vendor_id: 'v002', product_id: '', exact_original_text: 'Independent lab testing, >99% purity', claim_category: 'purity', source_url: 'https://peptidesciences.com', capture_date: '2025-06-10', verification_status: 'documented_claim', review_notes: 'Some COAs show 98.7%, not >99%' },
    { id: 'mc003', vendor_id: 'v007', product_id: '', exact_original_text: 'GMP manufactured, third-party tested', claim_category: 'manufacturing', source_url: 'https://novalabspeptides.com', capture_date: '2025-06-10', verification_status: 'unverified', review_notes: 'No GMP certification evidence found' },
    { id: 'mc004', vendor_id: 'v005', product_id: '', exact_original_text: 'HPLC, Mass Spec verified', claim_category: 'testing', source_url: 'https://biotechpeptides.com', capture_date: '2025-06-10', verification_status: 'verified', review_notes: 'Confirmed via MZ Biolabs COAs' },
    { id: 'mc005', vendor_id: 'v008', product_id: '', exact_original_text: 'ISO 17025 accredited lab testing', claim_category: 'accreditation', source_url: 'https://syntheticpeptide.com', capture_date: '2025-06-09', verification_status: 'unverified', review_notes: 'No accreditation body identified' },
  ];

  const activity_events: ActivityEvent[] = [
    { id: 'e001', timestamp: '2025-06-10T16:32:04Z', message: 'Research job started — processing 8 vendor candidates', type: 'info' },
    { id: 'e002', timestamp: '2025-06-10T16:32:06Z', message: 'Visiting apollopeptides.com', type: 'info', vendor_id: 'v001' },
    { id: 'e003', timestamp: '2025-06-10T16:32:08Z', message: 'Found testing page: /pages/testing', type: 'discovery', vendor_id: 'v001' },
    { id: 'e004', timestamp: '2025-06-10T16:32:10Z', message: 'Discovered 3 products on catalog page', type: 'discovery', vendor_id: 'v001' },
    { id: 'e005', timestamp: '2025-06-10T16:32:12Z', message: 'Found 4 certificate links', type: 'discovery', vendor_id: 'v001' },
    { id: 'e006', timestamp: '2025-06-10T16:32:14Z', message: 'Downloaded COA: bpc-157-2024-001.pdf (245 KB)', type: 'success', vendor_id: 'v001' },
    { id: 'e007', timestamp: '2025-06-10T16:32:16Z', message: 'Extracted laboratory: Janoshik Testing', type: 'discovery', vendor_id: 'v001' },
    { id: 'e008', timestamp: '2025-06-10T16:32:18Z', message: 'Report JAN-2024-0891 verified via Janoshik portal', type: 'success', vendor_id: 'v001' },
    { id: 'e009', timestamp: '2025-06-10T16:32:20Z', message: 'Database checkpoint saved (12 records)', type: 'info' },
    { id: 'e010', timestamp: '2025-06-10T16:32:22Z', message: 'Visiting peptidesciences.com', type: 'info', vendor_id: 'v002' },
    { id: 'e011', timestamp: '2025-06-10T16:32:25Z', message: 'Found lab tests page', type: 'discovery', vendor_id: 'v002' },
    { id: 'e012', timestamp: '2025-06-10T16:32:28Z', message: 'Downloaded COA: semaglutide-sem-2024-012.pdf (312 KB)', type: 'success', vendor_id: 'v002' },
    { id: 'e013', timestamp: '2025-06-10T16:32:30Z', message: 'Flag: Certificate c003 has no verification portal', type: 'warning', vendor_id: 'v002' },
    { id: 'e014', timestamp: '2025-06-10T16:32:32Z', message: 'Visiting corepeptides.com', type: 'info', vendor_id: 'v004' },
    { id: 'e015', timestamp: '2025-06-10T16:32:34Z', message: 'Login wall detected — marking as free_account_required', type: 'warning', vendor_id: 'v004' },
    { id: 'e016', timestamp: '2025-06-10T16:32:36Z', message: 'Visiting purepeptides.com', type: 'info', vendor_id: 'v006' },
    { id: 'e017', timestamp: '2025-06-10T16:32:38Z', message: 'DNS resolution failed for purepeptides.com', type: 'error', vendor_id: 'v006' },
    { id: 'e018', timestamp: '2025-06-10T16:32:40Z', message: 'Flag: Product p007 has no batch or certificate', type: 'warning', vendor_id: 'v007' },
    { id: 'e019', timestamp: '2025-06-10T16:32:42Z', message: 'Discovered new vendor candidate: syntheticpeptide.com (from biotechpeptides.com link)', type: 'discovery' },
    { id: 'e020', timestamp: '2025-06-10T16:32:44Z', message: 'Database checkpoint saved (48 records)', type: 'info' },
  ];

  const crawl_jobs: CrawlJob[] = [
    { id: 'j001', status: 'completed', vendor_id: 'v001', started_at: '2025-06-10T16:32:06Z', completed_at: '2025-06-10T16:35:00Z', pages_examined: 12, documents_downloaded: 4, records_extracted: 18, records_rejected: 1, errors: 0, progress: 100 },
    { id: 'j002', status: 'completed', vendor_id: 'v002', started_at: '2025-06-10T16:32:22Z', completed_at: '2025-06-10T16:36:00Z', pages_examined: 8, documents_downloaded: 2, records_extracted: 10, records_rejected: 0, errors: 0, progress: 100 },
    { id: 'j003', status: 'completed', vendor_id: 'v005', started_at: '2025-06-10T16:33:00Z', completed_at: '2025-06-10T16:37:00Z', pages_examined: 6, documents_downloaded: 1, records_extracted: 8, records_rejected: 0, errors: 0, progress: 100 },
    { id: 'j004', status: 'completed', vendor_id: 'v007', started_at: '2025-06-10T16:33:30Z', completed_at: '2025-06-10T16:38:00Z', pages_examined: 10, documents_downloaded: 1, records_extracted: 6, records_rejected: 2, errors: 0, progress: 100 },
    { id: 'j005', status: 'completed', vendor_id: 'v003', started_at: '2025-06-10T16:34:00Z', completed_at: '2025-06-10T16:39:00Z', pages_examined: 5, documents_downloaded: 0, records_extracted: 3, records_rejected: 0, errors: 1, progress: 100 },
    { id: 'j006', status: 'failed', vendor_id: 'v006', started_at: '2025-06-10T16:34:30Z', completed_at: '2025-06-10T16:34:35Z', pages_examined: 0, documents_downloaded: 0, records_extracted: 0, records_rejected: 0, errors: 3, progress: 0 },
    { id: 'j007', status: 'paused', vendor_id: 'v004', started_at: '2025-06-10T16:35:00Z', completed_at: '', pages_examined: 2, documents_downloaded: 0, records_extracted: 0, records_rejected: 0, errors: 0, progress: 30 },
    { id: 'j008', status: 'queued', vendor_id: 'v008', started_at: '', completed_at: '', pages_examined: 0, documents_downloaded: 0, records_extracted: 0, records_rejected: 0, errors: 0, progress: 0 },
  ];

  return {
    vendors,
    products,
    certificates,
    test_results,
    laboratories,
    research_flags,
    marketing_claims,
    activity_events,
    crawl_jobs,
    settings: defaultSettings,
    crawl_status: 'idle',
    current_vendor_index: 0,
  };
}

export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  const initial = generateSampleData();
  saveState(initial);
  return initial;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function getStats(state: AppState): DashboardStats {
  return {
    total_vendors: state.vendors.length,
    vendors_investigated: state.vendors.filter(v => v.evidence_status === 'documented' || v.evidence_status === 'verified').length,
    vendors_pending: state.vendors.filter(v => v.evidence_status === 'pending').length,
    active_crawls: state.crawl_jobs.filter(j => j.status === 'running').length,
    products_discovered: state.products.length,
    certificates_found: state.certificates.length,
    certificates_parsed: state.certificates.filter(c => c.extraction_status === 'complete').length,
    laboratories_identified: state.laboratories.length,
    verified_reports: state.certificates.filter(c => c.verification_status === 'officially_verified' || c.verification_status === 'directly_confirmed').length,
    unresolved_flags: state.research_flags.filter(f => f.human_review_status === 'open' || f.human_review_status === 'under_review').length,
    download_failures: state.crawl_jobs.filter(j => j.status === 'failed').length,
    last_successful_collection: state.activity_events.filter(e => e.type === 'success').sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]?.timestamp || 'Never',
  };
}
