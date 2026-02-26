import { initNavigation } from './navigation.js';
import { initBuyView } from './products.js';
import { initSubscriptions, renderSubscriptions } from './subscriptions.js';
import { initSettings } from './settings.js';

initNavigation((viewId) => {
  if (viewId === 'subscriptions') renderSubscriptions();
});

initBuyView();
initSubscriptions();
initSettings();
