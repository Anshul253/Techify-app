"use client";
import ATSChecker from "@/components/ATSChecker";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ATSCheckerPage() {
  return (
    <ProtectedRoute>
      <ATSChecker />
    </ProtectedRoute>
  );
}