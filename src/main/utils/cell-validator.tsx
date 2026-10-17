import { ValidationMessage } from 'main/constants';
import moment from 'moment';

export const cellRequiredValidator = (cell: string, row: any, column: any) => {
  if (!cell) {
    return {
      valid: false,
      message: ValidationMessage.REQUIRED,
    };
  }
  return true;
};

export const cellDateValidator = (required: boolean, format?: string) => {
  return (cell: string, row: any, column: any) => {
    if (required && !cell) {
      return {
        valid: false,
        message: ValidationMessage.REQUIRED,
      };
    }
    const date = format ? moment(cell, format, true) : moment(cell);
    if (cell && !date.isValid()) {
      return {
        valid: false,
        message: ValidationMessage.INVALID_DATE,
      };
    }
    return true;
  };
};

export const cellQuantityValidator = (required: boolean) => {
  return (cell: string, row: any, column: any) => {
    if (required && !cell) {
      return {
        valid: false,
        message: ValidationMessage.REQUIRED,
      };
    }

    if (cell) {
      const numberValue = Number(cell);
      if (Number.isNaN(numberValue) || numberValue <= 0) {
        return {
          valid: false,
          message: ValidationMessage.INVALID_POSITIVE_NUMBER,
        };
      }
    }
    return true;
  };
};

export type MuiValidatorResult = { valid: boolean; message: string };

export const muiCellRequiredValidator = (cell: string, otherValidator?: () => MuiValidatorResult) => {
  if (!cell) {
    return {
      valid: false,
      message: ValidationMessage.REQUIRED,
    };
  }

  return otherValidator
    ? otherValidator()
    : {
        valid: true,
        message: '',
      };
};

export const muiCellDateValidator = (required: boolean, format?: string) => {
  return (cell: string, otherValidator?: () => MuiValidatorResult) => {
    if (required && !cell) {
      return {
        valid: false,
        message: ValidationMessage.REQUIRED,
      };
    }

    const date = format ? moment(cell, format, true) : moment(cell);
    if (cell && !date.isValid()) {
      return {
        valid: false,
        message: ValidationMessage.INVALID_DATE,
      };
    }

    return otherValidator
      ? otherValidator()
      : {
          valid: true,
          message: '',
        };
  };
};

export const muiCellQuantityValidator = (required: boolean) => {
  return (cell: string, otherValidator?: () => MuiValidatorResult) => {
    if (required && !cell) {
      return {
        valid: false,
        message: ValidationMessage.REQUIRED,
      };
    }

    if (cell) {
      const numberValue = Number(cell);
      if (Number.isNaN(numberValue) || numberValue <= 0) {
        return {
          valid: false,
          message: ValidationMessage.INVALID_POSITIVE_NUMBER,
        };
      }
    }

    return otherValidator
      ? otherValidator()
      : {
          valid: true,
          message: '',
        };
  };
};
