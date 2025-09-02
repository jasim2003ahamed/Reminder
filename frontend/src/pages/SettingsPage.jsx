import { Container, Typography, Box } from '@mui/material';
import BusinessInfoForm from '../setting/BusinessInfoForm';
import ReminderTemplatesForm from '../setting/ReminderTemplatesForm';
import NotificationSettingsForm from '../setting/NotificationSettingsForm';
import SettingsPag from '../setting/SettingsPage';

export default function SettingsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* <Box sx={{ mb: 4 }}>
        <BusinessInfoForm />
      </Box>
      <Box sx={{ mb: 4 }}>
        <ReminderTemplatesForm />
      </Box>
      <Box>
        <NotificationSettingsForm />
      </Box> */}
      <SettingsPag />
    </Container>
  );
}
