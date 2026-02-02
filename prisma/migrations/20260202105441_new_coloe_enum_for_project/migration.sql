/*
  Warnings:

  - The `color` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProjectColor" AS ENUM ('RED', 'ORANGE', 'YELLOW', 'LIME', 'BLUE', 'PURPLE', 'PINK', 'TEAL', 'CORAL', 'GOLD', 'DEEP_BLUE', 'ROSE', 'LIGHT_RED', 'BRICK', 'SLATE');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "color",
ADD COLUMN     "color" "ProjectColor";
