-- Lưu mức đường/đá (%) của từng món trong đơn (rà soát 13/11/2026).
ALTER TABLE "OrderItem" ADD COLUMN "sugar" INTEGER NOT NULL DEFAULT 100;
ALTER TABLE "OrderItem" ADD COLUMN "ice" INTEGER NOT NULL DEFAULT 100;
