import React, { ReactNode } from "react";

export enum SystemState {
  BOOT = "BOOT",
  LOGIN = "LOGIN",
  DESKTOP = "DESKTOP",
}

export type OSTheme = 'modern' | 'frutiger';

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

export type AppId = 'about' | 'projects' | 'skills' | 'terminal' | 'ai_chat' | 'contact' | 'snake' | 'pinball';

export interface AppConfig {
  id: AppId;
  title: string;
  icon: React.FC<any>;
  color: string;
}