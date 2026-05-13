export interface UserProfile {
  username: string;
  pronouns: string;
  email: string;
  //Biometría
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  trackingWeeks: number;
  //Preferencias
  activityLevel: string;
  allergens: string[];
}
