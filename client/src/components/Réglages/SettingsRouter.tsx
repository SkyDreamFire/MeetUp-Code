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
      <Route path="email" element={<EmailSettings />} />
      <Route path="password" element={<PasswordSettings />} />
      <Route path="profile" element={<ProfileSettings />} />
      <Route path="billing" element={<BillingSettings />} />
      <Route path="language" element={<LanguageSettings />} />
      <Route path="help" element={<HelpSettings />} />
      <Route path="subscribe" element={<SubscribeSettings />} />
    </Routes>
  );
};