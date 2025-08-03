USE master;
GO

IF DB_ID('QL_TRUNG_TAM') IS NOT NULL
    DROP DATABASE QL_TRUNG_TAM;
GO

CREATE DATABASE QL_TRUNG_TAM;
GO

USE QL_TRUNG_TAM;
GO

-- 1. role
CREATE TABLE role
(
    RoleUID INT IDENTITY(1, 1) PRIMARY KEY,
    RoleName NVARCHAR(20) NOT NULL
);

-- 2. user
CREATE TABLE user
(
    UserUID INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(50),
    PhoneNumber CHAR(11),
    Email NVARCHAR(50),
    Username VARCHAR(50),
    HashedPassword NVARCHAR(100),
    RoleFID INT,
    RefreshToken NVARCHAR(MAX),
    FOREIGN KEY (RoleFID) REFERENCES role (RoleUID)
);

-- 3. applicant
CREATE TABLE applicant
(
    ApplicantUID INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(20),
    PhoneNumber CHAR(11),
    Email NVARCHAR(20),
    IsOrganization BIT NOT NULL
);

-- 4. candidate (remove trailing comma)
CREATE TABLE candidate
(
    CandidateUID INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(20),
    PhoneNumber CHAR(11),
    Email NVARCHAR(20)
);

-- 5. registration
CREATE TABLE registration
(
    RegistrationUID INT IDENTITY(1, 1) PRIMARY KEY,
    Status NVARCHAR(20),
    Date DATE,
    Address NVARCHAR(50) NULL,
    RecordCreatorFID INT,
    ApplicantFID INT,
    FOREIGN KEY (RecordCreatorFID) REFERENCES [user] (UserUID),
    FOREIGN KEY (ApplicantFID) REFERENCES applicant (ApplicantUID)
);

-- 6. exam_type
CREATE TABLE exam_type
(
    ExamTypeUID INT IDENTITY(1, 1) PRIMARY KEY,
    ExamName NVARCHAR(20)
);

-- 7. room
CREATE TABLE room
(
    RoomUID INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(20),
    Capacity INT
        DEFAULT 40
);

-- 8. exam_schedule (remove trailing comma)
CREATE TABLE exam_schedule
(
    ExamScheduleUID INT IDENTITY(1, 1) PRIMARY KEY,
    StartTime DATETIME,
    EndTime DATETIME,
    Location NVARCHAR(50),
    NumOfCandidate INT,
    Capacity INT,
    ExamTypeFID INT,
    FOREIGN KEY (ExamTypeFID) REFERENCES exam_type (ExamTypeUID)
);

-- 9. exam_schedule_room (remove duplicate type declaration `INT INT`)
CREATE TABLE exam_schedule_room
(
    ID INT IDENTITY(1, 1) PRIMARY KEY,
    ExamScheduleFID INT,
    RoomFID INT,
    NumOfCandidate INT,
    FOREIGN KEY (ExamScheduleFID) REFERENCES exam_schedule (ExamScheduleUID),
    FOREIGN KEY (RoomFID) REFERENCES room (RoomUID),
    CONSTRAINT UQ_ExamScheduleFID_RoomFID
        UNIQUE (
                   ExamScheduleFID,
                   RoomFID
               )
);

-- 10. registration_detail (remove duplicate type declaration `INT INT`)
CREATE TABLE registration_detail
(
    ID INT IDENTITY(1, 1) PRIMARY KEY,
    RegistrationFID INT,
    CandidateFID INT,
    ExamScheduleFID INT,
    RegistrationStatus INT,
    CandidateNumber VARCHAR(20),
    IsSentToCandidate BIT
        DEFAULT 0,
    FOREIGN KEY (RegistrationFID) REFERENCES registration (RegistrationUID),
    FOREIGN KEY (CandidateFID) REFERENCES candidate (CandidateUID),
    FOREIGN KEY (ExamScheduleFID) REFERENCES exam_schedule (ExamScheduleUID),
    CONSTRAINT UQ_RegistrationFID_CandidateFID_ExamScheduleFID
        UNIQUE (
                   RegistrationFID,
                   CandidateFID,
                   ExamScheduleFID
               )
);

-- 11. reschedule_request
CREATE TABLE reschedule_request
(
    RescheduleRequestUID INT IDENTITY(1, 1) PRIMARY KEY,
    RegistrationFID INT,
    Evidence TEXT,
    Status BIT
        DEFAULT 0,
    RequestTime DATETIME,
    ExamScheduleFID INT,
    FOREIGN KEY (RegistrationFID) REFERENCES registration (RegistrationUID),
    FOREIGN KEY (ExamScheduleFID) REFERENCES exam_schedule (ExamScheduleUID)
);

-- 12. payment
CREATE TABLE payment
(
    PaymentID INT IDENTITY(1, 1) PRIMARY KEY,
    PaymentMethod NVARCHAR(20),
    Payer NVARCHAR(20),
    Total VARCHAR(20),
    AmountPaid VARCHAR(20),
    ChangeGiven VARCHAR(20),
    Description TEXT,
    DueDate DATE,
    Discount INT,
    Status BIT
        DEFAULT 0,
    PaymentCode INT,
    ReScheduleRequestFID INT,
    RegistrationFID INT,
    FOREIGN KEY (ReScheduleRequestFID) REFERENCES reschedule_request (RescheduleRequestUID),
    FOREIGN KEY (RegistrationFID) REFERENCES registration (RegistrationUID)
);

-- 13. exam_result
CREATE TABLE exam_result
(
    ExamResultUID INT IDENTITY(1, 1) PRIMARY KEY,
    Status NVARCHAR(50),
    Content TEXT,
    Score FLOAT,
    RegistrationDetailFID INT,
    FOREIGN KEY (RegistrationDetailFID) REFERENCES registration_detail (ID)
);

-- 14. certificate
CREATE TABLE certificate
(
    CertificateUID INT IDENTITY(1, 1) PRIMARY KEY,
    Status NVARCHAR(50),
    CertificateName NVARCHAR(100),
    Content TEXT,
    RegistrationDetailFID INT,
    FOREIGN KEY (RegistrationDetailFID) REFERENCES registration_detail (ID)
);