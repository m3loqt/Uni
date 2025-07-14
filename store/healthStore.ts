import { create } from 'zustand';
import { HealthData, Appointment, Prescription, Certificate } from '@/types';

interface HealthState {
  healthData: HealthData;
  appointments: Appointment[];
  prescriptions: Prescription[];
  certificates: Certificate[];
  loading: {
    healthData: boolean;
    appointments: boolean;
    prescriptions: boolean;
    certificates: boolean;
  };
  error: {
    healthData: string | null;
    appointments: string | null;
    prescriptions: string | null;
    certificates: string | null;
  };
  setHealthData: (data: HealthData) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setPrescriptions: (prescriptions: Prescription[]) => void;
  setCertificates: (certificates: Certificate[]) => void;
  setLoading: (key: keyof HealthState['loading'], loading: boolean) => void;
  setError: (key: keyof HealthState['error'], error: string | null) => void;
  clearError: (key: keyof HealthState['error']) => void;
  clearAllErrors: () => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  healthData: {
    heartRate: 72,
    steps: 8432,
    sleep: 7.5,
    lastUpdated: new Date().toISOString(),
  },
  appointments: [],
  prescriptions: [],
  certificates: [],
  loading: {
    healthData: false,
    appointments: false,
    prescriptions: false,
    certificates: false,
  },
  error: {
    healthData: null,
    appointments: null,
    prescriptions: null,
    certificates: null,
  },
  setHealthData: (healthData) => set({ healthData }),
  setAppointments: (appointments) => set({ appointments }),
  setPrescriptions: (prescriptions) => set({ prescriptions }),
  setCertificates: (certificates) => set({ certificates }),
  setLoading: (key, loading) => 
    set((state) => ({ 
      loading: { ...state.loading, [key]: loading } 
    })),
  setError: (key, error) => 
    set((state) => ({ 
      error: { ...state.error, [key]: error },
      loading: { ...state.loading, [key]: false }
    })),
  clearError: (key) => 
    set((state) => ({ 
      error: { ...state.error, [key]: null } 
    })),
  clearAllErrors: () => 
    set((state) => ({ 
      error: {
        healthData: null,
        appointments: null,
        prescriptions: null,
        certificates: null,
      }
    })),
}));