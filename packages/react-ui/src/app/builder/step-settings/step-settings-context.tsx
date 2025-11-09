import { TObject, Type } from '@sinclair/typebox';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  PieceMetadataModel,
  PiecePropertyMap,
} from '@activepieces/pieces-framework';
import { FlowAction, setAtPath, FlowTrigger } from '@activepieces/shared';

import { formUtils } from '../../../features/pieces/lib/form-utils';

const numberReplacement = 'anyOf[0]items';
const stringReplacement = 'properties.';
const createUpdatedSchemaKey = (propertyKey: string) => {
  return propertyKey
    .split('.')
    .map((part) => {
      if (part === '') {
        return ''; // Keep empty parts intact (for consecutive dots)
      } else if (!isNaN(Number(part))) {
        return numberReplacement;
      } else {
        return `${stringReplacement}${part}`;
      }
    })
    .join('.');
};

export type StepSettingsContextState = {
  selectedStep: FlowAction | FlowTrigger;
  pieceModel: PieceMetadataModel | undefined;
  formSchema: TObject<any>;
  updateFormSchema: (key: string, newFieldSchema: PiecePropertyMap) => void;
};

export type StepSettingsProviderProps = {
  selectedStep: FlowAction | FlowTrigger;
  pieceModel: PieceMetadataModel | undefined;
  children: ReactNode;
};

const StepSettingsContext = createContext<StepSettingsContextState | undefined>(
  undefined,
);

export const StepSettingsProvider = ({
  selectedStep,
  pieceModel,
  children,
}: StepSettingsProviderProps) => {
  const [formSchema, setFormSchema] = useState<TObject<any>>(
    Type.Object(Type.Unknown()),
  );
  const previousPieceModelRef = useRef<PieceMetadataModel | undefined>(undefined);

  // Rebuild schema when pieceModel changes (e.g., when locale changes and piece is retranslated)
  // This ensures piece properties are updated with new translations
  useEffect(() => {
    if (selectedStep && pieceModel !== previousPieceModelRef.current) {
      const schema = formUtils.buildPieceSchema(
        selectedStep.type,
        selectedStep.settings.actionName ?? selectedStep.settings.triggerName,
        pieceModel ?? null,
      );
      setFormSchema(schema as TObject<any>);
      previousPieceModelRef.current = pieceModel;
    }
  }, [selectedStep, pieceModel]);

  const updateFormSchema = useCallback(
    (key: string, newFieldPropertyMap: PiecePropertyMap) => {
      setFormSchema((prevSchema) => {
        const newFieldSchema = formUtils.buildSchema(newFieldPropertyMap);
        const currentSchema = { ...prevSchema };
        const keyUpdated = createUpdatedSchemaKey(key);
        setAtPath(currentSchema, keyUpdated, newFieldSchema);
        return currentSchema;
      });
    },
    [],
  );
  return (
    <StepSettingsContext.Provider
      value={{
        selectedStep,
        pieceModel,
        formSchema,
        updateFormSchema,
      }}
    >
      {children}
    </StepSettingsContext.Provider>
  );
};

export const useStepSettingsContext = () => {
  const context = useContext(StepSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useStepSettingsContext must be used within a PieceSettingsProvider',
    );
  }
  return context;
};
