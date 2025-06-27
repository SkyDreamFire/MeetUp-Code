import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EmailSettings } from './EmailSettings';
import { PasswordSettings } from './PasswordSettings';
import { ProfileSettings } from './ProfileSettings';
import { BillingSettings } from './BillingSettings';
import { LanguageSettings } from './LanguageSettings';
import { HelpSettings } from './HelpSettings';
import { SubscribeSettings } from './SubscribeSettings';
import { LogoutHandler } from './LogoutHandler';

export const SettingsRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/settings/email" element={<EmailSettings />} />
      <Route path="/settings/password" element={<PasswordSettings />} />
      <Route path="/settings/profile" element={<ProfileSettings />} />
      <Route path="/settings/billing" element={<BillingSettings />} />
      <Route path="/settings/language" element={<LanguageSettings />} />
      <Route path="/settings/help" element={<HelpSettings />} />
      <Route path="/settings/subscribe" element={<SubscribeSettings />} />
      <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
      <Route path="/logout" element={<LogoutHandler />} />
    </Routes>
  );
};