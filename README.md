# certification-system
## 📄 Certificate Issuance Module (Mar 2025 – Jul 2025)

This project is a personal module within a larger system for managing national test centers.

### 🚀 Features
- Input and manage certificate data with exam results (manual entry or CSV import)
- Certificate issuance flow with 5 statuses:
  - **PROCESSING**: Newly created certificate
  - **PRINTED**: Certificate has been printed
  - **READY FOR PICKUP**: Email (with PDF certificate attached) is sent to the candidate
  - **ISSUED**: Candidate has received the certificate
- Batch processing for entire classes or single test sessions

### ⚙️ Tech Stack
- **Frontend:** ReactJS, TypeScript, Ant Design (Antd)
- **Backend:** NestJS, MSSQL
- **Architecture:** 3-layer design (UI → Controller → Service)
- **Security:** Token authentication & secure key handling
- **Others:** Integrated email service for notifications and PDF delivery

### 🔗 GitHub Repository
[https://github.com/Budworld/certification-system](https://github.com/Budworld/certification-system)
