export type MainViewType = 
  | 'En ligne'
  | 'correspondances' 
  | 'messages'
  | 'profile'
  | 'rechercher'
  | 'likes'
  | 'favoris'
  | 'dashboard'
  | 'vue de profil'
  | 'liste rouge';

export type SettingsViewType =
  | 'settings/email'
  | 'settings/password'
  | 'settings/profile'
  | 'settings/billing'
  | 'settings/language'
  | 'settings/help'
  | 'settings/subscribe';

export type ViewType = MainViewType | SettingsViewType;