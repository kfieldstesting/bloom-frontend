import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import { RootState } from '../../app/store';
import { FeatureFlag } from '../../config/featureFlag';
import { USER_BANNER_DISMISSED, USER_BANNER_INTERESTED } from '../../constants/events';
import { useTypedSelector } from '../../hooks/store';
import logEvent, { getEventUserData } from '../../utils/logEvent';

const alertStyle = {
  backgroundColor: 'secondary.light',
  color: 'text.primary',
  boxShadow: 1,
  borderRadius: 0.6,
  padding: 2,
  'flex-direction': 'column',
};

const USER_RESEARCH_BANNER_INTERACTED = 'user_research_banner_interacted';
const USER_RESEARCH_FORM_LINK =
  'https://docs.google.com/forms/d/e/1FAIpQLSe0RFpeiqi-PGGUvMcW3esFzzfyg55aAD2E07NT1JuvA5tMFw/viewform';

export default function UserResearchBanner() {
  const [open, setOpen] = React.useState(true);

  const { user, partnerAccesses, partnerAdmin } = useTypedSelector((state: RootState) => state);

  const eventData = getEventUserData({ user, partnerAccesses, partnerAdmin });

  const router = useRouter();
  const userBannerCookieKey = `${USER_RESEARCH_BANNER_INTERACTED}-${user.id?.slice(0, 6)}`;
  const isBannerNotInteracted = !Boolean(Cookies.get(userBannerCookieKey));
  const isBannerFeatureEnabled = FeatureFlag.isUserResearchBannerEnabled();
  const isPublicUser = partnerAccesses.length === 0;

  const showBanner = isBannerFeatureEnabled && isPublicUser && isBannerNotInteracted;

  return showBanner ? (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Collapse in={open}>
        <Alert
          icon={false}
          sx={alertStyle}
          action={
            <>
              <Button
                color="inherit"
                size="medium"
                onClick={() => {
                  Cookies.set(userBannerCookieKey, 'true');
                  logEvent(USER_BANNER_INTERESTED, eventData);

                  setOpen(false);

                  window.open(USER_RESEARCH_FORM_LINK, '_blank', 'noopener,noreferrer');
                }}
              >
                I’m interested
              </Button>
              <Button
                color="inherit"
                size="medium"
                onClick={() => {
                  Cookies.set(userBannerCookieKey, 'true');
                  logEvent(USER_BANNER_DISMISSED, eventData);

                  setOpen(false);
                }}
              >
                Dismiss
              </Button>
            </>
          }
        >
          <AlertTitle>
            <strong>Take part in paid Bloom research</strong>
          </AlertTitle>
          We’re looking to speak to Bloom users. In this paid research, you’ll test out some new
          designs and give us your feedback. Find out more details and register your interest below!
        </Alert>
      </Collapse>
    </Stack>
  ) : null;
}
