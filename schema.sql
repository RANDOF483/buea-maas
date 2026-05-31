-- Add the new column to the User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetRequested" BOOLEAN NOT NULL DEFAULT false;

-- Insert the Master Admin account
INSERT INTO "User" (id, name, email, "phoneNumber", password, role, "balanceFCFA", "resetRequested", "updatedAt") 
VALUES ('usr_admin_master', 'Master Admin', 'admin@bueamaas.com', '+237999999999', '$2b$10$43p3gNsaABswfggQtVcwJePbfuYMrmejT//tO2LHha.ULsseaVADy', 'ADMIN', 0, false, CURRENT_TIMESTAMP)
ON CONFLICT ("phoneNumber") DO NOTHING;
