import { Intent, Position, Toaster } from '@blueprintjs/core';

const toaster = Toaster.create({
  position: Position.BOTTOM_RIGHT,
  canEscapeKeyClear: true,
});

const standard = (message) => {
  toaster.show({ message, intent: Intent.PRIMARY });
};

const danger = (message) => {
  toaster.show({ message, intent: Intent.DANGER });
};

const success = (message) => {
  toaster.show({ message, intent: Intent.SUCCESS });
};

const warning = (message) => {
  toaster.show({ message, intent: Intent.WARNING });
};

export default {
  toaster,
  standard,
  danger,
  success,
  warning,
};
