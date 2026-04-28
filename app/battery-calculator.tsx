import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const DEFAULTS = {
  batteryVolts: '48',
  batteryAh: '20',
  chargePercent: '80',
  consumptionWhPerKm: '20',
  plannedDistanceKm: '25',
};

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function BatteryCalculatorScreen() {
  const [batteryVolts, setBatteryVolts] = useState(DEFAULTS.batteryVolts);
  const [batteryAh, setBatteryAh] = useState(DEFAULTS.batteryAh);
  const [chargePercent, setChargePercent] = useState(DEFAULTS.chargePercent);
  const [consumptionWhPerKm, setConsumptionWhPerKm] = useState(DEFAULTS.consumptionWhPerKm);
  const [plannedDistanceKm, setPlannedDistanceKm] = useState(DEFAULTS.plannedDistanceKm);

  const calculation = useMemo(() => {
    const volts = Math.max(0, toNumber(batteryVolts));
    const ah = Math.max(0, toNumber(batteryAh));
    const charge = Math.min(100, Math.max(0, toNumber(chargePercent)));
    const whPerKm = Math.max(0.1, toNumber(consumptionWhPerKm));
    const distance = Math.max(0, toNumber(plannedDistanceKm));

    const batteryWhFull = volts * ah;
    const availableWh = batteryWhFull * (charge / 100);
    const estimatedRangeKm = availableWh / whPerKm;
    const requiredWh = distance * whPerKm;
    const remainingWh = availableWh - requiredWh;
    const isTripFeasible = remainingWh >= 0;
    const reservePercent = batteryWhFull > 0 ? Math.max(0, (remainingWh / batteryWhFull) * 100) : 0;

    return {
      batteryWhFull,
      availableWh,
      estimatedRangeKm,
      requiredWh,
      remainingWh,
      isTripFeasible,
      reservePercent,
    };
  }, [batteryVolts, batteryAh, chargePercent, consumptionWhPerKm, plannedDistanceKm]);

  const resetDefaults = () => {
    setBatteryVolts(DEFAULTS.batteryVolts);
    setBatteryAh(DEFAULTS.batteryAh);
    setChargePercent(DEFAULTS.chargePercent);
    setConsumptionWhPerKm(DEFAULTS.consumptionWhPerKm);
    setPlannedDistanceKm(DEFAULTS.plannedDistanceKm);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Battery Calculator</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetDefaults}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Field
          label="Battery Voltage (V)"
          value={batteryVolts}
          onChangeText={setBatteryVolts}
          placeholder="48"
        />
        <Field
          label="Battery Capacity (Ah)"
          value={batteryAh}
          onChangeText={setBatteryAh}
          placeholder="20"
        />
        <Field
          label="Current Charge (%)"
          value={chargePercent}
          onChangeText={setChargePercent}
          placeholder="80"
        />
        <Field
          label="Consumption (Wh/km)"
          value={consumptionWhPerKm}
          onChangeText={setConsumptionWhPerKm}
          placeholder="20"
        />
        <Field
          label="Planned Distance (km)"
          value={plannedDistanceKm}
          onChangeText={setPlannedDistanceKm}
          placeholder="25"
        />
      </View>

      <View style={styles.resultCard}>
        <ResultRow label="Battery Size" value={`${calculation.batteryWhFull.toFixed(0)} Wh`} />
        <ResultRow label="Available Energy" value={`${calculation.availableWh.toFixed(0)} Wh`} />
        <ResultRow label="Estimated Range" value={`${calculation.estimatedRangeKm.toFixed(1)} km`} />
        <ResultRow label="Trip Energy Need" value={`${calculation.requiredWh.toFixed(0)} Wh`} />
        <ResultRow
          label={calculation.isTripFeasible ? 'Estimated Reserve' : 'Estimated Shortfall'}
          value={`${Math.abs(calculation.remainingWh).toFixed(0)} Wh`}
        />
      </View>

      <View
        style={[
          styles.verdictBanner,
          calculation.isTripFeasible ? styles.verdictGood : styles.verdictWarn,
        ]}
      >
        <Ionicons
          name={calculation.isTripFeasible ? 'checkmark-circle' : 'warning'}
          size={17}
          color={calculation.isTripFeasible ? '#198754' : '#B45309'}
        />
        <Text
          style={[
            styles.verdictText,
            calculation.isTripFeasible ? styles.verdictTextGood : styles.verdictTextWarn,
          ]}
        >
          {calculation.isTripFeasible
            ? `Trip looks feasible. Reserve ~${calculation.reservePercent.toFixed(1)}% of full battery.`
            : 'Trip may not be feasible. Consider charging stop or shorter distance.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
};

function Field({ label, value, onChangeText, placeholder }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
    </View>
  );
}

type ResultRowProps = {
  label: string;
  value: string;
};

function ResultRow({ label, value }: ResultRowProps) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  resetButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 10,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    color: '#111827',
    fontSize: 14,
  },
  resultCard: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '800',
  },
  verdictBanner: {
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  verdictGood: {
    backgroundColor: '#EAF9EE',
  },
  verdictWarn: {
    backgroundColor: '#FFF7E6',
  },
  verdictText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  verdictTextGood: {
    color: '#166534',
  },
  verdictTextWarn: {
    color: '#92400E',
  },
});
