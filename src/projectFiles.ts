export const projectFiles = {
  'package.json': `{
  "name": "peptide-intelligence-atlas",
  "version": "1.0.0",
  "description": "Peptide Intelligence Atlas - Research Platform by Nootroholic.com",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",
    "jszip": "^3.10.1",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/file-saver": "^2.0.7",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.0",
    "vite": "^6.3.5",
    "tailwindcss": "^4.1.7",
    "@tailwindcss/vite": "^4.1.7"
  }
}`,

  'index.html': `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Peptide Intelligence Atlas — Nootroholic.com</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      html, body, #root {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background-color: #0a0e1a;
        color: #e2e8f0;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": false,
    "noImplicitAny": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src"]
}`,

  'src/main.tsx': `import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);`,

  'src/index.css': `@import "tailwindcss";

@theme {
  --color-navy-900: #0a0e1a;
  --color-navy-800: #0f1629;
  --color-navy-700: #151d38;
  --color-navy-600: #1b2547;
  --color-slate-panel: #1a2236;
  --color-slate-border: #2a3550;
  --color-cyan-accent: #22d3ee;
  --color-teal-accent: #2dd4bf;
  --color-cyan-dim: #0e7490;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #2a3550 #0f1629;
}

*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: #0f1629;
}

*::-webkit-scrollbar-thumb {
  background: #2a3550;
  border-radius: 3px;
}

body {
  background: #0a0e1a;
  color: #e2e8f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

@keyframes pulse-cyan {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse-cyan {
  animation: pulse-cyan 2s ease-in-out infinite;
}

@keyframes slide-in {
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.glass-panel {
  background: linear-gradient(135deg, rgba(26, 34, 54, 0.9), rgba(15, 22, 41, 0.95));
  border: 1px solid rgba(42, 53, 80, 0.6);
  backdrop-filter: blur(10px);
}

.stat-card {
  background: linear-gradient(135deg, rgba(26, 34, 54, 0.8), rgba(15, 22, 41, 0.9));
  border: 1px solid rgba(42, 53, 80, 0.5);
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.05);
}

.nav-item {
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: rgba(34, 211, 238, 0.08);
}

.nav-item.active {
  background: rgba(34, 211, 238, 0.12);
  border-left: 3px solid #22d3ee;
}

.data-table th {
  background: rgba(15, 22, 41, 0.8);
  border-bottom: 1px solid rgba(42, 53, 80, 0.8);
}

.data-table td {
  border-bottom: 1px solid rgba(42, 53, 80, 0.3);
}

.data-table tr:hover td {
  background: rgba(34, 211, 238, 0.03);
}

.btn-primary {
  background: linear-gradient(135deg, #0e7490, #0891b2);
  border: 1px solid rgba(34, 211, 238, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
}

.btn-danger {
  background: linear-gradient(135deg, #991b1b, #dc2626);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
}

.btn-secondary {
  background: rgba(42, 53, 80, 0.5);
  border: 1px solid rgba(42, 53, 80, 0.8);
}

.btn-secondary:hover {
  background: rgba(42, 53, 80, 0.8);
  border-color: rgba(34, 211, 238, 0.2);
}

.activity-feed-item {
  animation: slide-in 0.3s ease-out;
}

.progress-bar {
  background: linear-gradient(90deg, #0e7490, #22d3ee);
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
}`,

  'src/types.ts': `export type VendorCategory = 'research_peptide_retailer' | 'peptide_synthesis_company' | 'peptide_manufacturer' | 'pharmaceutical_supplier' | 'analytical_laboratory' | 'directory' | 'marketplace' | 'inactive_business' | 'unknown';
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
}`,

  'README.md': `# Peptide Intelligence Atlas

**Professional Research Platform by Nootroholic.com**

A comprehensive web-based dashboard for collecting, analyzing, and managing peptide vendor research data.

## Features

- **Dashboard**: Real-time statistics and activity monitoring
- **Vendor Explorer**: Manage and investigate peptide vendors
- **Product Explorer**: Track discovered products and compounds
- **Laboratory Explorer**: Monitor analytical laboratories and accreditations
- **Certificate Explorer**: Manage certificates of analysis (CoAs)
- **Relationship Explorer**: Visualize vendor-laboratory relationships
- **Research Flags**: Track anomalies and verification issues
- **Review Queue**: Manage pending review items
- **Crawl Manager**: Control data collection jobs
- **Statistics**: Comprehensive research analytics
- **Export Center**: Generate research packages for analysis
- **Settings**: Configure collection parameters

## Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Technology Stack

- React 18 with TypeScript
- Tailwind CSS 4
- Recharts for data visualization
- Lucide React for icons
- Vite for build tooling
- localStorage for data persistence

## Usage

The application includes sample data demonstrating:
- 8 vendors with various access types and evidence statuses
- 8 products with detailed compound information
- 7 certificates with verification status tracking
- 10 analytical test results across multiple categories
- 3 laboratories with accreditation information
- 4 research flags for anomaly tracking
- 5 marketing claims with verification status
- 8 crawl jobs showing collection progress

All data is stored in localStorage and persists across sessions.

## Data Structure

The application tracks:
- **Vendors**: Brand information, access types, evidence status
- **Products**: Compound details, pricing, batch associations
- **Certificates**: Report numbers, laboratories, verification status
- **Test Results**: Analytical measurements with methods and criteria
- **Laboratories**: Accreditation status, testing services
- **Research Flags**: Anomaly detection and verification issues
- **Marketing Claims**: Vendor claims with verification tracking

## Export

Use the Export Center to generate JSON packages containing:
- Complete research dataset
- Vendor and product information
- Certificate and test result data
- Laboratory relationships
- Research flags and claims

## License

Proprietary - Nootroholic.com Research Platform

## Support

For questions or issues, contact Nootroholic.com
`
};
