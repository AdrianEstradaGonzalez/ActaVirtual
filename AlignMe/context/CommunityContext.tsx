/**
 * 🌍 COMMUNITY CONTEXT
 * ====================
 * Context para gestionar la comunidad seleccionada en toda la app.
 * Incluye persistencia en AsyncStorage.
 */

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommunityId, Theme, getTheme } from '../config/themes';
import { CommunityAssets, getCommunityAssets } from '../config/assets';

const STORAGE_KEY = '@alignme_community';

interface CommunityContextType {
  communityId: CommunityId | null;
  theme: Theme | null;
  assets: CommunityAssets | null;
  isLoading: boolean;
  setCommunity: (communityId: CommunityId) => Promise<void>;
  clearCommunity: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  const [communityId, setCommunityId] = useState<CommunityId | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar comunidad guardada al iniciar
  useEffect(() => {
    loadCommunity();
  }, []);

  const loadCommunity = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCommunityId(saved as CommunityId);
      }
    } catch (error) {
      console.error('Error loading community:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCommunity = async (newCommunityId: CommunityId) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newCommunityId);
      setCommunityId(newCommunityId);
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  const clearCommunity = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setCommunityId(null);
    } catch (error) {
      console.error('Error clearing community:', error);
    }
  };

  const theme = communityId ? getTheme(communityId) : null;
  const assets = communityId ? getCommunityAssets(communityId) : null;

  return (
    <CommunityContext.Provider
      value={{
        communityId,
        theme,
        assets,
        isLoading,
        setCommunity,
        clearCommunity,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

/**
 * 🎯 Hook para usar el contexto de comunidad
 */
export const useCommunity = (): CommunityContextType => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
