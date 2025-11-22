import React, { ReactNode } from "react";

export enum SystemState {
  BOOT = "BOOT",
  LOGIN = "LOGIN",
  DESKTOP = "DESKTOP",
}

export interface WindowState {
  id: string;
  title: string;
  icon: ReactNode;
  component: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type AppId = 'about' | 'projects' | 'skills' | 'terminal' | 'ai_chat' | 'contact' | 'snake';

export interface AppConfig {
  id: AppId;
  title: string;
  icon: React.FC<any>;
  color: string;
}