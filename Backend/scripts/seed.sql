USE QL_TRUNG_TAM;
GO

INSERT INTO dbo.role
(
    RoleName
)
VALUES
(N'admin' -- RoleName - nvarchar(20)
    ),
(N'receptionist' -- RoleName - nvarchar(20)
),
(N'cashier' -- RoleName - nvarchar(20)
),
(N'data entry clerk' -- RoleName - nvarchar(20)
),
(N'default role' -- RoleName - nvarchar(20)
);