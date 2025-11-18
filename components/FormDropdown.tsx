import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Controller, Control, FieldError } from 'react-hook-form';

interface FormDropdownProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
  options: readonly string[] | string[];
  placeholder?: string;
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  name,
  control,
  label,
  error,
  options,
  placeholder = 'Select an option',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempValue, setTempValue] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          if (Platform.OS === 'ios') {
            // iOS: Use Modal with Picker
            return (
              <>
                <TouchableOpacity
                  style={[styles.input, error && styles.inputError]}
                  onPress={() => {
                    setTempValue(value || '');
                    setShowModal(true);
                  }}
                >
                  <Text style={[styles.inputText, !value && styles.placeholderText]}>
                    {value || placeholder}
                  </Text>
                  <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>

                <Modal
                  visible={showModal}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity
                          onPress={() => setShowModal(false)}
                          style={styles.modalButton}
                        >
                          <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{label}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            onChange(tempValue);
                            setShowModal(false);
                          }}
                          style={styles.modalButton}
                        >
                          <Text style={[styles.modalButtonText, styles.doneButton]}>
                            Done
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Picker
                        selectedValue={tempValue}
                        onValueChange={(itemValue) => setTempValue(itemValue as string)}
                        style={styles.iosPicker}
                      >
                        <Picker.Item label={placeholder} value="" />
                        {options.map((option) => (
                          <Picker.Item key={option} label={option} value={option} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </Modal>
              </>
            );
          } else {
            // Android: Use native Picker dropdown
            return (
              <View style={[styles.pickerContainer, error && styles.inputError]}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.androidPicker}
                  mode="dropdown"
                >
                  <Picker.Item label={placeholder} value="" color="#999" />
                  {options.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            );
          }
        }}
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  androidPicker: {
    height: 50,
  },
  iosPicker: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  doneButton: {
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});
