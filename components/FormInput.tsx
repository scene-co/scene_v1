import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  KeyboardTypeOptions,
} from 'react-native';
import { Controller, Control, FieldError } from 'react-hook-form';

interface FormInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  error,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  ...rest
}) => {
  const isNumericInput = keyboardType === 'number-pad' || keyboardType === 'numeric';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, error && styles.inputError]}
            onBlur={onBlur}
            onChangeText={(text) => {
              // Convert to number if it's a numeric input
              if (isNumericInput) {
                const numValue = text === '' ? undefined : parseInt(text, 10);
                onChange(numValue);
              } else {
                onChange(text);
              }
            }}
            value={value?.toString() || ''}
            placeholder={placeholder}
            placeholderTextColor="#999"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            {...rest}
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});
