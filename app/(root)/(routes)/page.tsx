"use client";

import { Modal } from "@/components/ui/modal";
import { UserButton } from "@clerk/nextjs";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";
import React from "react";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if(!isOpen) {
      onOpen();
    }
  }, [onOpen, isOpen]);

  return null;
};

export default SetupPage;
