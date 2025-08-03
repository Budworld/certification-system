# certification-system
## 📌 Project: Certification Module – Personal Subproject of Certification Center System

**⏱ Duration:** March 2025 – July 2025

This project is a **personal module** of a larger certification center management system. It focuses on handling certificate issuing in a clear, step-by-step process for each candidate or test class.

### 🎯 Key Features:
- Input exam results and certificate data in 2 ways:
  - Manual entry through UI.
  - Bulk import via CSV file.

- **5-stage certificate issuing workflow:**
  1. **PROCESSING** – Data is newly added and pending printing.
  2. **PRINTED** – Certificate has been printed, confirmed by the user.
  3. **READY FOR PICKUP** – After printing, an email is sent with the attached PDF certificate, then status updates.
  4. **ISSUED** – When the receiver confirms they have picked up the certificate.

- Actions can be executed for individual candidates or by **exam sessions / classes**.

---

### 🛠 Tech Stack:
- **Frontend:** ReactJS, Ant Design (Antd), TypeScript, JavaScript
- **Backend:** NestJS, MS SQL Server
- **Architecture:** Clean 3-layer (UI → Controller → Service)

---

### 🔒 Other Highlights:
- **Security:** Use of personal keys, secure certificate PDF delivery via tokenized URLs.
- **Scalable Design:** Aligned with real-world workflows in educational organizations.

---

### 🔗 GitHub:
[https://github.com/Budworld/certification-system](https://github.com/Budworld/certification-system)
